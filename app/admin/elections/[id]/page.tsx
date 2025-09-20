"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Vote,
    Calendar,
    Users,
    UserCheck,
    BarChart3,
    Edit,
    Trash2,
    ArrowLeft,
    CheckCircle,
    Clock,
    Mail,
    Phone,
    Download,
    RefreshCw,
    Eye
} from "lucide-react"

// Mock data for election details
const electionData = {
    "1": {
        id: 1,
        title: "Presidential Election 2024",
        description: "Choose the next President of the United States. This is a crucial election that will determine the direction of our country for the next four years.",
        status: "active",
        startDate: "2024-12-01T09:00:00",
        endDate: "2024-12-15T18:00:00",
        createdAt: "2024-11-15T10:00:00",
        createdBy: "Admin User",
        totalVotes: 89,
        candidates: [
            {
                id: 1,
                name: "Alice Johnson",
                party: "Democratic Party",
                description: "Former Senator with 20 years of public service experience",
                email: "alice.johnson@example.com",
                phone: "+1 (555) 123-4567",
                votes: 48,
                percentage: 53.9
            },
            {
                id: 2,
                name: "Bob Smith",
                party: "Republican Party",
                description: "Business leader and former Governor with proven leadership",
                email: "bob.smith@example.com",
                phone: "+1 (555) 234-5678",
                votes: 28,
                percentage: 31.5
            },
            {
                id: 3,
                name: "Carol Davis",
                party: "Independent",
                description: "Environmental scientist advocating for sustainable policies",
                email: "carol.davis@example.com",
                phone: "+1 (555) 345-6789",
                votes: 13,
                percentage: 14.6
            }
        ],
        voters: [
            {
                id: 1,
                name: "John Doe",
                email: "john.doe@example.com",
                voterId: "VTR-001",
                status: "active",
                hasVoted: true,
                votedAt: "2024-12-10T14:30:00"
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane.smith@example.com",
                voterId: "VTR-002",
                status: "active",
                hasVoted: true,
                votedAt: "2024-12-10T16:45:00"
            },
            {
                id: 3,
                name: "Mike Johnson",
                email: "mike.johnson@example.com",
                voterId: "VTR-003",
                status: "active",
                hasVoted: false,
                votedAt: null
            },
            {
                id: 4,
                name: "Sarah Wilson",
                email: "sarah.wilson@example.com",
                voterId: "VTR-004",
                status: "active",
                hasVoted: true,
                votedAt: "2024-12-11T09:15:00"
            },
            {
                id: 5,
                name: "David Brown",
                email: "david.brown@example.com",
                voterId: "VTR-005",
                status: "inactive",
                hasVoted: false,
                votedAt: null
            }
        ]
    }
}

