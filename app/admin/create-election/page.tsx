"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Vote,
    Plus,
    Trash2,
    User,
    Users,
    Calendar,
    Save,
    ArrowLeft
} from "lucide-react"

interface Candidate {
    id: string
    name: string
    party: string
    description: string
}

interface Voter {
    id: string
    name: string
    email: string
    voterId: string
}

export default function CreateElection() {
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
        party: "",
        description: ""
    })

    const [newVoter, setNewVoter] = useState({
        name: "",
        email: "",
        voterId: ""
    })

    const handleElectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setElectionData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const addCandidate = () => {
        if (newCandidate.name && newCandidate.party) {
            const candidate: Candidate = {
                id: Date.now().toString(),
                ...newCandidate
            }
            setCandidates(prev => [...prev, candidate])
            setNewCandidate({ name: "", party: "", description: "" })
        }
    }

    const removeCandidate = (id: string) => {
        setCandidates(prev => prev.filter(c => c.id !== id))
    }

    const addVoter = () => {
        if (newVoter.name && newVoter.email) {
            const voter: Voter = {
                id: Date.now().toString(),
                voterId: newVoter.voterId || `VTR-${Date.now()}`,
                ...newVoter
            }
            setVoters(prev => [...prev, voter])
            setNewVoter({ name: "", email: "", voterId: "" })
        }
    }

    const removeVoter = (id: string) => {
        setVoters(prev => prev.filter(v => v.id !== id))
    }

    const handleCreateElection = () => {
        const election = {
            ...electionData,
            candidates,
            voters,
            createdAt: new Date().toISOString()
        }

        // TODO: Save election to backend/database
        console.log("Creating election:", election)
        alert("Election created successfully!")
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
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>

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
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="Candidate Name"
                                            value={newCandidate.name}
                                            onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                        <Input
                                            placeholder="Party/Affiliation"
                                            value={newCandidate.party}
                                            onChange={(e) => setNewCandidate(prev => ({ ...prev, party: e.target.value }))}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Description (optional)"
                                        value={newCandidate.description}
                                        onChange={(e) => setNewCandidate(prev => ({ ...prev, description: e.target.value }))}
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
                                                    <p className="text-sm text-muted-foreground">{candidate.party}</p>
                                                    {candidate.description && (
                                                        <p className="text-xs text-muted-foreground">{candidate.description}</p>
                                                    )}
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
                                        placeholder="Voter Name"
                                        value={newVoter.name}
                                        onChange={(e) => setNewVoter(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                    <Input
                                        placeholder="Email Address"
                                        type="email"
                                        value={newVoter.email}
                                        onChange={(e) => setNewVoter(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                    <Input
                                        placeholder="Voter ID (optional - auto-generated)"
                                        value={newVoter.voterId}
                                        onChange={(e) => setNewVoter(prev => ({ ...prev, voterId: e.target.value }))}
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
                                                        <p className="font-medium">{voter.name}</p>
                                                        <p className="text-sm text-muted-foreground">{voter.email}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {voter.voterId}</p>
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
                                        disabled={!electionData.title || candidates.length === 0 || voters.length === 0}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Election
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
