"use server";

import {ethers} from "ethers";
import ElectionContract from "../../smartContract/Election.json";
import {retryWithBackoff} from "@/app/lib/helper";

export async function getElectionResults(electionId: number) {
	try {
		if (
			!process.env.WALLET_PRIVATE_KEY ||
			!process.env.RPC_URL ||
			!process.env.ELECTION_ADDRESS
		) {
			throw new Error(
				"Missing required environment variables: WALLET_PRIVATE_KEY, RPC_URL, SESSION_ADDRESS, ELECTION_CONTRACT_ADDRESS, PAYMASTER_ADDRESS"
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

		const results = await retryWithBackoff(async () => {
			return await electionContract.getElectionData(electionId);
		});

		return {
			success: true,
			results: results,
		};
	} catch (error: unknown) {
		console.error("Error getting election results:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			success: false,
			error: errorMessage,
			message: "Failed to get election results",
		};
	}
}
