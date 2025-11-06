"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ArrowLeft,
    Plus,
    Save,
    Trash2,
    User,
    Users,
    Vote
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createElection } from "./action"

interface Candidate {
    id: string
    name: string
    nic: string
    party: string
}

interface Voter {
    id: string
    nic: string
}

export default function CreateElection() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<string>("")
    const [progress, setProgress] = useState<{ step: number; message: string } | null>(null)

    const [electionData, setElectionData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
    })

    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [voters, setVoters] = useState<Voter[]>([])

    const [newCandidate, setNewCandidate] = useState({
        name: "",
        nic: "",
        party: ""
    })

    const [newVoter, setNewVoter] = useState({
        nic: ""
    })

    const handleElectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setElectionData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const addCandidate = () => {
        if (newCandidate.name && newCandidate.nic && newCandidate.party) {
            const candidate: Candidate = {
                id: Date.now().toString(),
                name: newCandidate.name.trim(),
                nic: newCandidate.nic.trim(),
                party: newCandidate.party.trim(),
            }
            setCandidates(prev => [...prev, candidate])
            setNewCandidate({ name: "", nic: "", party: "" })
        }
    }

    const removeCandidate = (id: string) => {
        setCandidates(prev => prev.filter(c => c.id !== id))
    }

    const addVoter = () => {
        if (newVoter.nic.trim()) {
            const voter: Voter = {
                id: Date.now().toString(),
                nic: newVoter.nic.trim(),
            }
            setVoters(prev => [...prev, voter])
            setNewVoter({ nic: "" })
        }
    }

    const removeVoter = (id: string) => {
        setVoters(prev => prev.filter(v => v.id !== id))
    }

    const handleCreateElection = async () => {
        // Validate form data
        if (!electionData.title.trim()) {
            setError("Please enter an election title")
            return
        }

        if (!electionData.startDate || !electionData.endDate) {
            setError("Please select both start and end dates")
            return
        }

        if (candidates.length === 0) {
            setError("Please add at least one candidate")
            return
        }

        if (voters.length === 0) {
            setError("Please add at least one voter")
            return
        }

        // Validate dates
        const startDate = new Date(electionData.startDate)
        const endDate = new Date(electionData.endDate)

        if (startDate >= endDate) {
            setError("End date must be after start date")
            return
        }

        setIsLoading(true)
        setError("")
        setSuccess("")
        setProgress({ step: 0, message: "Starting election creation process..." })

        // Simulate progress updates
        const progressSteps = [
            { step: 1, message: `Checking ${voters.length} voter NIC(s)...` },
            { step: 2, message: `Checking ${candidates.length} candidate NIC(s)...` },
            { step: 3, message: "Registering NICs on blockchain..." },
            { step: 4, message: `Creating election "${electionData.title}"...` },
            { step: 5, message: "Waiting for transaction confirmation..." },
            { step: 6, message: "✓ Election created successfully!" },
        ]

        let currentStep = 0
        const progressInterval = setInterval(() => {
            if (currentStep < progressSteps.length) {
                setProgress(progressSteps[currentStep])
                currentStep++
            }
        }, 2000)

        try {
            const result = await createElection({
                title: electionData.title.trim(),
                description: electionData.description.trim(),
                startDate: electionData.startDate,
                endDate: electionData.endDate,
                candidates: candidates.map((c) => ({
                    name: c.name,
                    nic: c.nic,
                    party: c.party,
                })),
                voters: voters.map((v) => ({ nic: v.nic })),
            })

            clearInterval(progressInterval)

            if (result.success) {
                setProgress({ step: 6, message: "✓ Election created successfully!" })
                setSuccess(
                    result.message || `Election created successfully! Election ID: ${result.electionId}`
                )
                // Redirect to elections page after 2 seconds
                setTimeout(() => {
                    router.push("/admin/elections")
                }, 2000)
            } else {
                setProgress(null)
                setError(result.message || "Failed to create election")
                if (result.errors && result.errors.length > 0) {
                    setError(
                        `${result.message}\n${result.errors.join("\n")}`
                    )
                }
            }
        } catch (err: unknown) {
            clearInterval(progressInterval)
            console.error("Error creating election:", err)
            setProgress(null)
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create New Election</h1>
                        <p className="text-muted-foreground">
                            Set up a new voting process with candidates and authorized voters
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => router.push("/admin/elections")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        <div className="font-medium mb-1">Error</div>
                        <div className="whitespace-pre-line">{error}</div>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                        <div className="font-medium mb-1">Success</div>
                        <div>{success}</div>
                    </div>
                )}

                {/* Progress Indicator */}
                {isLoading && progress && (
                    <div className="p-4 text-sm bg-blue-50 border border-blue-200 rounded-md">
                        <div className="font-medium mb-2 text-blue-800">Progress</div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                <span className="text-blue-700">{progress.message}</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(progress.step / 6) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Election Details */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Vote className="h-5 w-5" />
                                    <span>Election Details</span>
                                </CardTitle>
                                <CardDescription>
                                    Basic information about the election
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Election Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g., Presidential Election 2024"
                                        value={electionData.title}
                                        onChange={handleElectionChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Describe the purpose of this election"
                                        value={electionData.description}
                                        onChange={handleElectionChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                            id="startDate"
                                            name="startDate"
                                            type="datetime-local"
                                            value={electionData.startDate}
                                            onChange={handleElectionChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                            id="endDate"
                                            name="endDate"
                                            type="datetime-local"
                                            value={electionData.endDate}
                                            onChange={handleElectionChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Candidates Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Candidates</span>
                                </CardTitle>
                                <CardDescription>
                                    Add candidates for this election
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3">
                                    <Input
                                        placeholder="Candidate Name"
                                        value={newCandidate.name}
                                        onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                    <Input
                                        placeholder="NIC Number"
                                        value={newCandidate.nic}
                                        onChange={(e) => setNewCandidate(prev => ({ ...prev, nic: e.target.value }))}
                                    />
                                    <Input
                                        placeholder="Party/Affiliation"
                                        value={newCandidate.party}
                                        onChange={(e) => setNewCandidate(prev => ({ ...prev, party: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                addCandidate()
                                            }
                                        }}
                                    />
                                    <Button onClick={addCandidate} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Candidate
                                    </Button>
                                </div>

                                {candidates.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Added Candidates ({candidates.length})</h4>
                                        {candidates.map((candidate) => (
                                            <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{candidate.name}</p>
                                                    <p className="text-sm text-muted-foreground">NIC: {candidate.nic}</p>
                                                    <p className="text-sm text-muted-foreground">{candidate.party}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeCandidate(candidate.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Voters Management */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="h-5 w-5" />
                                    <span>Authorized Voters</span>
                                </CardTitle>
                                <CardDescription>
                                    Add users who can vote in this election
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3">
                                    <Input
                                        placeholder="NIC Number"
                                        value={newVoter.nic}
                                        onChange={(e) => setNewVoter(prev => ({ ...prev, nic: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                addVoter()
                                            }
                                        }}
                                    />
                                    <Button onClick={addVoter} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Voter
                                    </Button>
                                </div>

                                {voters.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Authorized Voters ({voters.length})</h4>
                                        <div className="max-h-64 overflow-y-auto space-y-2">
                                            {voters.map((voter) => (
                                                <div key={voter.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{voter.nic}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeVoter(voter.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Create Election Button */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        <p>Summary:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>{candidates.length} candidates added</li>
                                            <li>{voters.length} authorized voters</li>
                                            <li>Election period: {electionData.startDate ? new Date(electionData.startDate).toLocaleDateString() : 'Not set'} - {electionData.endDate ? new Date(electionData.endDate).toLocaleDateString() : 'Not set'}</li>
                                        </ul>
                                    </div>

                                    <Button
                                        onClick={handleCreateElection}
                                        className="w-full"
                                        disabled={
                                            isLoading ||
                                            !electionData.title ||
                                            candidates.length === 0 ||
                                            voters.length === 0 ||
                                            !electionData.startDate ||
                                            !electionData.endDate
                                        }
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {isLoading ? "Creating Election..." : "Create Election"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
