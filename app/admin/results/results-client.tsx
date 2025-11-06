"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import {
	Download,
	RefreshCw,
	Vote,
	Trophy,
	ArrowLeft,
	Eye,
} from "lucide-react";
import { AdminElectionData, ElectionCandidate } from "@/app/lib/interface";

interface ResultsClientProps {
	electionsData: AdminElectionData[] | null;
}

export default function ResultsClient({
	electionsData,
}: ResultsClientProps) {
	const router = useRouter();
	const [selectedElection, setSelectedElection] =
		useState<AdminElectionData | null>(null);

	const [refreshing, setRefreshing] = useState(false);

	// Set initial selected election when data loads
	useEffect(() => {
		if (electionsData && electionsData.length > 0 && !selectedElection) {
			setSelectedElection(electionsData[0]);
		}
	}, [electionsData, selectedElection]);

	const handleRefresh = () => {
		setRefreshing(true);
		// Refresh will be handled by page reload
		setTimeout(() => {
			window.location.reload();
		}, 500);
	};

	const handleDownloadResults = () => {
		if (!selectedElection) return;

		// Generate CSV data
		const csvContent = [
			["Election Results", selectedElection.title],
			["Status", selectedElection.status],
			["Total Votes", selectedElection.totalVotes.toString()],
			["Total Voters", selectedElection.totalVoters.toString()],
			["Turnout", `${selectedElection.turnout}%`],
			[],
			["Candidate", "Party", "Votes", "Percentage"],
			...selectedElection.candidates.map((c: ElectionCandidate) => [
				c.name,
				c.party,
				c.votes.toString(),
				`${c.percentage}%`,
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		// Create blob and download
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${selectedElection.title.replace(/\s+/g, "_")}_results.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "text-green-600 bg-green-100";
			case "completed":
				return "text-blue-600 bg-blue-100";
			case "upcoming":
				return "text-gray-600 bg-gray-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getWinner = (candidates: ElectionCandidate[]) => {
		if (candidates.length === 0) return null;
		return candidates.reduce((prev, current) =>
			prev.votes > current.votes ? prev : current
		);
	};

	// Default empty data
	const elections = electionsData || [];
	const selected = selectedElection || null;

	return (
		<MainLayout userType="admin" userName="Admin User" showSidebar={true}>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Voting Results
						</h1>
						<p className="text-muted-foreground">
							View real-time results and analytics for all elections
						</p>
					</div>
					<Button
						variant="outline"
						onClick={() => router.push("/admin/dashboard")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				</div>

				{elections.length === 0 ? (
					<Card>
						<CardContent className="pt-6">
							<p className="text-center text-muted-foreground">
								No elections found
							</p>
						</CardContent>
					</Card>
				) : (
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
								{elections.map((election) => (
									<div
										key={election.id}
										className={`p-3 border rounded-lg cursor-pointer transition-colors ${selected?.id === election.id
											? "border-primary bg-primary/5"
											: "hover:bg-accent"
											}`}
										onClick={() => setSelectedElection(election)}
									>
										<div className="flex items-center justify-between">
											<div className="flex-1 min-w-0">
												<p className="font-medium text-sm truncate">
													{election.title}
												</p>
												<p className="text-xs text-muted-foreground">
													Ends:{" "}
													{new Date(
														election.endDate * 1000
													).toLocaleDateString()}
												</p>
											</div>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(
													election.status
												)}`}
											>
												{election.status}
											</span>
										</div>
										<div className="mt-2 text-xs text-muted-foreground">
											{election.totalVotes} / {election.totalVoters} votes (
											{election.turnout}%)
										</div>
									</div>
								))}
							</CardContent>
						</Card>

						{/* Results Display */}
						{selected && (
							<div className="lg:col-span-2 space-y-6">
								{/* Election Overview */}
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div>
												<CardTitle className="flex items-center space-x-2">
													<Vote className="h-5 w-5" />
													<span>{selected.title}</span>
												</CardTitle>
												<CardDescription>
													Election results and statistics
												</CardDescription>
											</div>
											<div className="flex flex-wrap gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={handleRefresh}
													disabled={refreshing}
												>
													<RefreshCw
														className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""
															}`}
													/>
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
												<Button variant="outline" size="sm" asChild>
													<a
														href={`/results/${selected.id}`}
														target="_blank"
														rel="noopener noreferrer"
													>
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
												<div className="text-2xl font-bold text-primary">
													{selected.totalVotes}
												</div>
												<div className="text-sm text-muted-foreground">
													Total Votes
												</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-primary">
													{selected.totalVoters}
												</div>
												<div className="text-sm text-muted-foreground">
													Eligible Voters
												</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-primary">
													{selected.turnout}%
												</div>
												<div className="text-sm text-muted-foreground">
													Turnout
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Winner Card (for completed elections) */}
								{selected.status === "completed" &&
									selected.totalVotes > 0 &&
									getWinner(selected.candidates) && (
										<Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
											<CardHeader>
												<CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
													<Trophy className="h-5 w-5" />
													<span>Winner</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												{(() => {
													const winner = getWinner(
														selected.candidates
													);
													if (!winner) return null;
													return (
														<div className="flex items-center justify-between">
															<div>
																<p className="font-bold text-lg text-yellow-900 dark:text-yellow-100">
																	{winner.name}
																</p>
																<p className="text-yellow-700 dark:text-yellow-300">
																	{winner.party}
																</p>
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
													);
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
										{selected.candidates.length > 0 ? (
											selected.candidates.map((candidate: ElectionCandidate, index: number) => (
												<div key={candidate.id} className="space-y-2">
													<div className="flex items-center justify-between">
														<div>
															<p className="font-medium">
																{candidate.name}
															</p>
															<p className="text-sm text-muted-foreground">
																{candidate.party}
															</p>
														</div>
														<div className="text-right">
															<p className="font-bold">
																{candidate.votes} votes
															</p>
															<p className="text-sm text-muted-foreground">
																{candidate.percentage}%
															</p>
														</div>
													</div>
													<div className="w-full bg-gray-200 rounded-full h-2">
														<div
															className={`h-2 rounded-full ${index === 0
																? "bg-blue-500"
																: index === 1
																	? "bg-green-500"
																	: index === 2
																		? "bg-yellow-500"
																		: "bg-purple-500"
																}`}
															style={{
																width: `${candidate.percentage}%`,
															}}
														/>
													</div>
												</div>
											))
										) : (
											<p className="text-sm text-muted-foreground">
												No candidates found
											</p>
										)}
									</CardContent>
								</Card>

								{/* Voting Status */}
								{selected.status === "active" && (
									<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
										<CardContent className="pt-6">
											<div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
												<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
												<span className="font-medium">
													Live Election in Progress
												</span>
											</div>
											<p className="text-sm text-green-700 dark:text-green-300 mt-2">
												Results are updating in real-time as votes are
												cast.
											</p>
										</CardContent>
									</Card>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</MainLayout>
	);
}
