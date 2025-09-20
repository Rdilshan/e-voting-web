"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Vote,
    User,
    Calendar,
    Clock,
    CheckCircle,
    ArrowLeft,
    AlertTriangle
} from "lucide-react"

// Mock data - in real app this would come from API
const electionData = {
    "1": {
        id: 1,
        title: "Presidential Election 2024",
        description: "Choose the next President of the United States",
        startDate: "2024-12-01",
        endDate: "2024-12-15",
        status: "active",
        instructions: "Select one candidate for President. Your vote is secret and secure.",
        positions: [
            {
                id: 1,
                title: "President",
                description: "Chief Executive of the United States",
                maxSelections: 1,
                candidates: [
                    {
                        id: 1,
                        name: "Alice Johnson",
                        party: "Democratic Party",
                        bio: "Former Senator with 20 years of public service experience.",
                        image: "/placeholder-candidate.jpg"
                    },
                    {
                        id: 2,
                        name: "Bob Smith",
                        party: "Republican Party",
                        bio: "Business leader and former Governor with proven leadership.",
                        image: "/placeholder-candidate.jpg"
                    },
                    {
                        id: 3,
                        name: "Carol Davis",
                        party: "Independent",
                        bio: "Environmental scientist advocating for sustainable policies.",
                        image: "/placeholder-candidate.jpg"
                    },
                    {
                        id: 4,
                        name: "David Wilson",
                        party: "Green Party",
                        bio: "Community organizer focused on social justice and equality.",
                        image: "/placeholder-candidate.jpg"
                    }
                ]
            }
        ]
    }
}

export default function VotingInterface() {
    const params = useParams()
    const router = useRouter()
    const electionId = params.id as string
    const election = electionData[electionId as keyof typeof electionData]

    const [selectedCandidates, setSelectedCandidates] = useState<{ [positionId: number]: number[] }>({})
    const [showConfirmation, setShowConfirmation] = useState(false)

    if (!election) {
        return (
            <MainLayout userType="voter" userName="John Doe" showSidebar={true}>
                <div className="text-center py-12">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Election Not Found</h1>
                    <p className="text-muted-foreground mb-4">The election you're looking for doesn't exist.</p>
                    <Button onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </MainLayout>
        )
    }

    const handleCandidateSelect = (positionId: number, candidateId: number, maxSelections: number) => {
        setSelectedCandidates(prev => {
            const currentSelections = prev[positionId] || []

            if (currentSelections.includes(candidateId)) {
                // Remove selection
                return {
                    ...prev,
                    [positionId]: currentSelections.filter(id => id !== candidateId)
                }
            } else {
                // Add selection
                if (currentSelections.length >= maxSelections) {
                    // Replace selection if max reached
                    return {
                        ...prev,
                        [positionId]: [candidateId]
                    }
                } else {
                    // Add to selections
                    return {
                        ...prev,
                        [positionId]: [...currentSelections, candidateId]
                    }
                }
            }
        })
    }

    const handleSubmitVote = () => {
        setShowConfirmation(true)
    }

    const confirmVote = () => {
        // TODO: Submit vote to blockchain/API
        console.log("Submitting vote:", selectedCandidates)
        router.push(`/vote/${electionId}/confirmation`)
    }

    const getTotalSelections = () => {
        return Object.values(selectedCandidates).reduce((total, selections) => total + selections.length, 0)
    }

    if (showConfirmation) {
        return (
            <MainLayout userType="voter" userName="John Doe" showSidebar={true}>
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                <span>Confirm Your Vote</span>
                            </CardTitle>
                            <CardDescription>
                                Please review your selections before submitting. This action cannot be undone.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">{election.title}</h3>
                                {election.positions.map(position => {
                                    const selections = selectedCandidates[position.id] || []
                                    return (
                                        <div key={position.id} className="mb-3">
                                            <p className="font-medium">{position.title}:</p>
                                            {selections.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No selection made</p>
                                            ) : (
                                                selections.map(candidateId => {
                                                    const candidate = position.candidates.find(c => c.id === candidateId)
                                                    return (
                                                        <p key={candidateId} className="text-sm">
                                                            • {candidate?.name} ({candidate?.party})
                                                        </p>
                                                    )
                                                })
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1"
                                >
                                    Review Selections
                                </Button>
                                <Button
                                    onClick={confirmVote}
                                    className="flex-1"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Submit Vote
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout userType="voter" userName="John Doe" showSidebar={true}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Election Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center space-x-2">
                                    <Vote className="h-5 w-5" />
                                    <span>{election.title}</span>
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    {election.description}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" onClick={() => router.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-4">
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Ends: {new Date(election.endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Time remaining: 5 days</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                            <p className="text-sm">{election.instructions}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Voting Positions */}
                {election.positions.map(position => (
                    <Card key={position.id}>
                        <CardHeader>
                            <CardTitle>{position.title}</CardTitle>
                            <CardDescription>
                                {position.description} • Select up to {position.maxSelections} candidate{position.maxSelections > 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {position.candidates.map(candidate => {
                                    const isSelected = selectedCandidates[position.id]?.includes(candidate.id) || false

                                    return (
                                        <div
                                            key={candidate.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                            onClick={() => handleCandidateSelect(position.id, candidate.id, position.maxSelections)}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold">{candidate.name}</h3>
                                                        {isSelected && (
                                                            <CheckCircle className="h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-primary font-medium">{candidate.party}</p>
                                                    <p className="text-sm text-muted-foreground mt-2">{candidate.bio}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Submit Section */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">
                                    {getTotalSelections()} selection{getTotalSelections() !== 1 ? 's' : ''} made
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Review your choices and submit your vote
                                </p>
                            </div>
                            <Button
                                onClick={handleSubmitVote}
                                disabled={getTotalSelections() === 0}
                                size="lg"
                            >
                                <Vote className="mr-2 h-4 w-4" />
                                Cast Vote
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}

