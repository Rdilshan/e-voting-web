"use client"

import { useState } from "react"
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
    ArrowRight
} from "lucide-react"

// Mock data for elections and authorized voters
const electionsData = [
    {
        id: 1,
        title: "Presidential Election 2024",
        description: "Choose the next President",
        status: "active",
        endDate: "2024-12-15",
        candidates: [
            { id: 1, name: "Alice Johnson", party: "Democratic Party", description: "Former Senator with 20 years experience" },
            { id: 2, name: "Bob Smith", party: "Republican Party", description: "Business leader and former Governor" },
            { id: 3, name: "Carol Davis", party: "Independent", description: "Environmental scientist and activist" }
        ],
        authorizedVoters: [
            { voterId: "VTR-001", name: "John Doe", email: "john@example.com", hasVoted: false },
            { voterId: "VTR-002", name: "Jane Smith", email: "jane@example.com", hasVoted: true },
            { voterId: "VTR-003", name: "Mike Johnson", email: "mike@example.com", hasVoted: false }
        ]
    },
    {
        id: 2,
        title: "City Council Election",
        description: "Select your local representatives",
        status: "active",
        endDate: "2024-12-20",
        candidates: [
            { id: 4, name: "David Wilson", party: "Local Party A", description: "Community organizer" },
            { id: 5, name: "Emma Brown", party: "Local Party B", description: "Small business owner" }
        ],
        authorizedVoters: [
            { voterId: "VTR-001", name: "John Doe", email: "john@example.com", hasVoted: false },
            { voterId: "VTR-004", name: "Sarah Lee", email: "sarah@example.com", hasVoted: false }
        ]
    }
]

export default function VoterAccess() {
    const [step, setStep] = useState<"verify" | "select-election" | "vote" | "success">("verify")
    const [voterInfo, setVoterInfo] = useState({ voterId: "", email: "" })
    const [verifiedVoter, setVerifiedVoter] = useState<any>(null)
    const [availableElections, setAvailableElections] = useState<any[]>([])
    const [selectedElection, setSelectedElection] = useState<any>(null)
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
    const [error, setError] = useState("")

    const handleVerifyVoter = () => {
        setError("")

        // Find voter in any election
        let foundVoter = null
        let voterElections = []

        for (const election of electionsData) {
            const voter = election.authorizedVoters.find(
                v => v.voterId.toLowerCase() === voterInfo.voterId.toLowerCase() &&
                    v.email.toLowerCase() === voterInfo.email.toLowerCase()
            )

            if (voter) {
                foundVoter = voter
                if (election.status === "active") {
                    voterElections.push(election)
                }
            }
        }

        if (!foundVoter) {
            setError("Voter ID or email not found. Please check your credentials.")
            return
        }

        if (voterElections.length === 0) {
            setError("No active elections found for your account.")
            return
        }

        setVerifiedVoter(foundVoter)
        setAvailableElections(voterElections)
        setStep("select-election")
    }

    const handleSelectElection = (election: any) => {
        // Check if voter has already voted in this election
        const voterInElection = election.authorizedVoters.find(
            (v: any) => v.voterId === verifiedVoter.voterId
        )

        if (voterInElection?.hasVoted) {
            setError("You have already voted in this election.")
            return
        }

        setSelectedElection(election)
        setStep("vote")
    }

    const handleCastVote = () => {
        if (!selectedCandidate) {
            setError("Please select a candidate before casting your vote.")
            return
        }

        // TODO: Submit vote to backend/blockchain
        console.log("Casting vote:", {
            voterId: verifiedVoter.voterId,
            electionId: selectedElection.id,
            candidateId: selectedCandidate.id
        })

        // Mark voter as having voted (in real app, this would be done on backend)
        const electionIndex = electionsData.findIndex(e => e.id === selectedElection.id)
        const voterIndex = electionsData[electionIndex].authorizedVoters.findIndex(
            v => v.voterId === verifiedVoter.voterId
        )
        electionsData[electionIndex].authorizedVoters[voterIndex].hasVoted = true

        setStep("success")
    }

    const resetVoting = () => {
        setStep("verify")
        setVoterInfo({ voterId: "", email: "" })
        setVerifiedVoter(null)
        setAvailableElections([])
        setSelectedElection(null)
        setSelectedCandidate(null)
        setError("")
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
                                    Enter your Voter ID and email address to access elections
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="voterId" className="text-sm font-medium">Voter ID</Label>
                                    <Input
                                        id="voterId"
                                        placeholder="e.g., VTR-001"
                                        value={voterInfo.voterId}
                                        onChange={(e) => setVoterInfo(prev => ({ ...prev, voterId: e.target.value }))}
                                        className="text-base"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={voterInfo.email}
                                        onChange={(e) => setVoterInfo(prev => ({ ...prev, email: e.target.value }))}
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
                                    disabled={!voterInfo.voterId || !voterInfo.email}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Verify Identity
                                </Button>

                                <div className="bg-blue-50 dark:bg-blue-950 p-3 sm:p-4 rounded-lg">
                                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                                        Demo Credentials:
                                    </p>
                                    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                        <p className="break-all">Voter ID: VTR-001, Email: john@example.com</p>
                                        <p className="break-all">Voter ID: VTR-003, Email: mike@example.com</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Election Selection */}
                    {step === "select-election" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Welcome, {verifiedVoter.name}!</CardTitle>
                                <CardDescription className="text-sm">
                                    Select an election to participate in
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                {availableElections.map((election) => {
                                    const voterInElection = election.authorizedVoters.find(
                                        (v: any) => v.voterId === verifiedVoter.voterId
                                    )

                                    return (
                                        <div
                                            key={election.id}
                                            className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${voterInElection?.hasVoted
                                                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                                                : 'hover:border-primary hover:bg-primary/5'
                                                }`}
                                            onClick={() => !voterInElection?.hasVoted && handleSelectElection(election)}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-sm sm:text-base truncate">{election.title}</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{election.description}</p>
                                                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                                        <p>Voting Period: {new Date(election.startDate || election.endDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}</p>
                                                        <p className="text-blue-600 dark:text-blue-400">
                                                            Status: {election.status === 'active' ? 'Voting Open' : election.status}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end sm:justify-center space-x-2 flex-shrink-0">
                                                    {voterInElection?.hasVoted ? (
                                                        <div className="flex items-center space-x-1 text-green-600">
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span className="text-sm">Voted</span>
                                                        </div>
                                                    ) : (
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

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
                                <CardTitle className="text-lg sm:text-xl truncate">{selectedElection.title}</CardTitle>
                                <CardDescription className="text-sm space-y-1">
                                    <p>Select your preferred candidate</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                                        Voting Period: {new Date(selectedElection.startDate || selectedElection.endDate).toLocaleDateString()} - {new Date(selectedElection.endDate).toLocaleDateString()}
                                    </p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                {selectedElection.candidates.map((candidate: any) => (
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
                                ))}

                                {error && (
                                    <div className="flex items-start space-x-2 text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <Button variant="outline" onClick={() => setStep("select-election")} className="flex-1">
                                        Back
                                    </Button>
                                    <Button onClick={handleCastVote} className="flex-1">
                                        <Vote className="mr-2 h-4 w-4" />
                                        Cast Vote
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
                                        <p className="truncate">Election: {selectedElection.title}</p>
                                        <p className="truncate">Candidate: {selectedCandidate.name}</p>
                                        <p>Time: {new Date().toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Button onClick={resetVoting} className="w-full">
                                        Vote in Another Election
                                    </Button>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={`/results/${selectedElection.id}`} target="_blank" rel="noopener noreferrer">
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
