"use server";

import {ethers} from "ethers";
import Zk_election from "../../smartContract/Zk_election.json";
import {retryWithBackoff} from "@/app/lib/helper";
import {getServiceRoleClient} from "@/service/supabase";

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
				data: {
					totalElections: 0,
					activeElections: 0,
					totalVoters: 0,
					totalCandidates: 0,
					totalVotes: 0,
					voterTurnout: 0,
					recentElections: [],
				},
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

		// Step 4: Fetch blockchain data for each election and calculate statistics
		const now = Math.floor(Date.now() / 1000);
		const elections: DashboardElectionData[] = [];
		let totalVoters = 0;
		let totalCandidates = 0;
		let totalVotes = 0;
		let activeElections = 0;

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
				const votes = Number(electionStruct.totalVotes) || 0;

				// Get voter count from Supabase
				const eligibleVotersCount = voterCountMap.get(electionId) || 0;
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
					activeElections++;
				}

				// Accumulate statistics
				totalVoters += eligibleVotersCount;
				totalCandidates += candidateCount;
				totalVotes += votes;

				elections.push({
					id: electionId,
					title: electionStruct.electionTitle || supabaseElection.title || "",
					description:
						electionStruct.description || supabaseElection.description || "",
					status,
					startDate,
					endDate,
					totalVotes: votes,
					totalEligibleVoters: eligibleVotersCount,
					candidateCount,
				});
			} catch (error) {
				console.error(
					`Error fetching election ${electionId} from blockchain:`,
					error
				);
				// Continue with other elections even if one fails
			}
		}

		// Sort elections by end date (most recent first)
		elections.sort((a, b) => b.endDate - a.endDate);

		// Get recent elections (last 5)
		const recentElections = elections.slice(0, 5);

		// Calculate voter turnout (average across completed elections)
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
