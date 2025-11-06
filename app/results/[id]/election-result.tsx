"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Vote,
    BarChart3,
    ArrowLeft,
    CheckCircle,
    Clock,
    Users,
    RefreshCw
} from "lucide-react"
import { PublicElectionResultsProps } from "@/app/lib/interface"

export default function PublicElectionResults({ electionData }: PublicElectionResultsProps) {
    if (!electionData) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-6 sm:py-8">
                    <div className="max-w-2xl mx-auto text-center py-12">
                        <Vote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Election Not Found</h1>
                        <p className="text-muted-foreground mb-4">The election results you&apos;re looking for don&apos;t exist or are not public.</p>
                        <Button asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
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

    const turnoutRate = electionData.totalEligibleVoters > 0 ? (electionData.totalVotes / electionData.totalEligibleVoters) * 100 : 0

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Back to Home</span>
                                    <span className="sm:hidden">Back</span>
                                </Link>
                            </Button>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{electionData.title}</h1>
                                <div className="flex items-center justify-center space-x-2">
                                    {getStatusIcon(electionData.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(electionData.status)}`}>
                                        {electionData.status === 'active' ? 'Live Results' : electionData.status}
                                    </span>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">{electionData.description}</p>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                <p>Voting Period: {new Date(electionData.startDate).toLocaleDateString()} - {new Date(electionData.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Public Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-center">
                                    <div className="text-lg sm:text-2xl font-bold text-primary">{electionData.totalVotes}</div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">Total Votes</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-center">
                                    <div className="text-lg sm:text-2xl font-bold text-primary">{electionData.candidates.length}</div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">Candidates</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-2 sm:col-span-1">
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-center">
                                    <div className="text-lg sm:text-2xl font-bold text-primary">{turnoutRate.toFixed(1)}%</div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">Turnout</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Public Results */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl flex items-center space-x-2">
                                        <BarChart3 className="h-5 w-5" />
                                        <span>Election Results</span>
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {electionData.status === 'active' ? 'Live results - updates automatically' : 'Final results'}
                                    </CardDescription>
                                </div>
                                {electionData.status === 'active' && (
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Refresh
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6">
                            {electionData.candidates.map((candidate, index) => (
                                <div key={candidate.id} className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center space-x-2">
                                                {index === 0 && electionData.status === 'completed' && (
                                                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                                        <span className="text-yellow-600 dark:text-yellow-400 text-xs font-bold">1</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm sm:text-base truncate">{candidate.name}</p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">{candidate.party}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right flex-shrink-0">
                                            <p className="font-bold text-base sm:text-lg">{candidate.votes} votes</p>
                                            <p className="text-xs sm:text-sm text-muted-foreground">{candidate.percentage}%</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                                        <div
                                            className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${index === 0 ? 'bg-blue-500' :
                                                index === 1 ? 'bg-green-500' :
                                                    index === 2 ? 'bg-yellow-500' :
                                                        'bg-gray-400'
                                                }`}
                                            style={{ width: `${candidate.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Status Banner */}
                    {electionData.status === "active" && (
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

                    {electionData.status === "completed" && (
                        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-medium text-sm sm:text-base">Election Completed</span>
                                </div>
                                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-2">
                                    Final results are displayed above. Final turnout: {turnoutRate.toFixed(1)}%
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Public Access Note */}
                    <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                        <CardContent className="pt-4 sm:pt-6">
                            <div className="text-center space-y-2">
                                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium text-sm">Public Results</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    This page shows public election results. Detailed analytics are available to administrators.
                                </p>
                                <div className="pt-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/vote">
                                            <Vote className="mr-2 h-4 w-4" />
                                            Vote in Elections
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}
