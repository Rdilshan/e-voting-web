"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Vote,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    History,
    User
} from "lucide-react"

// Mock data - in real app this would come from API
const userData = {
    name: "John Doe",
    voterId: "VTR-2024-001234",
    availableElections: [
        {
            id: 1,
            title: "Presidential Election 2024",
            description: "Choose the next President of the United States",
            startDate: "2024-12-01",
            endDate: "2024-12-15",
            status: "active",
            hasVoted: false,
            candidates: 4
        },
        {
            id: 2,
            title: "City Council Election",
            description: "Select your local city council representatives",
            startDate: "2024-11-15",
            endDate: "2024-12-10",
            status: "active",
            hasVoted: true,
            candidates: 8
        },
        {
            id: 3,
            title: "School Board Election",
            description: "Vote for school board members in your district",
            startDate: "2024-12-20",
            endDate: "2025-01-05",
            status: "upcoming",
            hasVoted: false,
            candidates: 6
        }
    ],
    votingHistory: [
        {
            id: 1,
            title: "State Governor Election",
            date: "2024-10-15",
            status: "completed"
        },
        {
            id: 2,
            title: "Local Referendum",
            date: "2024-09-20",
            status: "completed"
        }
    ]
}

export default function VoterDashboard() {
    const activeElections = userData.availableElections.filter(e => e.status === "active")
    const upcomingElections = userData.availableElections.filter(e => e.status === "upcoming")

    return (
        <MainLayout userType="voter" userName={userData.name} showSidebar={true}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userData.name}</h1>
                    <p className="text-muted-foreground">
                        Voter ID: {userData.voterId}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
                            <Vote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeElections.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Available to vote
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {userData.availableElections.filter(e => e.hasVoted).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This election cycle
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{upcomingElections.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Elections scheduled
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Elections */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Elections</CardTitle>
                        <CardDescription>
                            Elections you can participate in right now
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeElections.length === 0 ? (
                            <div className="text-center py-8">
                                <Vote className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No active elections</h3>
                                <p className="text-muted-foreground">Check back later for new elections.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeElections.map((election) => (
                                    <div key={election.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold">{election.title}</h3>
                                                    {election.hasVoted ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{election.description}</p>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Ends: {new Date(election.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <User className="w-4 h-4" />
                                                        <span>{election.candidates} candidates</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {election.hasVoted ? (
                                                    <Button variant="outline" disabled>
                                                        Vote Cast
                                                    </Button>
                                                ) : (
                                                    <Button asChild>
                                                        <Link href={`/vote/${election.id}`}>
                                                            Vote Now
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/elections/${election.id}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Upcoming Elections */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Elections</CardTitle>
                            <CardDescription>
                                Elections scheduled for the future
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingElections.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No upcoming elections scheduled.</p>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingElections.map((election) => (
                                        <div key={election.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium text-sm">{election.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Starts: {new Date(election.startDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Voting History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Voting History</CardTitle>
                            <CardDescription>
                                Your recent election participation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {userData.votingHistory.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No voting history available.</p>
                            ) : (
                                <div className="space-y-3">
                                    {userData.votingHistory.map((vote) => (
                                        <div key={vote.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium text-sm">{vote.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(vote.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        </div>
                                    ))}
                                    <Button variant="ghost" size="sm" className="w-full" asChild>
                                        <Link href="/history">
                                            <History className="w-4 h-4 mr-2" />
                                            View Full History
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}