export default function ElectionDetails() {
    const params = useParams()
    const electionId = params.id as string
    const election = electionData[electionId as keyof typeof electionData]
    const [activeTab, setActiveTab] = useState<"overview" | "candidates" | "voters" | "results">("overview")

    if (!election) {
        return (
            <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
                <div className="text-center py-12">
                    <Vote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Election Not Found</h1>
                    <p className="text-muted-foreground mb-4">The election you&apos;re looking for doesn&apos;t exist.</p>
                    <Button asChild>
                        <Link href="/admin/elections">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Elections
                        </Link>
                    </Button>
                </div>
            </MainLayout>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "upcoming": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active": return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            case "completed": return <CheckCircle className="w-4 h-4 text-blue-500" />
            case "upcoming": return <Clock className="w-4 h-4 text-yellow-500" />
            default: return <Clock className="w-4 h-4 text-gray-500" />
        }
    }

    const activeVoters = election.voters.filter(v => v.status === "active")
    const votedCount = election.voters.filter(v => v.hasVoted).length
    const turnoutRate = activeVoters.length > 0 ? (votedCount / activeVoters.length) * 100 : 0

    const handleDeleteElection = () => {
        if (confirm("Are you sure you want to delete this election? This action cannot be undone.")) {
            // TODO: Delete election from backend
            console.log("Deleting election:", election.id)
            // Redirect to elections list
            window.location.href = "/admin/elections"
        }
    }

    const handleExportData = () => {
        // TODO: Export election data
        console.log("Exporting election data:", election.id)
        alert("Election data exported successfully!")
    }

    return (
        <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4 sm:space-y-2">
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/elections">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Back to Elections</span>
                                <span className="sm:hidden">Back</span>
                            </Link>
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                        <div className="space-y-2 min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(election.status)}
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">{election.title}</h1>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(election.status)} self-start`}>
                                    {election.status}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm sm:text-base">{election.description}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                            <Button variant="outline" onClick={handleExportData} className="w-full sm:w-auto">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteElection} className="w-full sm:w-auto">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Card>
                        <CardContent className="pt-4 sm:pt-6">
                            <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold text-primary">{election.candidates.length}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">Candidates</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 sm:pt-6">
                            <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold text-primary">{activeVoters.length}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">Eligible Voters</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 sm:pt-6">
                            <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold text-primary">{votedCount}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">Votes Cast</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 sm:pt-6">
                            <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold text-primary">{turnoutRate.toFixed(1)}%</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">Turnout Rate</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b">
                    <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "overview"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("candidates")}
                            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "candidates"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                                }`}
                        >
                            <span className="hidden sm:inline">Candidates ({election.candidates.length})</span>
                            <span className="sm:hidden">Candidates</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("voters")}
                            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "voters"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                                }`}
                        >
                            <span className="hidden sm:inline">Voters ({election.voters.length})</span>
                            <span className="sm:hidden">Voters</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("results")}
                            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "results"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                                }`}
                        >
                            Results
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Election Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Start Date:</span>
                                        <div className="text-muted-foreground text-xs sm:text-sm">
                                            {new Date(election.startDate).toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">End Date:</span>
                                        <div className="text-muted-foreground text-xs sm:text-sm">
                                            {new Date(election.endDate).toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Created:</span>
                                        <div className="text-muted-foreground text-xs sm:text-sm">
                                            {new Date(election.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Created By:</span>
                                        <div className="text-muted-foreground text-xs sm:text-sm">{election.createdBy}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href={`/admin/results?election=${election.id}`}>
                                        <BarChart3 className="mr-2 h-4 w-4" />
                                        View Detailed Results
                                    </Link>
                                </Button>
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <a href={`/results/${election.id}`} target="_blank" rel="noopener noreferrer">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Public Results Page
                                    </a>
                                </Button>
                                <Button className="w-full justify-start" variant="outline" onClick={handleExportData}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Data
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "candidates" && (
                    <div className="space-y-3 sm:space-y-4">
                        {election.candidates.map((candidate, index) => (
                            <Card key={candidate.id}>
                                <CardContent className="pt-4 sm:pt-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                                        <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                                                    <h3 className="font-semibold text-base sm:text-lg truncate">{candidate.name}</h3>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium self-start">
                                                        {candidate.party}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{candidate.description}</p>
                                                <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                                    <div className="flex items-center space-x-1">
                                                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                        <span className="truncate">{candidate.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                        <span>{candidate.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-right flex-shrink-0">
                                            <div className="text-xl sm:text-2xl font-bold text-primary">{candidate.votes}</div>
                                            <div className="text-xs sm:text-sm text-muted-foreground">votes ({candidate.percentage}%)</div>
                                            <div className="w-full sm:w-24 bg-gray-200 rounded-full h-2 mt-2">
                                                <div
                                                    className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' :
                                                        index === 1 ? 'bg-green-500' :
                                                            'bg-yellow-500'
                                                        }`}
                                                    style={{ width: `${candidate.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === "voters" && (
                    <div className="space-y-3 sm:space-y-4">
                        {election.voters.map((voter) => (
                            <Card key={voter.id}>
                                <CardContent className="pt-4 sm:pt-6">
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                                                <h3 className="font-medium text-sm sm:text-base truncate">{voter.name}</h3>
                                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${voter.status === "active"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        }`}>
                                                        {voter.status}
                                                    </span>
                                                    {voter.hasVoted && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium flex items-center space-x-1">
                                                            <CheckCircle className="h-3 w-3" />
                                                            <span>Voted</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                                                <div className="truncate">Email: {voter.email}</div>
                                                <div>Voter ID: {voter.voterId}</div>
                                                {voter.votedAt && (
                                                    <div>Voted: {new Date(voter.votedAt).toLocaleString()}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === "results" && (
                    <div className="space-y-4 sm:space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                    <div>
                                        <CardTitle className="text-lg sm:text-xl">Live Results</CardTitle>
                                        <CardDescription className="text-sm">Real-time voting results</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Refresh
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6">
                                {election.candidates.map((candidate, index) => (
                                    <div key={candidate.id} className="space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm sm:text-base truncate">{candidate.name}</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground">{candidate.party}</p>
                                            </div>
                                            <div className="text-left sm:text-right flex-shrink-0">
                                                <p className="font-bold text-base sm:text-lg">{candidate.votes} votes</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground">{candidate.percentage}%</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                                            <div
                                                className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${index === 0 ? 'bg-blue-500' :
                                                    index === 1 ? 'bg-green-500' :
                                                        'bg-yellow-500'
                                                    }`}
                                                style={{ width: `${candidate.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {election.status === "active" && (
                            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                                <CardContent className="pt-4 sm:pt-6">
                                    <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="font-medium text-sm sm:text-base">Live Election in Progress</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 mt-2">
                                        Results are updating in real-time as votes are cast. Current turnout: {turnoutRate.toFixed(1)}%
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
