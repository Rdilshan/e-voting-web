"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Vote,
    Users,
    UserCheck,
    BarChart3,
    TrendingUp,
    Calendar,
    AlertCircle,
    CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data - in real app this would come from API
const dashboardData = {
    totalElections: 12,
    activeElections: 3,
    totalVoters: 15420,
    totalCandidates: 48,
    totalVotes: 8934,
    voterTurnout: 58,
    recentElections: [
        { id: 1, title: "Presidential Election 2024", status: "active", votes: 3421, endDate: "2024-12-15" },
        { id: 2, title: "City Council Election", status: "completed", votes: 2156, endDate: "2024-11-30" },
        { id: 3, title: "School Board Election", status: "upcoming", votes: 0, endDate: "2024-12-20" },
    ]
}

export default function AdminDashboard() {
    return (
        <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Overview of your e-voting system
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
                            <Vote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.totalElections}</div>
                            <p className="text-xs text-muted-foreground">
                                {dashboardData.activeElections} currently active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registered Voters</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.totalVoters.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                +180 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.totalCandidates}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all elections
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.voterTurnout}%</div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last election
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-7">
                    {/* Recent Elections */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Recent Elections</CardTitle>
                            <CardDescription className="text-sm">
                                Overview of recent and upcoming elections
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 sm:space-y-4">
                                {dashboardData.recentElections.map((election) => (
                                    <div key={election.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-0">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className="flex items-center space-x-2">
                                                {election.status === "active" && (
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                                                )}
                                                {election.status === "completed" && (
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                )}
                                                {election.status === "upcoming" && (
                                                    <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm sm:text-base truncate">{election.title}</p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                                        Ends: {new Date(election.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right ml-6 sm:ml-0">
                                            <p className="font-medium text-sm sm:text-base">{election.votes.toLocaleString()} votes</p>
                                            <p className="text-xs sm:text-sm text-muted-foreground capitalize">{election.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                            <CardDescription className="text-sm">
                                Common administrative tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4">
                            <div className="grid gap-2 sm:gap-3">
                                <Button
                                    className="justify-start h-auto p-3 text-left"
                                    variant="outline"
                                    onClick={() => window.location.href = '/admin/create-election'}
                                >
                                    <Vote className="w-4 h-4 mr-3 flex-shrink-0" />
                                    <span className="text-sm font-medium">Create New Election</span>
                                </Button>

                                <Button
                                    className="justify-start h-auto p-3 text-left"
                                    variant="outline"
                                    onClick={() => window.location.href = '/admin/results'}
                                >
                                    <BarChart3 className="w-4 h-4 mr-3 flex-shrink-0" />
                                    <span className="text-sm font-medium">View Results</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">System Status</CardTitle>
                        <CardDescription className="text-sm">
                            Current system health and alerts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Blockchain Network</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Operational</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Voting System</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Online</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 border rounded-lg sm:col-span-2 lg:col-span-1">
                                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Database</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">High Load</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}

