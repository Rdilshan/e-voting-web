"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    BarChart3,
    Download,
    RefreshCw,
    Users,
    Vote,
    Trophy,
    ArrowLeft,
    Eye
} from "lucide-react"

// Mock data for elections and results
const electionsData = [
    {
        id: 1,
        title: "Presidential Election 2024",
        status: "completed",
        totalVoters: 150,
        totalVotes: 142,
        turnout: 94.7,
        endDate: "2024-12-15",
        candidates: [
            { id: 1, name: "Alice Johnson", party: "Democratic Party", votes: 78, percentage: 54.9 },
            { id: 2, name: "Bob Smith", party: "Republican Party", votes: 45, percentage: 31.7 },
            { id: 3, name: "Carol Davis", party: "Independent", votes: 19, percentage: 13.4 }
        ]
    },
    {
        id: 2,
        title: "City Council Election",
        status: "active",
        totalVoters: 200,
        totalVotes: 89,
        turnout: 44.5,
        endDate: "2024-12-20",
        candidates: [
            { id: 4, name: "David Wilson", party: "Local Party A", votes: 34, percentage: 38.2 },
            { id: 5, name: "Emma Brown", party: "Local Party B", votes: 28, percentage: 31.5 },
            { id: 6, name: "Frank Miller", party: "Independent", votes: 27, percentage: 30.3 }
        ]
    },
    {
        id: 3,
        title: "School Board Election",
        status: "upcoming",
        totalVoters: 80,
        totalVotes: 0,
        turnout: 0,
        endDate: "2024-12-25",
        candidates: [
            { id: 7, name: "Grace Lee", party: "Education First", votes: 0, percentage: 0 },
            { id: 8, name: "Henry Clark", party: "Reform Party", votes: 0, percentage: 0 }
        ]
    }
]

export default function VotingResults() {
    const [selectedElection, setSelectedElection] = useState(electionsData[0])
    const [refreshing, setRefreshing] = useState(false)

    const handleRefresh = () => {
        setRefreshing(true)
        // TODO: Fetch latest results from backend
        setTimeout(() => setRefreshing(false), 1000)
    }

    const handleDownloadResults = () => {
        // TODO: Generate and download results report
        console.log("Downloading results for:", selectedElection.title)
        alert("Results downloaded successfully!")
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "text-green-600 bg-green-100"
            case "completed": return "text-blue-600 bg-blue-100"
            case "upcoming": return "text-gray-600 bg-gray-100"
            default: return "text-gray-600 bg-gray-100"
        }
    }

    const getWinner = (candidates: any[]) => {
        return candidates.reduce((prev, current) =>
            prev.votes > current.votes ? prev : current
        )
    }

    return (
        <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Voting Results</h1>
                        <p className="text-muted-foreground">
                            View real-time results and analytics for all elections
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Elections List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Elections</CardTitle>
                            <CardDescription>
                                Select an election to view results
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {electionsData.map((election) => (
                                <div
                                    key={election.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedElection.id === election.id
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-accent'
                                        }`}
                                    onClick={() => setSelectedElection(election)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">{election.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Ends: {new Date(election.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                                            {election.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {election.totalVotes} / {election.totalVoters} votes ({election.turnout}%)
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Results Display */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Election Overview */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Vote className="h-5 w-5" />
                                            <span>{selectedElection.title}</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Election results and statistics
                                        </CardDescription>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRefresh}
                                            disabled={refreshing}
                                        >
                                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownloadResults}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a href={`/results/${selectedElection.id}`} target="_blank" rel="noopener noreferrer">
                                                <Eye className="mr-2 h-4 w-4" />
                                                Public View
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{selectedElection.totalVotes}</div>
                                        <div className="text-sm text-muted-foreground">Total Votes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{selectedElection.totalVoters}</div>
                                        <div className="text-sm text-muted-foreground">Eligible Voters</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{selectedElection.turnout}%</div>
                                        <div className="text-sm text-muted-foreground">Turnout</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Winner Card (for completed elections) */}
                        {selectedElection.status === "completed" && selectedElection.totalVotes > 0 && (
                            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                                        <Trophy className="h-5 w-5" />
                                        <span>Winner</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {(() => {
                                        const winner = getWinner(selectedElection.candidates)
                                        return (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-lg text-yellow-900 dark:text-yellow-100">
                                                        {winner.name}
                                                    </p>
                                                    <p className="text-yellow-700 dark:text-yellow-300">{winner.party}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                                                        {winner.votes} votes
                                                    </p>
                                                    <p className="text-yellow-700 dark:text-yellow-300">
                                                        {winner.percentage}%
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })()}
                                </CardContent>
                            </Card>
                        )}

                        {/* Candidates Results */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Candidates Results</CardTitle>
                                <CardDescription>
                                    Vote count and percentage for each candidate
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedElection.candidates.map((candidate, index) => (
                                    <div key={candidate.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{candidate.name}</p>
                                                <p className="text-sm text-muted-foreground">{candidate.party}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{candidate.votes} votes</p>
                                                <p className="text-sm text-muted-foreground">{candidate.percentage}%</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' :
                                                    index === 1 ? 'bg-green-500' :
                                                        index === 2 ? 'bg-yellow-500' :
                                                            'bg-purple-500'
                                                    }`}
                                                style={{ width: `${candidate.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Voting Status */}
                        {selectedElection.status === "active" && (
                            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                                <CardContent className="pt-6">
                                    <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="font-medium">Live Election in Progress</span>
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                                        Results are updating in real-time as votes are cast.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
