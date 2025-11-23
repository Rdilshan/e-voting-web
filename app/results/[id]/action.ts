"use server";

import {ethers} from "ethers";
import Zk_election from "../../smartContract/Zk_election.json";
import {retryWithBackoff} from "@/app/lib/helper";
import {
	ElectionResultsResponse,
	ElectionDataArray,
	CandidateDataArray,
} from "@/app/lib/interface";
import {getServiceRoleClient} from "@/service/supabase";

export async function getElectionResults(
	electionId: number
): Promise<ElectionResultsResponse> {
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

		const totalEligibleVoters = BigInt(votersData?.length || 0);

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
				error: "Election not found on blockchain",
			};
		}

		// Step 5: Transform blockchain data to match ElectionResultsResponse format
		// ElectionDataArray: [string, string, bigint, bigint, bigint, boolean]
		// [title, description, startDate, endDate, totalVotes, exists]
		const electionDataArray: ElectionDataArray = [
			electionStruct.electionTitle || supabaseElection.title || "",
			electionStruct.description || supabaseElection.description || "",
			electionStruct.startDate,
			electionStruct.endDate,
			electionStruct.totalVotes,
			electionStruct.exists,
		];

		// Transform candidates: CandidateDataArray[] = [string, string, string, bigint][]
		// [name, nic, party, voteCount]
		const candidatesDataArray: CandidateDataArray[] = candidatesData.map(
			(candidate: {
				name: string;
				nic: string;
				party: string;
				voteCount: bigint;
			}) => [
				candidate.name || "",
				candidate.nic || "",
				candidate.party || "Independent",
				candidate.voteCount,
			]
		);

		// Return in the format expected by ElectionResultsResponse
		// [ElectionDataArray, CandidateDataArray[], bigint]
		return {
			success: true,
			results: [electionDataArray, candidatesDataArray, totalEligibleVoters],
		};
	} catch (error: unknown) {
		console.error("Error getting election results:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			success: false,
			error: errorMessage,
		};
	}
}
