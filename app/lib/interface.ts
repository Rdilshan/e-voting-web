// Type definitions for E-Voting System

export interface Candidate {
	id: number;
	name: string;
	party: string;
	description: string;
}

export interface AuthorizedVoter {
	nic: string;
	registeredWallet: string;
	tempWallet: string;
	tempWalletPrivateKey: string;
}

export interface Election {
	id: number;
	title: string;
	description: string;
	status: "active" | "inactive" | "completed";
	startDate?: string;
	endDate: string;
	candidates: Candidate[];
	authorizedVoters: AuthorizedVoter[];
}

export type VotingStep = "verify" | "select-election" | "vote" | "success";

// Contract struct types from ElectionContract
export interface ContractElection {
	electionTitle: string;
	description: string;
	startDate: bigint; // uint256 from contract
	endDate: bigint; // uint256 from contract
	totalVotes: bigint; // uint256 from contract
	exists: boolean;
}

export interface ContractVoter {
	nic: string;
	hasVoted: boolean;
	candidateIndex: bigint; // uint256 from contract
}

// Contract candidate type
export interface ContractCandidate {
	name: string;
	nic: string;
	party: string;
	voteCount: bigint;
}

// Return type for getElectionsByVoterNIC function
export interface ElectionsByVoterNICResponse {
	electionIds: bigint[]; // uint256[] from contract
	elections: ContractElection[];
	voters: ContractVoter[];
	candidates: ContractCandidate[][]; // Array of candidate arrays, one per election
}
