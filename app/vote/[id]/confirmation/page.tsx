"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    CheckCircle,
    Download,
    Share,
    Home,
    Vote,
    Calendar,
    Hash,
    Shield
} from "lucide-react"

// Mock data - in real app this would come from API
const confirmationData = {
    "1": {
        electionTitle: "Presidential Election 2024",
        voteId: "VOTE-2024-ABC123XYZ",
        blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        timestamp: "2024-12-10T14:30:00Z",
        selections: [
            {
                position: "President",
                candidate: "Alice Johnson",
                party: "Democratic Party"
            }
        ]
    }
}

export default function VoteConfirmation() {
    const params = useParams()
    const router = useRouter()
    const electionId = params.id as string
    const confirmation = confirmationData[electionId as keyof typeof confirmationData]

    if (!confirmation) {
        return (
            <MainLayout userType="voter" userName="John Doe" showSidebar={true}>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-2">Confirmation Not Found</h1>
                    <p className="text-muted-foreground mb-4">Unable to load vote confirmation.</p>
                    <Button onClick={() => router.push("/dashboard")}>
                        Return to Dashboard
                    </Button>
                </div>
            </MainLayout>
        )
    }

    const handleDownloadReceipt = () => {
        // TODO: Generate and download PDF receipt
        console.log("Downloading receipt for vote:", confirmation.voteId)
    }

    const handleShareReceipt = () => {
        // TODO: Share receipt (copy link or social share)
        navigator.clipboard.writeText(`Vote confirmed: ${confirmation.voteId}`)
        alert("Vote ID copied to clipboard!")
    }

    return (
        <MainLayout userType="voter" userName="John Doe" showSidebar={true}>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Success Header */}
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                            Vote Successfully Cast!
                        </CardTitle>
                        <CardDescription>
                            Your vote has been securely recorded on the blockchain
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Vote Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Vote className="h-5 w-5" />
                            <span>Vote Receipt</span>
                        </CardTitle>
                        <CardDescription>
                            Keep this information for your records
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Election Info */}
                        <div className="grid gap-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm font-medium">Election:</span>
                                <span className="text-sm">{confirmation.electionTitle}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm font-medium">Vote ID:</span>
                                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                    {confirmation.voteId}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm font-medium">Timestamp:</span>
                                <span className="text-sm">
                                    {new Date(confirmation.timestamp).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Selections */}
                        <div className="space-y-3">
                            <h3 className="font-medium">Your Selections:</h3>
                            {confirmation.selections.map((selection, index) => (
                                <div key={index} className="bg-muted p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{selection.position}</p>
                                            <p className="text-sm text-muted-foreground">{selection.candidate}</p>
                                            <p className="text-xs text-muted-foreground">{selection.party}</p>
                                        </div>
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Blockchain Info */}
                        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    Blockchain Verification
                                </span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Hash className="h-4 w-4 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        Transaction Hash:
                                    </p>
                                    <p className="text-xs font-mono text-blue-800 dark:text-blue-300 break-all">
                                        {confirmation.blockchainHash}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-3 md:grid-cols-2">
                            <Button variant="outline" onClick={handleDownloadReceipt}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                            </Button>
                            <Button variant="outline" onClick={handleShareReceipt}>
                                <Share className="mr-2 h-4 w-4" />
                                Share Receipt
                            </Button>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                            <Button className="w-full" asChild>
                                <Link href="/dashboard">
                                    <Home className="mr-2 h-4 w-4" />
                                    Return to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Important Notes */}
                <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="pt-6">
                        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                            Important Information:
                        </h3>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                            <li>• Your vote is anonymous and cannot be traced back to you</li>
                            <li>• This receipt proves you voted but not who you voted for</li>
                            <li>• Keep your Vote ID for verification purposes</li>
                            <li>• You cannot change your vote once submitted</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}

