"use server";

import {ethers} from "ethers";
import ElectionContract from "../../smartContract/Election.json";
import {retryWithBackoff} from "@/app/lib/helper";

export interface DashboardElectionData {
	id: number;
	title: string;
	description: string;
	status: "active" | "completed" | "upcoming";
	startDate: number;
	endDate: number;
	totalVotes: number;
	totalEligibleVoters: number;
	candidateCount: number;
}

export interface DashboardData {
	totalElections: number;
	activeElections: number;
	totalVoters: number;
	totalCandidates: number;
	totalVotes: number;
	voterTurnout: number;
	recentElections: DashboardElectionData[];
}

export async function getDashboardData(): Promise<{
	success: boolean;
	data?: DashboardData;
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
		const elections: DashboardElectionData[] = [];
		let totalVoters = 0;
		let totalCandidates = 0;
		let totalVotes = 0;
		let activeElections = 0;

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

				// Determine status
				let status: "active" | "completed" | "upcoming";
				if (now < startDate) {
					status = "upcoming";
				} else if (now > endDate) {
					status = "completed";
				} else {
					status = "active";
					activeElections++;
				}

				const candidateCount = Array.isArray(candidatesData)
					? candidatesData.length
					: 0;
				const eligibleVotersCount = Number(eligibleVoters) || 0;

				totalVoters += eligibleVotersCount;
				totalCandidates += candidateCount;
				totalVotes += votes;

				elections.push({
					id: electionId,
					title: electionInfo[0] || "",
					description: electionInfo[1] || "",
					status,
					startDate,
					endDate,
					totalVotes: votes,
					totalEligibleVoters: eligibleVotersCount,
					candidateCount,
				});
			} catch (error) {
				console.error(`Error fetching election ${electionId}:`, error);
				// Continue with other elections even if one fails
			}
		}

		// Sort elections by end date (most recent first)
		elections.sort((a, b) => b.endDate - a.endDate);

		// Get recent elections (last 5)
		const recentElections = elections.slice(0, 5);

		// Calculate voter turnout (average across all elections)
		const completedElections = elections.filter(
			(e) => e.status === "completed"
		);
		let voterTurnout = 0;
		if (completedElections.length > 0) {
			const totalEligible = completedElections.reduce(
				(sum, e) => sum + e.totalEligibleVoters,
				0
			);
			const totalVotesCompleted = completedElections.reduce(
				(sum, e) => sum + e.totalVotes,
				0
			);
			voterTurnout =
				totalEligible > 0 ? (totalVotesCompleted / totalEligible) * 100 : 0;
		}

		return {
			success: true,
			data: {
				totalElections: elections.length,
				activeElections,
				totalVoters,
				totalCandidates,
				totalVotes,
				voterTurnout: Math.round(voterTurnout * 10) / 10, // Round to 1 decimal
				recentElections,
			},
		};
	} catch (error: unknown) {
		console.error("Error getting dashboard data:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			success: false,
			error: errorMessage,
			message: "Failed to get dashboard data",
		};
	}
}
