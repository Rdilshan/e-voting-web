import {ethers} from "ethers";
import {MerkleTree} from "merkletreejs";
import keccak256 from "keccak256";

/**
 * Create a Merkle tree for eligible voters
 * @param voterAddresses Array of REGISTERED wallet addresses (from NIC, not temporary wallets)
 * @param electionId Election ID
 * @returns Merkle tree and root hash
 * @note Uses registered wallet addresses from NICWalletRegistry, not temporary session wallets
 */
export function createVoterMerkleTree(
	voterAddresses: string[],
	electionId: number
): {tree: MerkleTree; root: Buffer} {
	// Create leaves: hash(registeredWalletAddress, electionId)
	// IMPORTANT: voterAddresses must be REGISTERED wallet addresses (from NIC)
	const leaves = voterAddresses.map((address) => {
		const packed = ethers.solidityPacked(
			["address", "uint256"],
			[address, electionId]
		);
		return keccak256(packed);
	});

	// Create Merkle tree
	const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});

	return {
		tree,
		root: tree.getRoot(),
	};
}

/**
 * Get registered wallet addresses from NIC numbers
 * @param nicNumbers Array of NIC numbers
 * @param registryContract NICWalletRegistry contract instance
 * @returns Array of registered wallet addresses
 * @note Helper function to get registered wallets for Merkle tree creation
 */
export async function getRegisteredWalletsFromNICs(
	nicNumbers: string[],
	registryContract: ethers.Contract
): Promise<string[]> {
	const registeredWallets: string[] = [];

	for (const nic of nicNumbers) {
		try {
			const wallet = await registryContract.getWalletByNIC(nic);
			if (wallet && wallet !== ethers.ZeroAddress) {
				registeredWallets.push(wallet);
			}
		} catch (error) {
			console.warn(`Failed to get wallet for NIC ${nic}:`, error);
		}
	}

	return registeredWallets;
}
