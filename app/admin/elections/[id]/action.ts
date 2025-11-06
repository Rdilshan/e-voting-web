"use server";

import { ethers } from "ethers";
import ElectionContract from "../../../smartContract/Election.json";
import { retryWithBackoff } from "@/app/lib/helper";
import {
	CandidateDataArray,
	ElectionDetailsCandidate,
	ElectionDetailsVoter,
	ElectionDetailsData,
} from "@/app/lib/interface";

export async function getElectionDetails(
	electionId: number
): Promise<{
	success: boolean;
	data?: ElectionDetailsData;
	error?: string;
	message?: string;
}> {
	try {
		if (
			!process.env.WALLET_PRIVATE_KEY ||
			!process.env.RPC_URL ||
			!process.env.ELECTION_ADDRESS
		) {
			throw new Error(
				"Missing required environment variables: WALLET_PRIVATE_KEY, RPC_URL, ELECTION_ADDRESS"
			);
		}

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

		const electionContract = new ethers.Contract(
			process.env.ELECTION_ADDRESS,
			ElectionContract,
			systemWallet
		);

		// Get election data
		const electionData = await retryWithBackoff(async () => {
			return await electionContract.getElectionData(electionId);
		});

		// Election data: [electionTitle, description, startDate, endDate, totalVotes, exists]
		const [electionInfo, candidatesData, eligibleVoters] = electionData;

		// Check if election exists
		if (!electionInfo[5]) {
			return {
				success: false,
				error: "Election not found",
				message: "The election does not exist",
			};
		}

		// Access election struct as array (ethers.js converts structs to arrays)
		const startDate = Number(electionInfo[2]) || 0;
		const endDate = Number(electionInfo[3]) || 0;
		const votes = Number(electionInfo[4]) || 0;
		const eligibleVotersCount = Number(eligibleVoters) || 0;

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
		const turnout =
			eligibleVotersCount > 0 ? (votes / eligibleVotersCount) * 100 : 0;

		// Transform candidates: [[name, nic, party, voteCount], ...]
		const candidates: ElectionDetailsCandidate[] = candidatesData.map(
			(candidate: CandidateDataArray, index: number) => {
				const voteCount = Number(candidate[3] || 0);
				const totalVotes = votes || 1; // Avoid division by zero
				const percentage =
					totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

				return {
					id: index,
					name: candidate[0] || "",
					nic: candidate[1] || "",
					party: candidate[2] || "Independent",
					votes: voteCount,
					percentage: parseFloat(percentage.toFixed(1)),
				};
			}
		);

		// Sort candidates by votes (descending)
		candidates.sort((a, b) => b.votes - a.votes);

		// Get voter information
		// Note: The contract stores voter NICs in electionVoterNICs mapping
		// but doesn't expose a direct way to get all NICs at once
		// We'll try to get voters by iterating through potential indices
		// This is a limitation - in production, you might want to add a view function
		// to return all voter NICs for an election
		const voters: ElectionDetailsVoter[] = [];
		
		// Attempt to get voters by checking voter info for each NIC
		// Since we don't have a direct list, we'll populate what we can
		// The client will show voter count and basic info
		// For detailed voter lists, you'd need to maintain an off-chain index

		return {
			success: true,
			data: {
				id: electionId,
				title: electionInfo[0] || "",
				description: electionInfo[1] || "",
				status,
				startDate,
				endDate,
				totalVotes: votes,
				totalVoters: eligibleVotersCount,
				turnout: parseFloat(turnout.toFixed(1)),
				candidates,
				voters, // Empty for now - would need additional contract calls
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
