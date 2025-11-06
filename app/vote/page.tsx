"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Vote,
    User,
    CheckCircle,
    AlertCircle,
    Search,
    ArrowRight,
    BarChart3
} from "lucide-react"
import { Candidate, AuthorizedVoter, Election, VotingStep, ContractCandidate } from "@/app/lib/interface"
import { castVoteAction, createSessionForUser, getElectionDataAction, voterLoginAction } from "./action"
import { ethers } from "ethers"

// Helper function to transform contract data to Election format
// Contract returns arrays: [electionTitle, description, startDate, endDate, totalVotes, exists]
// Voter returns arrays: [nic, hasVoted, candidateIndex]
type ContractElectionArray = [string, string, bigint, bigint, bigint, boolean];
type ContractVoterArray = [string, boolean, bigint];
type ContractElectionObject = {
    electionTitle: string;
    description: string;
    startDate: bigint;
    endDate: bigint;
    totalVotes: bigint;
    exists: boolean;
};
type ContractVoterObject = {
    nic: string;
    hasVoted: boolean;
    candidateIndex: bigint;
};

const transformContractDataToElection = (
    electionId: bigint,
    contractElection: ContractElectionArray | ContractElectionObject,
    voter: ContractVoterArray | ContractVoterObject,
    candidates: ContractCandidate[] = []
): Election => {
    const now = Date.now() / 1000;

    // Handle both array and object formats
    let electionTitle: string;
    let description: string;
    let startDate: number;
    let endDate: number;

    if (Array.isArray(contractElection)) {
        // Array format: [electionTitle, description, startDate, endDate, totalVotes, exists]
        electionTitle = contractElection[0];
        description = contractElection[1];
        startDate = Number(contractElection[2]); // Convert bigint to number
        endDate = Number(contractElection[3]); // Convert bigint to number
    } else {
        // Object format
        electionTitle = contractElection.electionTitle;
        description = contractElection.description;
        startDate = Number(contractElection.startDate);
        endDate = Number(contractElection.endDate);
    }

    // Validate dates before using them
    if (isNaN(startDate) || isNaN(endDate) || startDate <= 0 || endDate <= 0) {
        console.error("Invalid date values:", { startDate, endDate });
        startDate = Math.floor(Date.now() / 1000);
        endDate = Math.floor(Date.now() / 1000) + 86400; // Default to 1 day from now
    }

    let status: "active" | "inactive" | "completed";
    if (now < startDate) {
        status = "inactive";
    } else if (now > endDate) {
        status = "completed";
    } else {
        status = "active";
    }

    // Handle voter data (array or object)
    let voterNIC: string;

    if (Array.isArray(voter)) {
        // Array format: [nic, hasVoted, candidateIndex]
        voterNIC = voter[0];
    } else {
        voterNIC = voter.nic;
    }

    // Transform ContractCandidate[] to Candidate[]
    const transformedCandidates: Candidate[] = candidates.map((candidate, index) => ({
        id: index,
        name: candidate.name,
        party: candidate.party || "Independent",
        description: `NIC: ${candidate.nic}${candidate.party ? ` | Party: ${candidate.party}` : ""}`,
    }));

    return {
        id: Number(electionId),
        title: electionTitle,
        description: description,
        status: status,
        startDate: new Date(startDate * 1000).toISOString(),
        endDate: new Date(endDate * 1000).toISOString(),
        candidates: transformedCandidates,
        authorizedVoters: [{
            nic: voterNIC,
            registeredWallet: "",
            tempWallet: "",
            tempWalletPrivateKey: "",
        }],
    };
};

