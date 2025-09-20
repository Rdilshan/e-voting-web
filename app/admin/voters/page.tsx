"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    ArrowLeft,
    Filter,
    Download,
    Upload
} from "lucide-react"

// Mock data for voters
const votersData = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        voterId: "VTR-001",
        nationalId: "123456789",
        address: "123 Main St, City, State",
        status: "active",
        hasVoted: false,
        electionId: 1,
        electionTitle: "Presidential Election 2024",
        registeredAt: "2024-11-15T10:00:00",
        lastActivity: "2024-12-10T14:30:00"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 234-5678",
        voterId: "VTR-002",
        nationalId: "234567890",
        address: "456 Oak Ave, City, State",
        status: "active",
        hasVoted: true,
        electionId: 1,
        electionTitle: "Presidential Election 2024",
        registeredAt: "2024-11-15T10:15:00",
        lastActivity: "2024-12-10T16:45:00"
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        phone: "+1 (555) 345-6789",
        voterId: "VTR-003",
        nationalId: "345678901",
        address: "789 Pine St, City, State",
        status: "active",
        hasVoted: false,
        electionId: 1,
        electionTitle: "Presidential Election 2024",
        registeredAt: "2024-11-15T10:30:00",
        lastActivity: "2024-12-09T09:20:00"
    },
    {
        id: 4,
        name: "Sarah Lee",
        email: "sarah.lee@example.com",
        phone: "+1 (555) 456-7890",
        voterId: "VTR-004",
        nationalId: "456789012",
        address: "321 Elm St, City, State",
        status: "active",
        hasVoted: false,
        electionId: 2,
        electionTitle: "City Council Election",
        registeredAt: "2024-11-01T14:30:00",
        lastActivity: "2024-12-08T11:15:00"
    },
    {
        id: 5,
        name: "Robert Brown",
        email: "robert.brown@example.com",
        phone: "+1 (555) 567-8901",
        voterId: "VTR-005",
        nationalId: "567890123",
        address: "654 Maple Dr, City, State",
        status: "inactive",
        hasVoted: false,
        electionId: 2,
        electionTitle: "City Council Election",
        registeredAt: "2024-11-01T14:45:00",
        lastActivity: "2024-11-20T08:30:00"
    }
]

const electionsData = [
    { id: 1, title: "Presidential Election 2024" },
    { id: 2, title: "City Council Election" },
    { id: 3, title: "School Board Election" }
]

export default function VotersManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [electionFilter, setElectionFilter] = useState("all")
    const [showAddForm, setShowAddForm] = useState(false)
    const [newVoter, setNewVoter] = useState({
        name: "",
        email: "",
        phone: "",
        nationalId: "",
        address: "",
        electionId: ""
    })

    const filteredVoters = votersData.filter(voter => {
        const matchesSearch = voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voter.voterId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || voter.status === statusFilter
        const matchesElection = electionFilter === "all" || voter.electionId.toString() === electionFilter
        return matchesSearch && matchesStatus && matchesElection
    })

    const handleAddVoter = () => {
        if (newVoter.name && newVoter.email && newVoter.electionId) {
            // TODO: Add voter to backend
            const voterId = `VTR-${String(Date.now()).slice(-3).padStart(3, '0')}`
            console.log("Adding voter:", { ...newVoter, voterId })
            setNewVoter({
                name: "",
                email: "",
                phone: "",
                nationalId: "",
                address: "",
                electionId: ""
            })
            setShowAddForm(false)
        }
    }

    const handleDeleteVoter = (id: number) => {
        if (confirm("Are you sure you want to delete this voter? This action cannot be undone.")) {
            // TODO: Delete voter from backend
            console.log("Deleting voter:", id)
        }
    }

    const handleToggleStatus = (id: number) => {
        // TODO: Toggle voter status in backend
        console.log("Toggling status for voter:", id)
    }

    const handleExportVoters = () => {
        // TODO: Export voters to CSV
        console.log("Exporting voters...")
        alert("Voters exported successfully!")
    }

    const getStatusColor = (status: string) => {
        return status === "active"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }

    return (
        <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Voters Management</h1>
                        <p className="text-muted-foreground">
                            Manage authorized voters across all elections
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button variant="outline" onClick={handleExportVoters}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button onClick={() => setShowAddForm(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Voter
                        </Button>
                    </div>
                </div>

                {/* Add Voter Form */}
                {showAddForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Voter</CardTitle>
                            <CardDescription>
                                Register a new voter for an election
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter voter name"
                                        value={newVoter.name}
                                        onChange={(e) => setNewVoter(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="voter@example.com"
                                        value={newVoter.email}
                                        onChange={(e) => setNewVoter(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+1 (555) 123-4567"
                                        value={newVoter.phone}
                                        onChange={(e) => setNewVoter(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationalId">National ID</Label>
                                    <Input
                                        id="nationalId"
                                        placeholder="123456789"
                                        value={newVoter.nationalId}
                                        onChange={(e) => setNewVoter(prev => ({ ...prev, nationalId: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="123 Main St, City, State, ZIP"
                                    value={newVoter.address}
                                    onChange={(e) => setNewVoter(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="election">Election</Label>
                                <select
                                    id="election"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newVoter.electionId}
                                    onChange={(e) => setNewVoter(prev => ({ ...prev, electionId: e.target.value }))}
                                >
                                    <option value="">Select an election</option>
                                    {electionsData.map(election => (
                                        <option key={election.id} value={election.id}>
                                            {election.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                <Button onClick={handleAddVoter}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Voter
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
                                        placeholder="Search voters..."
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
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
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

                {/* Voters List */}
                <div className="grid gap-4">
                    {filteredVoters.map((voter) => (
                        <Card key={voter.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Users className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold text-lg">{voter.name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voter.status)}`}>
                                                    {voter.status}
                                                </span>
                                                {voter.hasVoted && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium flex items-center space-x-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Voted</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4" />
                                                    <span>{voter.email}</span>
                                                </div>
                                                {voter.phone && (
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{voter.phone}</span>
                                                    </div>
                                                )}
                                                <div className="text-xs">
                                                    <span className="font-medium">Voter ID:</span> {voter.voterId}
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-medium">Election:</span> {voter.electionTitle}
                                                </div>
                                                {voter.address && (
                                                    <div className="text-xs">
                                                        <span className="font-medium">Address:</span> {voter.address}
                                                    </div>
                                                )}
                                                <div className="text-xs">
                                                    <span className="font-medium">Registered:</span> {new Date(voter.registeredAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-medium">Last Activity:</span> {new Date(voter.lastActivity).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleStatus(voter.id)}
                                        >
                                            {voter.status === "active" ? (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            )}
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteVoter(voter.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredVoters.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No voters found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== "all" || electionFilter !== "all"
                                    ? "Try adjusting your search or filter criteria."
                                    : "Get started by adding your first voter."
                                }
                            </p>
                            {!searchTerm && statusFilter === "all" && electionFilter === "all" && (
                                <Button onClick={() => setShowAddForm(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Voter
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{votersData.length}</div>
                                <div className="text-sm text-muted-foreground">Total Voters</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {votersData.filter(v => v.status === "active").length}
                                </div>
                                <div className="text-sm text-muted-foreground">Active Voters</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {votersData.filter(v => v.hasVoted).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Voted</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {votersData.filter(v => v.hasVoted).length > 0
                                        ? ((votersData.filter(v => v.hasVoted).length / votersData.filter(v => v.status === "active").length) * 100).toFixed(1)
                                        : 0}%
                                </div>
                                <div className="text-sm text-muted-foreground">Turnout Rate</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}
