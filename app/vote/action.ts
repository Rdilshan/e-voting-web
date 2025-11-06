"use server";
import {ethers} from "ethers";
import NICWalletRegistry from "../smartContract/NICWalletRegistry.json";
import ElectionContract from "../smartContract/Election.json";
import PaymasterContract from "../smartContract/Paymaster.json";
import {retryWithBackoff} from "../lib/helper";
import {
	AuthorizedVoter,
	ElectionsByVoterNICResponse,
	ContractElection,
	ContractVoter,
	ContractCandidate,
} from "@/app/lib/interface";

export async function voterLoginAction(nicNumber: string) {
	try {
		if (
			!process.env.WALLET_PRIVATE_KEY ||
			!process.env.RPC_URL ||
			!process.env.SESSION_ADDRESS
		) {
			throw new Error(
				"Missing required environment variables: WALLET_PRIVATE_KEY, RPC_URL, SESSION_ADDRESS"
			);
		}

		try {
			// Create provider with network configuration
			const provider = new ethers.JsonRpcProvider(
				process.env.RPC_URL,
				undefined,
				{
					staticNetwork: true,
				}
			);

			// Create wallet
			const wallet = new ethers.Wallet(
				process.env.WALLET_PRIVATE_KEY,
				provider
			);

			// Connect to NICWalletRegistry contract
			const contract = new ethers.Contract(
				process.env.SESSION_ADDRESS,
				NICWalletRegistry,
				wallet
			);

			// Use retry logic for contract calls
			const registeredWallet = await retryWithBackoff(async () => {
				return await contract.getWalletByNIC(nicNumber);
			});

			// Check if the wallet is actually registered (not zero address)
			if (registeredWallet === "0x0000000000000000000000000000000000000000") {
				throw new Error("NIC number is not registered in the system");
			}

			return {
				success: true,
				nicNumber: nicNumber,
				registeredWallet: registeredWallet,
				contractAddress: process.env.SESSION_ADDRESS,
			};
		} catch (error: unknown) {
			console.error("Error in login action:", error);

			// Type guard to check if error is an Error instance
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			// Provide more specific error messages
			if (errorMessage.includes("NIC number is not registered")) {
				throw new Error(
					"This NIC number is not registered in the system. Please register first."
				);
			} else if (errorMessage.includes("Too Many Requests")) {
				throw new Error(
					"Rate limit exceeded. Please try again in a few moments."
				);
			} else if (errorMessage.includes("network")) {
				throw new Error(
					"Network connection failed. Please check your RPC URL."
				);
			} else if (errorMessage.includes("BAD_DATA")) {
				throw new Error("Invalid response from blockchain. Please try again.");
			}

			throw new Error(
				"Failed to connect to smart contract or get account information"
			);
		}
	} catch (error) {
		return {
			success: false,
			error: error,
			message: "Failed to login",
		};
	}
}

export async function createSessionForUser(
	registerAccount: string,
	tempAccount: string,
	nic: string
) {
	if (
		!process.env.WALLET_PRIVATE_KEY ||
		!process.env.RPC_URL ||
		!process.env.SESSION_ADDRESS
	) {
		throw new Error(
			"Missing required environment variables: WALLET_PRIVATE_KEY, RPC_URL, SESSION_ADDRESS"
		);
	}

	try {
		const provider = new ethers.JsonRpcProvider(
			process.env.RPC_URL,
			undefined,
			{
				staticNetwork: true,
			}
		);

		// Create wallet from private key (system wallet)
		const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

		// Connect to NICWalletRegistry contract
		const contract = new ethers.Contract(
			process.env.SESSION_ADDRESS,
			NICWalletRegistry,
			wallet
		);

		// Session duration (1 hour)
		const sessionDuration = 1 * 3600;

		// Create session using retry logic
		const sessionTx = await retryWithBackoff(async () => {
			return await contract.createSession(nic, tempAccount, sessionDuration);
		});

		console.log("Session created successfully:", sessionTx.hash);

		// Wait for transaction to be mined
		const receipt = await sessionTx.wait();
		console.log("Transaction confirmed:", receipt);

		// Verify the session was created successfully
		const hasAccess = await retryWithBackoff(async () => {
			return await contract.hasValidAccess(registerAccount, tempAccount);
		});

		console.log("Session access verified:", hasAccess);

		if (!hasAccess) {
			throw new Error("Session was created but access verification failed");
		}

		// Get session info
		const [expiryTime, isValid] = await retryWithBackoff(async () => {
			return await contract.getSessionInfo(registerAccount, tempAccount);
		});

		const sessionInfo = {
			expiryTime: Number(expiryTime),
			isValid: isValid,
			expiryDate: new Date(Number(expiryTime) * 1000),
		};

		return {
			success: true,
			sessionTx: sessionTx.hash,
			receipt: receipt,
			tempAccount: tempAccount,
			registerAccount: registerAccount,
			nic: nic,
			hasAccess: hasAccess,
			sessionInfo: sessionInfo,
		};
	} catch (error: unknown) {
		console.error("Error creating session:", error);

		// Provide more specific error messages
		if (
			error instanceof Error &&
			error.message?.includes(
				"Only wallet owner or authorized system wallet can create sessions"
			)
		) {
			throw new Error(
				"System wallet is not authorized to create sessions. Please ensure the system wallet is authorized by the contract owner."
			);
		} else if (
			error instanceof Error &&
			error.message?.includes("Too Many Requests")
		) {
			throw new Error(
				"Rate limit exceeded. Please try again in a few moments."
			);
		} else if (error instanceof Error && error.message?.includes("network")) {
			throw new Error("Network connection failed. Please check your RPC URL.");
		} else if (error instanceof Error && error.message?.includes("BAD_DATA")) {
			throw new Error("Invalid response from blockchain. Please try again.");
		}

		throw new Error("Failed to create session");
	}
}

