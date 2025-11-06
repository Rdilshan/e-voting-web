"use server";

import {retryWithBackoff} from "@/app/lib/helper";
import {ElectionListData} from "@/app/lib/interface";
import {ethers} from "ethers";
import ElectionContract from "../../smartContract/Election.json";

export async function getAllElections(): Promise<{
	success: boolean;
	data?: ElectionListData[];
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

		// Get all election IDs
		const electionIds = await retryWithBackoff(async () => {
			return await electionContract.getAllElectionList();
		});

		const now = Math.floor(Date.now() / 1000);
		const elections: ElectionListData[] = [];

		// Fetch data for each election
		for (const electionIdBigInt of electionIds) {
			const electionId = Number(electionIdBigInt);

			try {
				const electionData = await retryWithBackoff(async () => {
					return await electionContract.getElectionData(electionId);
				});

				// Election data: [electionTitle, description, startDate, endDate, totalVotes, exists]
				const [electionInfo, candidatesData, eligibleVoters] = electionData;

				// Access election struct as array (ethers.js converts structs to arrays)
				const startDate = Number(electionInfo[2]) || 0;
				const endDate = Number(electionInfo[3]) || 0;
				const votes = Number(electionInfo[4]) || 0;
				const eligibleVotersCount = Number(eligibleVoters) || 0;
				const candidateCount = Array.isArray(candidatesData)
					? candidatesData.length
					: 0;

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
				const turnout =
					eligibleVotersCount > 0 ? (votes / eligibleVotersCount) * 100 : 0;

				elections.push({
					id: electionId,
					title: electionInfo[0] || "",
					description: electionInfo[1] || "",
					status,
					startDate,
					endDate,
					totalCandidates: candidateCount,
					totalVoters: eligibleVotersCount,
					totalVotes: votes,
					turnout: parseFloat(turnout.toFixed(1)),
				});
			} catch (error) {
				console.error(`Error fetching election ${electionId}:`, error);
				// Continue with other elections even if one fails
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
