"use server";

import {retryWithBackoff} from "@/app/lib/helper";
import {ElectionListData} from "@/app/lib/interface";
import {ethers} from "ethers";
import Zk_election from "../../smartContract/Zk_election.json";
import {getServiceRoleClient} from "@/service/supabase";
import {auth} from "@/auth";

export async function getAllElections(): Promise<{
	success: boolean;
	data?: ElectionListData[];
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

		const session = await auth();

		if (!session) {
			throw new Error("Unauthorized");
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
		const elections: ElectionListData[] = [];

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

				// Extract election data from struct
				const startDate = Number(electionStruct.startDate) || 0;
				const endDate = Number(electionStruct.endDate) || 0;
				const totalVotes = Number(electionStruct.totalVotes) || 0;
				const candidateCount = Array.isArray(candidatesData)
					? candidatesData.length
					: 0;

				// Get voter count from Supabase (or use blockchain data if Supabase fails)
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

				// Combine Supabase data with blockchain data
				// Prefer blockchain data for title/description as it's the source of truth
				elections.push({
					id: electionId,
					title: electionStruct.electionTitle || supabaseElection.title || "",
					description:
						electionStruct.description || supabaseElection.description || "",
					status,
					startDate,
					endDate,
					totalCandidates: candidateCount,
					totalVoters: totalVoters || 0,
					totalVotes,
					turnout: parseFloat(turnout.toFixed(1)),
				});
			} catch (error) {
				console.error(
					`Error fetching election ${electionId} from blockchain:`,
					error
				);
				// If blockchain fetch fails, use Supabase data only
				const startDate = supabaseElection.start_date
					? Math.floor(new Date(supabaseElection.start_date).getTime() / 1000)
					: 0;
				const endDate = supabaseElection.end_date
					? Math.floor(new Date(supabaseElection.end_date).getTime() / 1000)
					: 0;

				let status: "active" | "completed" | "upcoming";
				if (now < startDate) {
					status = "upcoming";
				} else if (now > endDate) {
					status = "completed";
				} else {
					status = "active";
				}

				const totalVoters = voterCountMap.get(electionId) || 0;
				const turnout = totalVoters > 0 ? 0 : 0;

				elections.push({
					id: electionId,
					title: supabaseElection.title || "",
					description: supabaseElection.description || "",
					status,
					startDate,
					endDate,
					totalCandidates: 0, // Unknown from Supabase
					totalVoters,
					totalVotes: 0, // Unknown from Supabase
					turnout: parseFloat(turnout.toFixed(1)),
				});
			}
		}

		// Sort elections by end date (most recent first)
		elections.sort((a, b) => b.endDate - a.endDate);

		return {
			success: true,
			data: elections,
		};
	} catch (error: unknown) {
		console.error("Error getting elections:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			success: false,
			error: errorMessage,
			message: "Failed to get elections",
		};
	}
}
