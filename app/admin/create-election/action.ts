"use server";

import {ethers} from "ethers";
import Zk_election from "../../smartContract/Zk_election.json";
import NICWalletRegistry from "../../smartContract/NICWalletRegistry.json";
import {retryWithBackoff} from "@/app/lib/helper";
import {
	createVoterMerkleTree,
	getRegisteredWalletsFromNICs,
} from "@/app/lib/utils/merkleTree";
import {getServiceRoleClient} from "@/service/supabase";

interface Candidate {
	name: string;
	nic: string;
	party: string;
}

interface CreateElectionParams {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	candidates: Candidate[];
	voters: {nic: string}[];
}

/**
 * Check if NIC is registered in NICWalletRegistry
 */
async function checkNICRegistered(
	nicRegistryContract: ethers.Contract,
	nic: string
): Promise<{registered: boolean; walletAddress: string | null}> {
	try {
		const walletAddress = await retryWithBackoff(async () => {
			return await nicRegistryContract.getWalletByNIC(nic);
		});

		const registered =
			walletAddress !== "0x0000000000000000000000000000000000000000" &&
			walletAddress !== ethers.ZeroAddress;

		return {
			registered,
			walletAddress: registered ? walletAddress : null,
		};
	} catch (error) {
		console.error(`Error checking NIC ${nic}:`, error);
		return {registered: false, walletAddress: null};
	}
}

/**
 * Register NIC with a wallet address in NICWalletRegistry
 * Note: This generates a new wallet for the NIC. In production, you might want
 * to use existing wallets or have a different registration flow.
 */
