"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    User,
    Plus,
    Search,
    Edit,
    Trash2,
    Users,
    Vote,
    ArrowLeft,
    Filter
} from "lucide-react"

// Mock data for candidates
const candidatesData = [
    {
        id: 1,
        name: "Alice Johnson",
        party: "Democratic Party",
        description: "Former Senator with 20 years of public service experience",
        email: "alice.johnson@example.com",
        phone: "+1 (555) 123-4567",
        electionId: 1,
        electionTitle: "Presidential Election 2024",
        votes: 78,
        createdAt: "2024-11-15T10:00:00"
    },
    {
        id: 2,
        name: "Bob Smith",
        party: "Republican Party",
        description: "Business leader and former Governor with proven leadership",
        email: "bob.smith@example.com",
        phone: "+1 (555) 234-5678",
        electionId: 1,
        electionTitle: "Presidential Election 2024",
        votes: 45,
        createdAt: "2024-11-15T10:15:00"
    },
    {
        id: 3,
        name: "Carol Davis",
        party: "Independent",
        description: "Environmental scientist advocating for sustainable policies",
        email: "carol.davis@example.com",
        phone: "+1 (555) 345-6789",
        electionId: 1,
        electionTitle: "Presidential Election 2024",
        votes: 19,
        createdAt: "2024-11-15T10:30:00"
    },
    {
        id: 4,
        name: "David Wilson",
        party: "Local Party A",
        description: "Community organizer focused on local development",
        email: "david.wilson@example.com",
        phone: "+1 (555) 456-7890",
        electionId: 2,
        electionTitle: "City Council Election",
        votes: 34,
        createdAt: "2024-11-01T14:30:00"
    },
    {
        id: 5,
        name: "Emma Brown",
        party: "Local Party B",
        description: "Small business owner with community focus",
        email: "emma.brown@example.com",
        phone: "+1 (555) 567-8901",
        electionId: 2,
        electionTitle: "City Council Election",
        votes: 28,
        createdAt: "2024-11-01T14:45:00"
    },
    {
        id: 6,
        name: "Frank Miller",
        party: "Independent",
        description: "Retired teacher advocating for education reform",
        email: "frank.miller@example.com",
        phone: "+1 (555) 678-9012",
        electionId: 2,
        electionTitle: "City Council Election",
        votes: 27,
        createdAt: "2024-11-01T15:00:00"
    }
]

const electionsData = [
    { id: 1, title: "Presidential Election 2024" },
    { id: 2, title: "City Council Election" },
    { id: 3, title: "School Board Election" }
]

export default function CandidatesManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [electionFilter, setElectionFilter] = useState("all")
    const [showAddForm, setShowAddForm] = useState(false)
    const [newCandidate, setNewCandidate] = useState({
        name: "",
        party: "",
        description: "",
        email: "",
        phone: "",
        electionId: ""
    })

    const filteredCandidates = candidatesData.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.electionTitle.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesElection = electionFilter === "all" || candidate.electionId.toString() === electionFilter
        return matchesSearch && matchesElection
    })

    const handleAddCandidate = () => {
        if (newCandidate.name && newCandidate.party && newCandidate.electionId) {
            // TODO: Add candidate to backend
            console.log("Adding candidate:", newCandidate)
            setNewCandidate({
                name: "",
                party: "",
                description: "",
                email: "",
                phone: "",
                electionId: ""
            })
            setShowAddForm(false)
        }
    }

    const handleDeleteCandidate = (id: number) => {
        if (confirm("Are you sure you want to delete this candidate? This action cannot be undone.")) {
            // TODO: Delete candidate from backend
            console.log("Deleting candidate:", id)
        }
    }

    return (
        <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Candidates Management</h1>
                        <p className="text-muted-foreground">
                            Manage candidates across all elections
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button onClick={() => setShowAddForm(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Candidate
                        </Button>
                    </div>
                </div>

                {/* Add Candidate Form */}
                {showAddForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Candidate</CardTitle>
                            <CardDescription>
                                Add a candidate to an existing election
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter candidate name"
                                        value={newCandidate.name}
                                        onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="party">Party/Affiliation</Label>
                                    <Input
                                        id="party"
                                        placeholder="Enter party or affiliation"
                                        value={newCandidate.party}
                                        onChange={(e) => setNewCandidate(prev => ({ ...prev, party: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="election">Election</Label>
                                <select
                                    id="election"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newCandidate.electionId}
                                    onChange={(e) => setNewCandidate(prev => ({ ...prev, electionId: e.target.value }))}
                                >
                                    <option value="">Select an election</option>
                                    {electionsData.map(election => (
                                        <option key={election.id} value={election.id}>
                                            {election.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Brief description of the candidate"
                                    value={newCandidate.description}
                                    onChange={(e) => setNewCandidate(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email (Optional)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="candidate@example.com"
                                        value={newCandidate.email}
                                        onChange={(e) => setNewCandidate(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone (Optional)</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+1 (555) 123-4567"
                                        value={newCandidate.phone}
                                        onChange={(e) => setNewCandidate(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Button onClick={handleAddCandidate}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Candidate
                                </Button>
                                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Filters and Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search candidates..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <select
                                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={electionFilter}
                                    onChange={(e) => setElectionFilter(e.target.value)}
                                >
                                    <option value="all">All Elections</option>
                                    {electionsData.map(election => (
                                        <option key={election.id} value={election.id}>
                                            {election.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Candidates List */}
                <div className="grid gap-4">
                    {filteredCandidates.map((candidate) => (
                        <Card key={candidate.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold text-lg">{candidate.name}</h3>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                                                    {candidate.party}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{candidate.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <span className="flex items-center space-x-1">
                                                    <Vote className="h-4 w-4" />
                                                    <span>{candidate.electionTitle}</span>
                                                </span>
                                                {candidate.votes > 0 && (
                                                    <span className="flex items-center space-x-1">
                                                        <Users className="h-4 w-4" />
                                                        <span>{candidate.votes} votes</span>
                                                    </span>
                                                )}
                                            </div>
                                            {(candidate.email || candidate.phone) && (
                                                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                                                    {candidate.email && <div>Email: {candidate.email}</div>}
                                                    {candidate.phone && <div>Phone: {candidate.phone}</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteCandidate(candidate.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredCandidates.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || electionFilter !== "all"
                                    ? "Try adjusting your search or filter criteria."
                                    : "Get started by adding your first candidate."
                                }
                            </p>
                            {!searchTerm && electionFilter === "all" && (
                                <Button onClick={() => setShowAddForm(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Candidate
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{candidatesData.length}</div>
                                <div className="text-sm text-muted-foreground">Total Candidates</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {candidatesData.reduce((sum, candidate) => sum + candidate.votes, 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Votes Received</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {new Set(candidatesData.map(c => c.electionId)).size}
                                </div>
                                <div className="text-sm text-muted-foreground">Elections with Candidates</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}
