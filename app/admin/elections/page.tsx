"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Vote,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Calendar,
    Users,
    CheckCircle,
    Clock,
    ArrowLeft
} from "lucide-react"

// Mock data for elections
const electionsData = [
    {
        id: 1,
        title: "Presidential Election 2024",
        description: "Choose the next President of the United States",
        status: "active",
        startDate: "2024-12-01T09:00:00",
        endDate: "2024-12-15T18:00:00",
        totalCandidates: 4,
        totalVoters: 150,
        totalVotes: 89,
        createdAt: "2024-11-15T10:00:00"
    },
    {
        id: 2,
        title: "City Council Election",
        description: "Select your local city council representatives",
        status: "completed",
        startDate: "2024-11-15T08:00:00",
        endDate: "2024-11-30T20:00:00",
        totalCandidates: 8,
        totalVoters: 200,
        totalVotes: 156,
        createdAt: "2024-11-01T14:30:00"
    },
    {
        id: 3,
        title: "School Board Election",
        description: "Vote for school board members in your district",
        status: "upcoming",
        startDate: "2024-12-20T07:00:00",
        endDate: "2025-01-05T19:00:00",
        totalCandidates: 6,
        totalVoters: 80,
        totalVotes: 0,
        createdAt: "2024-12-01T11:15:00"
    },
    {
        id: 4,
        title: "Student Union Election",
        description: "Choose student representatives",
        status: "draft",
        startDate: "2025-01-15T10:00:00",
        endDate: "2025-01-25T16:00:00",
        totalCandidates: 3,
        totalVoters: 45,
        totalVotes: 0,
        createdAt: "2024-12-05T09:20:00"
    }
]

export default function ElectionsManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "upcoming": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active": return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            case "completed": return <CheckCircle className="w-4 h-4 text-blue-500" />
            case "upcoming": return <Clock className="w-4 h-4 text-yellow-500" />
            case "draft": return <Edit className="w-4 h-4 text-gray-500" />
            default: return <Clock className="w-4 h-4 text-gray-500" />
        }
    }

    const filteredElections = electionsData.filter(election => {
        const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            election.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || election.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleDeleteElection = (id: number) => {
        if (confirm("Are you sure you want to delete this election? This action cannot be undone.")) {
            // TODO: Delete election from backend
            console.log("Deleting election:", id)
        }
    }

    return (
        <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Elections Management</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Manage all elections, view details, and monitor progress
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button asChild className="w-full sm:w-auto">
                            <Link href="/admin/create-election">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Election
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="flex flex-col space-y-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search elections..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={statusFilter === "all" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter("all")}
                                    className="text-xs sm:text-sm"
                                >
                                    All ({electionsData.length})
                                </Button>
                                <Button
                                    variant={statusFilter === "active" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter("active")}
                                    className="text-xs sm:text-sm"
                                >
                                    Active ({electionsData.filter(e => e.status === "active").length})
                                </Button>
                                <Button
                                    variant={statusFilter === "completed" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter("completed")}
                                    className="text-xs sm:text-sm"
                                >
                                    Completed ({electionsData.filter(e => e.status === "completed").length})
                                </Button>
                                <Button
                                    variant={statusFilter === "upcoming" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter("upcoming")}
                                    className="text-xs sm:text-sm"
                                >
                                    Upcoming ({electionsData.filter(e => e.status === "upcoming").length})
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Elections Grid */}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredElections.map((election) => (
                        <Card key={election.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3 sm:pb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                                        {getStatusIcon(election.status)}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)} whitespace-nowrap`}>
                                            {election.status}
                                        </span>
                                    </div>
                                    <div className="flex space-x-1 flex-shrink-0">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/elections/${election.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteElection(election.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="text-base sm:text-lg leading-tight">{election.title}</CardTitle>
                                <CardDescription className="text-sm line-clamp-2">{election.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4 pt-0">
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                    <div>
                                        <div className="text-base sm:text-lg font-bold text-primary">{election.totalCandidates}</div>
                                        <div className="text-xs text-muted-foreground">Candidates</div>
                                    </div>
                                    <div>
                                        <div className="text-base sm:text-lg font-bold text-primary">{election.totalVoters}</div>
                                        <div className="text-xs text-muted-foreground">Voters</div>
                                    </div>
                                    <div>
                                        <div className="text-base sm:text-lg font-bold text-primary">{election.totalVotes}</div>
                                        <div className="text-xs text-muted-foreground">Votes</div>
                                    </div>
                                </div>

                                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Start:</span>
                                        <span className="text-right">{new Date(election.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">End:</span>
                                        <span className="text-right">{new Date(election.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Created:</span>
                                        <span className="text-right">{new Date(election.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {election.status === "active" && (
                                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-sm font-medium">Live Election</span>
                                        </div>
                                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                            Voting is currently in progress
                                        </p>
                                    </div>
                                )}

                                {election.totalVotes > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Turnout: {((election.totalVotes / election.totalVoters) * 100).toFixed(1)}%
                                        </div>
                                        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(election.totalVotes / election.totalVoters) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" asChild>
                                        <Link href={`/admin/elections/${election.id}`}>
                                            <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            View Details
                                        </Link>
                                    </Button>
                                    {election.status === "active" && (
                                        <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" asChild>
                                            <Link href={`/admin/results?election=${election.id}`}>
                                                <Vote className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                Results
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredElections.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Vote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No elections found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filter criteria."
                                    : "Get started by creating your first election."
                                }
                            </p>
                            {!searchTerm && statusFilter === "all" && (
                                <Button asChild>
                                    <Link href="/admin/create-election">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create First Election
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    )
}