async function registerNIC(
	nicRegistryContract: ethers.Contract,
	nic: string,
	walletAddress: string
): Promise<{success: boolean; transactionHash?: string}> {
	try {
		const registerTx = await retryWithBackoff(async () => {
			return await nicRegistryContract.registerWallet(nic, walletAddress);
		});

		console.log(
			`Registration transaction sent for NIC ${nic}:`,
			registerTx.hash
		);

		// Wait for transaction to be mined
		const receipt = await registerTx.wait();
		console.log(`Registration confirmed for NIC ${nic}:`, receipt);

		// Verify the registration
		const registeredWallet = await retryWithBackoff(async () => {
			return await nicRegistryContract.getWalletByNIC(nic);
		});

		if (registeredWallet.toLowerCase() !== walletAddress.toLowerCase()) {
			throw new Error(`Registration verification failed for NIC ${nic}`);
		}

		return {
			success: true,
			transactionHash: registerTx.hash,
		};
	} catch (error: unknown) {
		console.error(`Error registering NIC ${nic}:`, error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (errorMessage.includes("NIC already registered")) {
			// Already registered, that's fine
			return {success: true};
		}
		throw error;
	}
}

/**
 * Generate a new wallet address for a NIC
 * In production, you might want to use a different approach
 */
function generateWalletForNIC(): {address: string; privateKey: string} {
	const wallet = ethers.Wallet.createRandom();
	return {
		address: wallet.address,
		privateKey: wallet.privateKey,
	};
}

export async function createElection(params: CreateElectionParams): Promise<{
	success: boolean;
	electionId?: number;
	transactionHash?: string;
	message?: string;
	errors?: string[];
}> {
	// Validate environment variables
	if (
		!process.env.WALLET_PRIVATE_KEY ||
		!process.env.RPC_URL ||
		!process.env.ZK_ELECTIONCONTRACT ||
		!process.env.SESSION_ADDRESS
	) {
		return {
			success: false,
			message:
				"Missing required environment variables: WALLET_PRIVATE_KEY, RPC_URL, ELECTION_ADDRESS, SESSION_ADDRESS",
		};
	}

	try {
		// Create provider
		const provider = new ethers.JsonRpcProvider(
			process.env.RPC_URL,
			undefined,
			{
				staticNetwork: true,
			}
		);

		// Create wallet (admin wallet)
		const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

		// Connect to NICWalletRegistry contract
		const nicRegistryContract = new ethers.Contract(
			process.env.SESSION_ADDRESS,
			NICWalletRegistry,
			wallet
		);

		// Connect to ZKElection contract
		const zkElectionContract = new ethers.Contract(
			process.env.ZK_ELECTIONCONTRACT,
			Zk_election,
			wallet
		);

		// Step 1: Check and register all voter NICs
		console.log(`Checking ${params.voters.length} voter NIC(s)...`);
		const unregisteredVoters: string[] = [];
		const voterRegistrations: Array<{nic: string; walletAddress: string}> = [];

		for (let i = 0; i < params.voters.length; i++) {
			const voter = params.voters[i];
			console.log(
				`Checking voter NIC ${i + 1}/${params.voters.length}: ${voter.nic}...`
			);
			const {registered, walletAddress} = await checkNICRegistered(
				nicRegistryContract,
				voter.nic
			);

			if (!registered) {
				console.log(`Creating wallet for voter NIC: ${voter.nic}...`);
				// Generate a wallet for this NIC
				const newWallet = generateWalletForNIC();
				voterRegistrations.push({
					nic: voter.nic,
					walletAddress: newWallet.address,
				});
				unregisteredVoters.push(voter.nic);
			} else if (walletAddress) {
				console.log(`Voter NIC ${voter.nic} already registered ✓`);
				voterRegistrations.push({
					nic: voter.nic,
					walletAddress,
				});
			}
		}

		// Step 2: Check and register all candidate NICs
		console.log(`Checking ${params.candidates.length} candidate NIC(s)...`);
		const unregisteredCandidates: string[] = [];
		const candidateRegistrations: Array<{nic: string; walletAddress: string}> =
			[];

		for (let i = 0; i < params.candidates.length; i++) {
			const candidate = params.candidates[i];
			console.log(
				`Checking candidate NIC ${i + 1}/${params.candidates.length}: ${
					candidate.nic
				}...`
			);
			const {registered, walletAddress} = await checkNICRegistered(
				nicRegistryContract,
				candidate.nic
			);

			if (!registered) {
				console.log(`Creating wallet for candidate NIC: ${candidate.nic}...`);
				// Generate a wallet for this NIC
				const newWallet = generateWalletForNIC();
				candidateRegistrations.push({
					nic: candidate.nic,
					walletAddress: newWallet.address,
				});
				unregisteredCandidates.push(candidate.nic);
			} else if (walletAddress) {
				console.log(`Candidate NIC ${candidate.nic} already registered ✓`);
				candidateRegistrations.push({
					nic: candidate.nic,
					walletAddress,
				});
			}
		}

		// Step 3: Register unregistered NICs
		console.log(
			`Registering ${
				unregisteredVoters.length + unregisteredCandidates.length
			} NIC(s) on blockchain...`
		);
		const registrationErrors: string[] = [];

		// Register unregistered voters
		const unregisteredVoterRegistrations = voterRegistrations.filter((r) =>
			unregisteredVoters.includes(r.nic)
		);
		for (let i = 0; i < unregisteredVoterRegistrations.length; i++) {
			const registration = unregisteredVoterRegistrations[i];
			try {
				console.log(
					`Registering voter NIC ${i + 1}/${
						unregisteredVoterRegistrations.length
					}: ${registration.nic}...`
				);
				await registerNIC(
					nicRegistryContract,
					registration.nic,
					registration.walletAddress
				);
				console.log(
					`✓ Successfully registered voter NIC ${registration.nic} with wallet ${registration.walletAddress}`
				);
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				const errorMsg = `Failed to register voter NIC ${registration.nic}: ${errorMessage}`;
				console.error(errorMsg);
				registrationErrors.push(errorMsg);
			}
		}

		// Register unregistered candidates
		const unregisteredCandidateRegistrations = candidateRegistrations.filter(
			(r) => unregisteredCandidates.includes(r.nic)
		);
		for (let i = 0; i < unregisteredCandidateRegistrations.length; i++) {
			const registration = unregisteredCandidateRegistrations[i];
			try {
				console.log(
					`Registering candidate NIC ${i + 1}/${
						unregisteredCandidateRegistrations.length
					}: ${registration.nic}...`
				);
				await registerNIC(
					nicRegistryContract,
					registration.nic,
					registration.walletAddress
				);
				console.log(
					`✓ Successfully registered candidate NIC ${registration.nic} with wallet ${registration.walletAddress}`
				);
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				const errorMsg = `Failed to register candidate NIC ${registration.nic}: ${errorMessage}`;
				console.error(errorMsg);
				registrationErrors.push(errorMsg);
			}
		}

		// If there were registration errors, return early
		if (registrationErrors.length > 0) {
			return {
				success: false,
				message: "Failed to register some NICs",
				errors: registrationErrors,
			};
		}

		// Step 4: Get registered wallet addresses for voters
		console.log("Getting registered wallet addresses for voters...");
		const voterNICs = params.voters.map((voter) => voter.nic);
		const registeredVoterWallets = await getRegisteredWalletsFromNICs(
			voterNICs,
			nicRegistryContract
		);

		if (registeredVoterWallets.length === 0) {
			return {
				success: false,
				message: "No registered wallets found for the provided voter NICs",
			};
		}

		if (registeredVoterWallets.length !== voterNICs.length) {
			console.warn(
				`Warning: Only ${registeredVoterWallets.length} out of ${voterNICs.length} voters have registered wallets`
			);
		}

		// Step 5: Get current election count to determine election ID
		console.log("Getting current election count...");
		const currentElectionCount = await retryWithBackoff(async () => {
			return await zkElectionContract.electionCount();
		});
		const electionId = Number(currentElectionCount);
		console.log(`Next election ID will be: ${electionId}`);

		// Step 6: Create Merkle tree for eligible voters
		console.log("Creating Merkle tree for eligible voters...");
		const {root: merkleRoot} = createVoterMerkleTree(
			registeredVoterWallets,
			electionId
		);
		const merkleRootHex = ethers.hexlify(merkleRoot);
		console.log(`Merkle root: ${merkleRootHex}`);
		console.log(
			`Number of voters in Merkle tree: ${registeredVoterWallets.length}`
		);

		// Step 7: Prepare election data
		const startDate = BigInt(
			Math.floor(new Date(params.startDate).getTime() / 1000)
		);
		const endDate = BigInt(
			Math.floor(new Date(params.endDate).getTime() / 1000)
		);

		// Prepare candidates array for contract
		const contractCandidates = params.candidates.map((candidate) => ({
			name: candidate.name,
			nic: candidate.nic,
			party: candidate.party,
			voteCount: 0,
		}));

		// Step 8: Create the election on blockchain
		console.log(`Creating election "${params.title}" on blockchain...`);
		console.log("Creating election with data:", {
			title: params.title,
			description: params.description,
			startDate: startDate.toString(),
			endDate: endDate.toString(),
			candidates: contractCandidates.length,
			voters: registeredVoterWallets.length,
			merkleRoot: merkleRootHex,
		});

		const createTx = await retryWithBackoff(async () => {
			return await zkElectionContract.createElection(
				params.title,
				params.description,
				startDate,
				endDate,
				contractCandidates,
				merkleRootHex
			);
		});

		console.log("Election creation transaction sent:", createTx.hash);

		// Wait for transaction to be mined
		const receipt = await createTx.wait();
		console.log("Election creation confirmed:", receipt);

		// Verify election was created
		const createdElection = await retryWithBackoff(async () => {
			return await zkElectionContract.elections(electionId);
		});

		if (!createdElection.exists) {
			throw new Error("Election creation verification failed");
		}

		console.log("✅ Election created successfully!");
		console.log("Election ID:", electionId);
		console.log("Merkle Root:", createdElection.votersMerkleRoot);

		// Step 9: Save election data to Supabase
		console.log("Saving election data to Supabase...");
		try {
			const supabase = getServiceRoleClient();

			// Convert BigInt timestamps to ISO date strings
			const startDateISO = new Date(Number(startDate) * 1000).toISOString();
			const endDateISO = new Date(Number(endDate) * 1000).toISOString();

			const {data: supabaseData, error: supabaseError} = await supabase
				.from("election")
				.insert({
					election_id: electionId,
					title: params.title,
					description: params.description,
					start_date: startDateISO,
					end_date: endDateISO,
					metkle_root: merkleRootHex, // Note: using schema field name as provided
				})
				.select()
				.single();

			if (supabaseError) {
				console.error("Failed to save election to Supabase:", supabaseError);
				// Don't fail the entire operation if Supabase save fails
				// Blockchain creation succeeded, so we return success but log the error
			} else {
				console.log("✅ Election data saved to Supabase:", supabaseData);
			}

			// Step 10: Save voters to voter table
			console.log("Saving voters to Supabase voter table...");
			try {
				// Prepare voter data for insertion - save all registered voter wallets
				const votersData = registeredVoterWallets.map((walletAddress) => ({
					election_id: electionId, // Note: schema shows timestamp, but using electionId number
					wallet_address: walletAddress,
				}));

				if (votersData.length > 0) {
					const {data: votersDataResult, error: votersError} = await supabase
						.from("voter")
						.insert(votersData)
						.select();

					if (votersError) {
						console.error("Failed to save voters to Supabase:", votersError);
						// Don't fail the entire operation if Supabase save fails
					} else {
						console.log(
							`✅ Successfully saved ${
								votersDataResult?.length || 0
							} voters to Supabase`
						);
					}
				} else {
					console.warn("No voter data to save to Supabase");
				}
			} catch (votersErr) {
				console.error("Error saving voters to Supabase:", votersErr);
				// Continue even if Supabase save fails - blockchain creation succeeded
			}
		} catch (supabaseErr) {
			console.error("Error saving to Supabase:", supabaseErr);
			// Continue even if Supabase save fails - blockchain creation succeeded
		}

		return {
			success: true,
			electionId,
			transactionHash: createTx.hash,
			message: `Election created successfully! Election ID: ${electionId}`,
		};
	} catch (error: unknown) {
		console.error("Error creating election:", error);

		// Provide more specific error messages
		const errorObj = error instanceof Error ? error : new Error(String(error));
		let errorMessage = "Failed to create election";
		if (errorObj.message.includes("Too Many Requests")) {
			errorMessage = "Rate limit exceeded. Please try again in a few moments.";
		} else if (errorObj.message.includes("network")) {
			errorMessage = "Network connection failed. Please check your RPC URL.";
		} else if (errorObj.message.includes("BAD_DATA")) {
			errorMessage = "Invalid response from blockchain. Please try again.";
		} else if (errorObj.message) {
			errorMessage = errorObj.message;
		}

		return {
			success: false,
			message: errorMessage,
		};
	}
}