export default function VoterAccess() {
    const [step, setStep] = useState<VotingStep>("verify")
    const [nic, setNic] = useState("")
    const [verifiedVoter, setVerifiedVoter] = useState<AuthorizedVoter | null>(null)
    const [availableElections, setAvailableElections] = useState<Election[]>([])
    const [selectedElection, setSelectedElection] = useState<Election | null>(null)
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [error, setError] = useState("")
    const [isPending, startTransition] = useTransition()
    const [votingProgress, setVotingProgress] = useState<{ step: number; message: string } | null>(null)

    const handleVerifyVoter = async () => {
        startTransition(async () => {
            setError("")

            const voterData = await voterLoginAction(nic)
            console.log(voterData)

            if (!voterData.success) {
                setError(voterData.error as string)
                return
            }

            const account = ethers.Wallet.createRandom();
            const sessionData = await createSessionForUser(voterData.registeredWallet, account.address, nic)

            if (!sessionData.success) {
                setError("Failed to create session")
                return
            }

            const authorizedVoter: AuthorizedVoter = {
                registeredWallet: voterData.registeredWallet,
                tempWallet: account.address,
                tempWalletPrivateKey: account.privateKey,
                nic: nic
            }

            setVerifiedVoter(authorizedVoter)

            // Get election data from contract
            const electionDataResponse = await getElectionDataAction(authorizedVoter)
            console.log("Election data response:", electionDataResponse)

            if (!electionDataResponse.success) {
                setError(electionDataResponse.message || "Failed to get election data")
                return
            }

            // Check if election data exists
            if (!electionDataResponse.electionData) {
                setError("No election data received")
                return
            }

            // Transform contract data to Election format
            const elections: Election[] = electionDataResponse.electionData.electionIds.map((electionId, index) => {
                // Get candidates for this election (candidates array corresponds to electionIds array)
                const candidates = electionDataResponse.electionData!.candidates[index] || [];

                return transformContractDataToElection(
                    electionId,
                    electionDataResponse.electionData!.elections[index],
                    electionDataResponse.electionData!.voters[index],
                    candidates
                )
            })

            // Update authorizedVoters with hasVoted status
            const electionsWithVoterStatus = elections.map((election, index) => {
                const voter = electionDataResponse.electionData!.voters[index]
                // Handle both array and object formats for voter
                const hasVoted = Array.isArray(voter) ? voter[1] : voter.hasVoted;

                return {
                    ...election,
                    authorizedVoters: [{
                        ...election.authorizedVoters[0],
                        registeredWallet: authorizedVoter.registeredWallet,
                        tempWallet: authorizedVoter.tempWallet,
                        tempWalletPrivateKey: authorizedVoter.tempWalletPrivateKey,
                    }],
                    // Store voter info for checking if voted
                    _voterHasVoted: hasVoted,
                } as Election & { _voterHasVoted: boolean }
            })

            setAvailableElections(electionsWithVoterStatus)
            setStep("select-election")
        })
    }

    const handleSelectElection = (election: Election & { _voterHasVoted?: boolean }) => {
        // Check if voter has already voted in this election
        if (election._voterHasVoted) {
            setError("You have already voted in this election.")
            return
        }

        // Check if election is active
        if (election.status !== "active") {
            setError(`This election is ${election.status}. Voting is not available.`)
            return
        }

        setSelectedElection(election)
        setStep("vote")
    }

    const handleCastVote = async () => {
        if (!selectedCandidate || !selectedElection || !verifiedVoter) {
            setError("Please select a candidate before casting your vote.")
            return
        }

        setError("")
        setVotingProgress({ step: 0, message: "Starting vote process..." })

        // Define all 8 steps
        const steps = [
            { step: 1, message: "Verifying session validity..." },
            { step: 2, message: "Registering wallet with paymaster..." },
            { step: 3, message: "Preparing vote transaction data..." },
            { step: 4, message: "Retrieving wallet nonce..." },
            { step: 5, message: "Creating signature hash..." },
            { step: 6, message: "Signing transaction..." },
            { step: 7, message: "Executing gasless transaction..." },
            { step: 8, message: "Waiting for transaction confirmation..." },
        ]

        let currentStepIndex = 0

        // Simulate progress updates (we can't get real-time updates from server actions)
        const progressInterval = setInterval(() => {
            if (currentStepIndex < steps.length) {
                setVotingProgress(steps[currentStepIndex])
                currentStepIndex++
            } else {
                clearInterval(progressInterval)
            }
        }, 1500) // Update every 1.5 seconds

        try {
            const voteResult = await castVoteAction(
                verifiedVoter,
                Number(selectedElection.id),
                Number(selectedCandidate.id)
            )

            clearInterval(progressInterval)

            if (!voteResult.success) {
                setVotingProgress(null)
                setError(voteResult.message || "Failed to cast vote")
                return
            }

            // Mark as completed
            setVotingProgress({ step: 8, message: "Vote cast successfully!" })

            console.log("Vote result:", voteResult)
            if (voteResult.success) {
                // Small delay to show completion
                setTimeout(() => {
                    setVotingProgress(null)
                    setStep("success")
                }, 1000)
            } else {
                setVotingProgress(null)
                setError(voteResult.message || "Failed to cast vote")
            }
        } catch {
            clearInterval(progressInterval)
            setVotingProgress(null)
            setError("An error occurred while casting your vote")
        }
    }

    const resetVoting = () => {
        setStep("verify")
        setNic("")
        setVerifiedVoter(null)
        setAvailableElections([])
        setSelectedElection(null)
        setSelectedCandidate(null)
        setError("")
        setVotingProgress(null)
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-6 sm:mb-8">
                        <Vote className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Voter Access</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Enter your credentials to access available elections
                        </p>
                    </div>

                    {/* Step 1: Voter Verification */}
                    {step === "verify" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                                    <User className="h-5 w-5" />
                                    <span>Verify Your Identity</span>
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    Enter your NIC (National Identity Card) number to access elections
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nic" className="text-sm font-medium">NIC Number</Label>
                                    <Input
                                        id="nic"
                                        placeholder="e.g., 123456789V"
                                        value={nic}
                                        onChange={(e) => setNic(e.target.value)}
                                        className="text-base"
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-start space-x-2 text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                <Button
                                    onClick={handleVerifyVoter}
                                    className="w-full"
                                    disabled={!nic || isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="mr-2 h-4 w-4" />
                                            Verify Identity
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Election Selection */}
                    {step === "select-election" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Welcome!</CardTitle>
                                <CardDescription className="text-sm">
                                    Select an election to participate in. NIC: {verifiedVoter?.nic}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                {availableElections.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p className="text-sm">No elections available for this voter.</p>
                                    </div>
                                ) : (
                                    availableElections.map((election) => {
                                        const hasVoted = (election as Election & { _voterHasVoted?: boolean })._voterHasVoted || false
                                        const isActive = election.status === "active"

                                        return (
                                            <div
                                                key={election.id}
                                                className={`border rounded-lg p-3 sm:p-4 transition-colors ${hasVoted
                                                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 cursor-not-allowed'
                                                    : isActive
                                                        ? 'cursor-pointer hover:border-primary hover:bg-primary/5'
                                                        : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 cursor-not-allowed opacity-60'
                                                    }`}
                                                onClick={() => !hasVoted && isActive && handleSelectElection(election)}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-sm sm:text-base truncate">{election.title}</h3>
                                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">{election.description}</p>
                                                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                                                            <p>
                                                                Voting Period: {new Date(election.startDate || election.endDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                                                            </p>
                                                            <p className={`font-medium ${election.status === "active"
                                                                ? "text-green-600 dark:text-green-400"
                                                                : election.status === "completed"
                                                                    ? "text-gray-600 dark:text-gray-400"
                                                                    : "text-blue-600 dark:text-blue-400"
                                                                }`}>
                                                                Status: {election.status === "active" ? "Voting Open" : election.status === "completed" ? "Completed" : "Not Started"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-end sm:justify-center space-x-2 flex-shrink-0">
                                                        {hasVoted ? (
                                                            <div className="flex items-center space-x-1 text-green-600">
                                                                <CheckCircle className="h-4 w-4" />
                                                                <span className="text-sm">Voted</span>
                                                            </div>
                                                        ) : isActive ? (
                                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">
                                                                {election.status === "completed" ? "Ended" : "Not Started"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}

                                {error && (
                                    <div className="flex items-start space-x-2 text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                <Button variant="outline" onClick={resetVoting} className="w-full">
                                    Back to Verification
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Voting */}
                    {step === "vote" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl truncate">{selectedElection?.title}</CardTitle>
                                <CardDescription className="text-sm space-y-1">
                                    <p>Select your preferred candidate</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                                        Voting Period: {new Date(selectedElection?.startDate || selectedElection?.endDate || "").toLocaleDateString()} - {new Date(selectedElection?.endDate || "").toLocaleDateString()}
                                    </p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                {/* Progress Indicator */}
                                {votingProgress && (
                                    <div className="bg-muted/50 rounded-lg p-4 space-y-3 border">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold">Voting Progress</h4>
                                            <span className="text-xs text-muted-foreground">
                                                Step {votingProgress.step} of 8
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { step: 1, message: "Verifying session validity..." },
                                                { step: 2, message: "Registering wallet with paymaster..." },
                                                { step: 3, message: "Preparing vote transaction data..." },
                                                { step: 4, message: "Retrieving wallet nonce..." },
                                                { step: 5, message: "Creating signature hash..." },
                                                { step: 6, message: "Signing transaction..." },
                                                { step: 7, message: "Executing gasless transaction..." },
                                                { step: 8, message: "Waiting for transaction confirmation..." },
                                            ].map((stepInfo) => {
                                                const isCompleted = votingProgress.step > stepInfo.step
                                                const isCurrent = votingProgress.step === stepInfo.step

                                                return (
                                                    <div
                                                        key={stepInfo.step}
                                                        className={`flex items-start space-x-3 p-2 rounded transition-colors ${isCurrent
                                                            ? "bg-primary/10 border border-primary/20"
                                                            : isCompleted
                                                                ? "opacity-60"
                                                                : "opacity-40"
                                                            }`}
                                                    >
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            {isCompleted ? (
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                            ) : isCurrent ? (
                                                                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                            ) : (
                                                                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p
                                                                className={`text-xs sm:text-sm ${isCurrent
                                                                    ? "font-semibold text-primary"
                                                                    : isCompleted
                                                                        ? "text-muted-foreground line-through"
                                                                        : "text-muted-foreground"
                                                                    }`}
                                                            >
                                                                {stepInfo.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {votingProgress.step === 0 && (
                                            <p className="text-xs text-center text-muted-foreground mt-2">
                                                {votingProgress.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {selectedElection?.candidates && selectedElection.candidates.length > 0 ? (
                                    selectedElection.candidates.map((candidate: Candidate) => (
                                        <div
                                            key={candidate.id}
                                            className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${selectedCandidate?.id === candidate.id
                                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                : 'hover:border-primary/50'
                                                }`}
                                            onClick={() => setSelectedCandidate(candidate)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm sm:text-base truncate">{candidate.name}</h3>
                                                    <p className="text-xs sm:text-sm text-primary font-medium">{candidate.party}</p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-3">{candidate.description}</p>
                                                </div>
                                                {selectedCandidate?.id === candidate.id && (
                                                    <CheckCircle className="h-5 w-5 text-primary ml-3 sm:ml-4 flex-shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p className="text-sm">No candidates available for this election.</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-start space-x-2 text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setStep("select-election")
                                            setVotingProgress(null)
                                        }}
                                        className="flex-1"
                                        disabled={!!votingProgress}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleCastVote}
                                        className="flex-1"
                                        disabled={!!votingProgress || !selectedCandidate}
                                    >
                                        {votingProgress ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Vote className="mr-2 h-4 w-4" />
                                                Cast Vote
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Success */}
                    {step === "success" && (
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-green-600 dark:text-green-400 text-lg sm:text-xl">
                                    Vote Cast Successfully!
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    Your vote has been recorded securely
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted p-3 sm:p-4 rounded-lg text-left">
                                    <p className="text-sm font-medium mb-2">Vote Summary:</p>
                                    <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                                        <p className="truncate">Election: {selectedElection?.title}</p>
                                        <p className="truncate">Candidate: {selectedCandidate?.name}</p>
                                        <p>Time: {new Date().toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Button onClick={resetVoting} className="w-full">
                                        Vote in Another Election
                                    </Button>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={`/results/${selectedElection?.id}`} target="_blank" rel="noopener noreferrer">
                                            <BarChart3 className="mr-2 h-4 w-4" />
                                            View Public Results
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
