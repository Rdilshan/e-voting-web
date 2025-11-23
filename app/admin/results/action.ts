"use server";

import {ethers} from "ethers";
import Zk_election from "../../smartContract/Zk_election.json";
import {retryWithBackoff} from "@/app/lib/helper";
import {ElectionCandidate, AdminElectionData} from "@/app/lib/interface";
import {getServiceRoleClient} from "@/service/supabase";

export async function getAllElectionsResults(): Promise<{
	success: boolean;
	data?: AdminElectionData[];
	error?: string;
	message?: string;
}> {
	try {
		// Validate environment variables
		if (
			!process.env.WALLET_PRIVATE_KEY ||
			!process.env.RPC_URL ||
			!process.env.ZK_ELECTIONCONTRACT
		) {
			throw new Error(
				"Missing required environment variables: WALLET_PRIVATE_KEY, RPC_URL, ZK_ELECTIONCONTRACT"
			);
		}

		// Step 1: Get elections from Supabase database
		const supabase = getServiceRoleClient();
		const {data: supabaseElections, error: supabaseError} = await supabase
			.from("election")
			.select("*")
			.order("created_at", {ascending: false});

		if (supabaseError) {
			console.error("Error fetching elections from Supabase:", supabaseError);
			throw new Error(
				`Failed to fetch elections from database: ${supabaseError.message}`
			);
		}

		if (!supabaseElections || supabaseElections.length === 0) {
			return {
				success: true,
				data: [],
			};
		}

		// Step 2: Setup blockchain connection
		const provider = new ethers.JsonRpcProvider(
			process.env.RPC_URL,
			undefined,
			{
				staticNetwork: true,
			}
		);

		const systemWallet = new ethers.Wallet(
			process.env.WALLET_PRIVATE_KEY,
			provider
		);

		const zkElectionContract = new ethers.Contract(
			process.env.ZK_ELECTIONCONTRACT,
			Zk_election,
			systemWallet
		);

		// Step 3: Get voters from Supabase for all elections
		const electionIds = supabaseElections
			.map((e) => e.election_id)
			.filter((id) => id !== null);
		const {data: allVoters, error: votersError} = await supabase
			.from("voter")
			.select("*")
			.in("election_id", electionIds);

		if (votersError) {
			console.error("Error fetching voters from Supabase:", votersError);
			// Continue even if voters fetch fails
		}

		// Create a map of election_id to voter count
		const voterCountMap = new Map<number, number>();
		if (allVoters) {
			allVoters.forEach((voter) => {
				const electionId = Number(voter.election_id);
				voterCountMap.set(electionId, (voterCountMap.get(electionId) || 0) + 1);
			});
		}

		// Step 4: Fetch blockchain data for each election and combine with Supabase data
		const now = Math.floor(Date.now() / 1000);
		const elections: AdminElectionData[] = [];

		for (const supabaseElection of supabaseElections) {
			const electionId = Number(supabaseElection.election_id);

			if (!electionId && electionId !== 0) {
				console.warn(
					`Skipping election with invalid ID: ${supabaseElection.id}`
				);
				continue;
			}

			try {
				// Get election data from blockchain
				const electionData = await retryWithBackoff(async () => {
					return await zkElectionContract.getElectionData(electionId);
				});

				// electionData returns: [Election struct, Candidate[]]
				const [electionStruct, candidatesData] = electionData;

				// Check if election exists on blockchain
				if (!electionStruct.exists) {
					console.warn(`Election ${electionId} not found on blockchain`);
					continue;
				}

				// Extract election data from struct
				const startDate = Number(electionStruct.startDate) || 0;
				const endDate = Number(electionStruct.endDate) || 0;
				const totalVotes = Number(electionStruct.totalVotes) || 0;

				// Get voter count from Supabase
				const totalVoters = voterCountMap.get(electionId) || 0;

				// Determine status
				let status: "active" | "completed" | "upcoming";
				if (now < startDate) {
					status = "upcoming";
				} else if (now > endDate) {
					status = "completed";
				} else {
					status = "active";
				}

				// Calculate turnout
				const turnout = totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0;

				// Transform candidates from blockchain
				// Candidate struct: { name: string, nic: string, party: string, voteCount: bigint }
				const candidates: ElectionCandidate[] = candidatesData.map(
					(
						candidate: {
							name: string;
							nic: string;
							party: string;
							voteCount: bigint;
						},
						index: number
					) => {
						const voteCount = Number(candidate.voteCount || 0);
						const totalVotesForCalc = totalVotes || 1; // Avoid division by zero
						const percentage =
							totalVotesForCalc > 0 ? (voteCount / totalVotesForCalc) * 100 : 0;

						return {
							id: index,
							name: candidate.name || "",
							party: candidate.party || "Independent",
							votes: voteCount,
							percentage: parseFloat(percentage.toFixed(1)),
						};
					}
				);

				// Sort candidates by votes (descending)
				candidates.sort((a, b) => b.votes - a.votes);

				elections.push({
					id: electionId,
					title: electionStruct.electionTitle || supabaseElection.title || "",
					description:
						electionStruct.description || supabaseElection.description || "",
					status,
					totalVoters,
					totalVotes,
					turnout: parseFloat(turnout.toFixed(1)),
					endDate,
					candidates,
				});
			} catch (error) {
				console.error(
					`Error fetching election ${electionId} from blockchain:`,
					error
				);
				// If blockchain fetch fails, skip this election for results
				// Results require blockchain data for vote counts
			}
		}

		// Sort elections by end date (most recent first)
		elections.sort((a, b) => b.endDate - a.endDate);

		return {
			success: true,
			data: elections,
		};
	} catch (error: unknown) {
		console.error("Error getting elections results:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			success: false,
			error: errorMessage,
			message: "Failed to get elections results",
		};
	}
}
