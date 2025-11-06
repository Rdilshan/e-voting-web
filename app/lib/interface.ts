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

// Types for contract data arrays (from getElectionData)
export type ElectionDataArray = [
	string,
	string,
	bigint,
	bigint,
	bigint,
	boolean
];
export type CandidateDataArray = [string, string, string, bigint];

// Response type for getElectionResults action
export interface ElectionResultsResponse {
	success: boolean;
	results?: [ElectionDataArray, CandidateDataArray[], bigint];
	error?: string;
}

// Transformed candidate data for display
export interface TransformedCandidate {
	id: number;
	name: string;
	nic: string;
	party: string;
	votes: number;
	percentage: number;
}

// Transformed election data for display (used in results page)
export interface TransformedElectionData {
	id: number;
	title: string;
	description: string;
	status: "active" | "completed" | "upcoming";
	startDate: string;
	endDate: string;
	totalVotes: number;
	totalEligibleVoters: number;
	candidates: TransformedCandidate[];
}

// Props for PublicElectionResults component
export interface PublicElectionResultsProps {
	electionData: TransformedElectionData | null;
}

// Admin results page interfaces
export interface ElectionCandidate {
	id: number;
	name: string;
	party: string;
	votes: number;
	percentage: number;
}

export interface AdminElectionData {
	id: number;
	title: string;
	description: string;
	status: "active" | "completed" | "upcoming";
	totalVoters: number;
	totalVotes: number;
	turnout: number;
	endDate: number;
	candidates: ElectionCandidate[];
}