export async function getElectionDataAction(AuthorizedVoter: AuthorizedVoter) {
	try {
		if (
			!process.env.WALLET_PRIVATE_KEY ||
			!process.env.RPC_URL ||
			!process.env.SESSION_ADDRESS ||
			!process.env.ELECTION_ADDRESS
		) {
			throw new Error(
				"Missing required environment variables: WALLET_PRIVATE_KEY, RPC_URL, SESSION_ADDRESS, ELECTION_CONTRACT_ADDRESS"
			);
		}

		const provider = new ethers.JsonRpcProvider(
			process.env.RPC_URL,
			undefined,
			{
				staticNetwork: true,
			}
		);

		// Create wallet from private key (temp wallet)
		const wallet = new ethers.Wallet(
			AuthorizedVoter.tempWalletPrivateKey,
			provider
		);

		// Connect to Election contract
		const contract = new ethers.Contract(
			process.env.ELECTION_ADDRESS,
			ElectionContract,
			wallet
		);

		const [electionIds, elections, voters] = await retryWithBackoff<
			[bigint[], ContractElection[], ContractVoter[]]
		>(async () => {
			return await contract.getElectionsByVoterNIC(AuthorizedVoter.nic);
		});

		// Fetch candidates for each election
		type CandidateArray = [string, string, string, bigint]; // [name, nic, party, voteCount]
		type CandidateInput = CandidateArray | ContractCandidate;

		const candidatesArrays: ContractCandidate[][] = [];
		for (const electionId of electionIds) {
			const candidatesResult = await retryWithBackoff<CandidateInput[]>(
				async () => {
					return await contract.checkResult(electionId);
				}
			);

			// Transform candidates from array format to object format
			// Contract returns: [name, nic, party, voteCount] as arrays
			const transformedCandidates: ContractCandidate[] = candidatesResult.map(
				(candidate: CandidateInput) => {
					// Handle both array and object formats
					if (Array.isArray(candidate)) {
						// Array format: [name, nic, party, voteCount]
						return {
							name: candidate[0],
							nic: candidate[1],
							party: candidate[2],
							voteCount: candidate[3],
						};
					} else {
						// Object format
						return {
							name: candidate.name,
							nic: candidate.nic,
							party: candidate.party,
							voteCount: candidate.voteCount,
						};
					}
				}
			);

			candidatesArrays.push(transformedCandidates);
		}

		const electionData: ElectionsByVoterNICResponse = {
			electionIds,
			elections,
			voters,
			candidates: candidatesArrays,
		};

		return {
			success: true,
			electionData: electionData,
		};
	} catch (error: unknown) {
		console.error("Error getting election data:", error);
		return {
			success: false,
			error: error,
			message: "Failed to get election data",
		};
	}
}

