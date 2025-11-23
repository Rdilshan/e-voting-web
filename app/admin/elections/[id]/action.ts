"use server";

import {ethers} from "ethers";
import Zk_election from "../../../smartContract/Zk_election.json";
import {retryWithBackoff} from "@/app/lib/helper";
import {
	ElectionDetailsCandidate,
	ElectionDetailsVoter,
	ElectionDetailsData,
} from "@/app/lib/interface";
import {getServiceRoleClient} from "@/service/supabase";

export async function getElectionDetails(electionId: number): Promise<{
	success: boolean;
	data?: ElectionDetailsData;
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

		// Step 1: Get election from Supabase database
		const supabase = getServiceRoleClient();
		const {data: supabaseElection, error: supabaseError} = await supabase
			.from("election")
			.select("*")
			.eq("election_id", electionId)
			.single();

		if (supabaseError || !supabaseElection) {
			return {
				success: false,
				error: "Election not found",
				message: "The election does not exist in the database",
			};
		}

		// Step 2: Get voters from Supabase for this election
		const {data: votersData, error: votersError} = await supabase
			.from("voter")
			.select("*")
			.eq("election_id", electionId);

		if (votersError) {
			console.error("Error fetching voters from Supabase:", votersError);
			// Continue even if voters fetch fails
		}

		const totalVoters = votersData?.length || 0;

		// Step 3: Setup blockchain connection
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

		// Step 4: Get election data from blockchain
		const electionData = await retryWithBackoff(async () => {
			return await zkElectionContract.getElectionData(electionId);
		});

		// electionData returns: [Election struct, Candidate[]]
		const [electionStruct, candidatesData] = electionData;

		// Check if election exists on blockchain
		if (!electionStruct.exists) {
			return {
				success: false,
				error: "Election not found",
				message: "The election does not exist on the blockchain",
			};
		}

		// Extract election data from struct
		const startDate = Number(electionStruct.startDate) || 0;
		const endDate = Number(electionStruct.endDate) || 0;
		const totalVotes = Number(electionStruct.totalVotes) || 0;

		// Determine status
		const now = Math.floor(Date.now() / 1000);
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
		const candidates: ElectionDetailsCandidate[] = candidatesData.map(
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
					nic: candidate.nic || "",
					party: candidate.party || "Independent",
					votes: voteCount,
					percentage: parseFloat(percentage.toFixed(1)),
				};
			}
		);

		// Sort candidates by votes (descending)
		candidates.sort((a, b) => b.votes - a.votes);

		const voters: ElectionDetailsVoter[] =
			votersData?.map(() => ({
				nic: "", // NIC not stored in voter table, only wallet_address
				hasVoted: false, // Cannot determine for ZK elections
				candidateIndex: undefined,
			})) || [];

		return {
			success: true,
			data: {
				id: electionId,
				title: electionStruct.electionTitle || supabaseElection.title || "",
				description:
					electionStruct.description || supabaseElection.description || "",
				status,
				startDate,
				endDate,
				totalVotes,
				totalVoters,
				turnout: parseFloat(turnout.toFixed(1)),
				candidates,
				voters,
			},
		};
	} catch (error: unknown) {
		console.error("Error getting election details:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			success: false,
			error: errorMessage,
			message: "Failed to get election details",
		};
	}
}