export async function castVoteAction(
	AuthorizedVoter: AuthorizedVoter,
	electionId: number,
	candidateIndex: number,
	onProgress?: (step: number, message: string) => void
) {
	try {
		if (
			!process.env.WALLET_PRIVATE_KEY ||
			!process.env.RPC_URL ||
			!process.env.SESSION_ADDRESS ||
			!process.env.ELECTION_ADDRESS ||
			!process.env.PAYMASTER_ADDRESS
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

		// Create system wallet (relayer)
		const systemWallet = new ethers.Wallet(
			process.env.WALLET_PRIVATE_KEY,
			provider
		);

		// Create temporary wallet signer
		const tempWalletSigner = new ethers.Wallet(
			AuthorizedVoter.tempWalletPrivateKey,
			provider
		);

		// Connect to contracts
		const electionContract = new ethers.Contract(
			process.env.ELECTION_ADDRESS,
			ElectionContract,
			systemWallet
		);

		const paymasterContract = new ethers.Contract(
			process.env.PAYMASTER_ADDRESS,
			PaymasterContract,
			systemWallet
		);

		const walletContract = new ethers.Contract(
			process.env.SESSION_ADDRESS,
			NICWalletRegistry,
			systemWallet
		);

		try {
			// Step 1: Verify session is still valid
			onProgress?.(1, "Verifying session validity...");
			const hasAccess = await retryWithBackoff(async () => {
				return await walletContract.hasValidAccess(
					AuthorizedVoter.registeredWallet,
					AuthorizedVoter.tempWallet
				);
			});

			if (!hasAccess) {
				throw new Error("Session expired or invalid");
			}

			// Step 2: Register temporary wallet with paymaster (if not already registered)
			onProgress?.(2, "Registering wallet with paymaster...");
			await retryWithBackoff(async () => {
				const registerTx = await paymasterContract.registerTemporaryWallet(
					AuthorizedVoter.tempWallet,
					AuthorizedVoter.registeredWallet
				);
				await registerTx.wait();
			});

			// Step 3: Prepare function data for vote
			onProgress?.(3, "Preparing vote transaction data...");
			const functionData = electionContract.interface.encodeFunctionData(
				"vote",
				[electionId, AuthorizedVoter.nic, candidateIndex]
			);

			// Step 4: Get current nonce for temporary wallet
			onProgress?.(4, "Retrieving wallet nonce...");
			const currentNonce = await retryWithBackoff(async () => {
				try {
					return await paymasterContract.getTempWalletNonce(
						AuthorizedVoter.tempWallet
					);
				} catch {
					return BigInt(0); // Default to 0 if function doesn't exist
				}
			});

			// Step 5: Create message hash for signature (use solidityPackedKeccak256 to match contract)
			onProgress?.(5, "Creating signature hash...");
			const messageHash = ethers.solidityPackedKeccak256(
				[
					"address",
					"address",
					"address",
					"uint256",
					"bytes",
					"uint256",
					"address",
				],
				[
					AuthorizedVoter.registeredWallet, // originalWallet
					AuthorizedVoter.tempWallet, // temporaryWallet
					process.env.ELECTION_ADDRESS, // target
					0, // value
					functionData, // data
					currentNonce, // nonce
					process.env.PAYMASTER_ADDRESS, // paymaster address
				]
			);

			// Step 6: Sign the message with temporary wallet
			onProgress?.(6, "Signing transaction...");
			const signature = await tempWalletSigner.signMessage(
				ethers.getBytes(messageHash)
			);

			// Step 7: Execute gasless transaction using paymaster
			onProgress?.(7, "Executing gasless transaction...");
			const tx = await retryWithBackoff(async () => {
				return await paymasterContract.executeGaslessTemporaryTransaction(
					AuthorizedVoter.registeredWallet, // originalWallet
					AuthorizedVoter.tempWallet, // temporaryWallet
					process.env.ELECTION_ADDRESS, // target
					0, // value
					functionData, // data
					signature // signature
				);
			});

			// Step 8: Wait for transaction confirmation
			onProgress?.(8, "Waiting for transaction confirmation...");
			const receipt = await tx.wait();

			return {
				success: true,
				transactionHash: tx.hash,
				gasUsed: receipt.gasUsed.toString(),
				electionId: electionId.toString(),
				candidateIndex: candidateIndex,
				message: "Vote cast successfully using gasless transaction!",
			};
		} catch (error: unknown) {
			console.error("Cast vote action failed:", error);

			const errorMessage =
				error instanceof Error ? error.message : "Unknown error occurred";

			return {
				success: false,
				error: errorMessage,
				message: "Failed to cast vote",
			};
		}
	} catch (error: unknown) {
		console.error("Error casting vote:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			success: false,
			error: errorMessage,
			message: "Failed to cast vote",
		};
	}
}
