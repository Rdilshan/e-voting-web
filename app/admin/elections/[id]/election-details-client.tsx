"use client";

import {
	ElectionDetailsData
} from "@/app/lib/interface";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ArrowLeft,
	BarChart3,
	CheckCircle,
	Clock,
	Download,
	Eye,
	RefreshCw,
	Trash2,
	UserCheck,
	Users,
	Vote,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ElectionDetailsClientProps {
	electionData: ElectionDetailsData | null;
}

export default function ElectionDetailsClient({
	electionData,
}: ElectionDetailsClientProps) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<
		"overview" | "candidates" | "voters" | "results"
	>("overview");

	if (!electionData) {
		return (
			<MainLayout userType="admin" userName="Admin User" showSidebar={true}>
				<div className="text-center py-12">
					<Vote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
					<h1 className="text-2xl font-bold mb-2">Election Not Found</h1>
					<p className="text-muted-foreground mb-4">
						The election you&apos;re looking for doesn&apos;t exist.
					</p>
					<Button asChild>
						<Link href="/admin/elections">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Elections
						</Link>
					</Button>
				</div>
			</MainLayout>
		);
	}

	const election = electionData;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "completed":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
			case "upcoming":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "active":
				return (
					<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
				);
			case "completed":
				return <CheckCircle className="w-4 h-4 text-blue-500" />;
			case "upcoming":
				return <Clock className="w-4 h-4 text-yellow-500" />;
			default:
				return <Clock className="w-4 h-4 text-gray-500" />;
		}
	};

	const votedCount = election.voters.filter((v) => v.hasVoted).length;
	const turnoutRate =
		election.totalVoters > 0
			? (votedCount / election.totalVoters) * 100
			: 0;

	const handleDeleteElection = () => {
		if (
			confirm(
				"Are you sure you want to delete this election? This action cannot be undone."
			)
		) {
			// TODO: Delete election from backend/contract
			console.log("Deleting election:", election.id);
			router.push("/admin/elections");
		}
	};

	const handleExportData = () => {
		// Generate CSV data
		const csvContent = [
			["Election Details", election.title],
			["Status", election.status],
			["Total Votes", election.totalVotes.toString()],
			["Total Voters", election.totalVoters.toString()],
			["Turnout", `${election.turnout}%`],
			[],
			["Candidates", ""],
			["Candidate", "Party", "Votes", "Percentage"],
			...election.candidates.map((c) => [
				c.name,
				c.party,
				c.votes.toString(),
				`${c.percentage}%`,
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${election.title.replace(/\s+/g, "_")}_details.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	};

	const handleRefresh = () => {
		window.location.reload();
	};

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
									<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">
										{election.title}
									</h1>
								</div>
								<span
									className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
										election.status
									)} self-start`}
								>
									{election.status}
								</span>
							</div>
							<p className="text-muted-foreground text-sm sm:text-base">
								{election.description}
							</p>
						</div>
						<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
							<Button
								variant="outline"
								onClick={handleExportData}
								className="w-full sm:w-auto"
							>
								<Download className="mr-2 h-4 w-4" />
								Export
							</Button>
							<Button
								variant="destructive"
								onClick={handleDeleteElection}
								className="w-full sm:w-auto"
							>
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
								<div className="text-lg sm:text-2xl font-bold text-primary">
									{election.candidates.length}
								</div>
								<div className="text-xs sm:text-sm text-muted-foreground">
									Candidates
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-4 sm:pt-6">
							<div className="text-center">
								<div className="text-lg sm:text-2xl font-bold text-primary">
									{election.totalVoters}
								</div>
								<div className="text-xs sm:text-sm text-muted-foreground">
									Eligible Voters
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-4 sm:pt-6">
							<div className="text-center">
								<div className="text-lg sm:text-2xl font-bold text-primary">
									{votedCount}
								</div>
								<div className="text-xs sm:text-sm text-muted-foreground">
									Votes Cast
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-4 sm:pt-6">
							<div className="text-center">
								<div className="text-lg sm:text-2xl font-bold text-primary">
									{turnoutRate.toFixed(1)}%
								</div>
								<div className="text-xs sm:text-sm text-muted-foreground">
									Turnout Rate
								</div>
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
							<span className="hidden sm:inline">
								Candidates ({election.candidates.length})
							</span>
							<span className="sm:hidden">Candidates</span>
						</button>
						<button
							onClick={() => setActiveTab("voters")}
							className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "voters"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
								}`}
						>
							<span className="hidden sm:inline">
								Voters ({election.totalVoters})
							</span>
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
								<CardTitle className="text-lg sm:text-xl">
									Election Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
									<div>
										<span className="font-medium">Start Date:</span>
										<div className="text-muted-foreground text-xs sm:text-sm">
											{new Date(
												election.startDate * 1000
											).toLocaleString()}
										</div>
									</div>
									<div>
										<span className="font-medium">End Date:</span>
										<div className="text-muted-foreground text-xs sm:text-sm">
											{new Date(
												election.endDate * 1000
											).toLocaleString()}
										</div>
									</div>
									<div>
										<span className="font-medium">Total Votes:</span>
										<div className="text-muted-foreground text-xs sm:text-sm">
											{election.totalVotes}
										</div>
									</div>
									<div>
										<span className="font-medium">Voter Turnout:</span>
										<div className="text-muted-foreground text-xs sm:text-sm">
											{election.turnout}%
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									Quick Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<Button className="w-full justify-start" variant="outline" asChild>
									<Link href="/admin/results">
										<BarChart3 className="mr-2 h-4 w-4" />
										View Detailed Results
									</Link>
								</Button>
								<Button className="w-full justify-start" variant="outline" asChild>
									<a
										href={`/results/${election.id}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Eye className="mr-2 h-4 w-4" />
										Public Results Page
									</a>
								</Button>
								<Button
									className="w-full justify-start"
									variant="outline"
									onClick={handleExportData}
								>
									<Download className="mr-2 h-4 w-4" />
									Export Data
								</Button>
							</CardContent>
						</Card>
					</div>
				)}

				{activeTab === "candidates" && (
					<div className="space-y-3 sm:space-y-4">
						{election.candidates.length > 0 ? (
							election.candidates.map((candidate, index) => (
								<Card key={candidate.id}>
									<CardContent className="pt-4 sm:pt-6">
										<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
											<div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
												<div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
													<UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
														<h3 className="font-semibold text-base sm:text-lg truncate">
															{candidate.name}
														</h3>
														<span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium self-start">
															{candidate.party}
														</span>
													</div>
													<p className="text-xs sm:text-sm text-muted-foreground">
														NIC: {candidate.nic}
													</p>
												</div>
											</div>
											<div className="text-center sm:text-right flex-shrink-0">
												<div className="text-xl sm:text-2xl font-bold text-primary">
													{candidate.votes}
												</div>
												<div className="text-xs sm:text-sm text-muted-foreground">
													votes ({candidate.percentage}%)
												</div>
												<div className="w-full sm:w-24 bg-gray-200 rounded-full h-2 mt-2">
													<div
														className={`h-2 rounded-full ${index === 0
																? "bg-blue-500"
																: index === 1
																	? "bg-green-500"
																	: "bg-yellow-500"
															}`}
														style={{ width: `${candidate.percentage}%` }}
													/>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						) : (
							<Card>
								<CardContent className="pt-6 text-center">
									<p className="text-muted-foreground">No candidates found</p>
								</CardContent>
							</Card>
						)}
					</div>
				)}

				{activeTab === "voters" && (
					<div className="space-y-3 sm:space-y-4">
						{election.voters.length > 0 ? (
							election.voters.map((voter, index) => (
								<Card key={index}>
									<CardContent className="pt-4 sm:pt-6">
										<div className="flex items-start space-x-3 sm:space-x-4">
											<div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
												<Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
													<h3 className="font-medium text-sm sm:text-base">
														Voter: {voter.nic}
													</h3>
													<div className="flex flex-wrap gap-1 sm:gap-2">
														{voter.hasVoted && (
															<span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium flex items-center space-x-1">
																<CheckCircle className="h-3 w-3" />
																<span>Voted</span>
															</span>
														)}
														{!voter.hasVoted && (
															<span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-full text-xs font-medium">
																Not Voted
															</span>
														)}
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						) : (
							<Card>
								<CardContent className="pt-6 text-center">
									<p className="text-muted-foreground">
										Voter details are not available. Total eligible voters:{" "}
										{election.totalVoters}
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				)}

				{activeTab === "results" && (
					<div className="space-y-4 sm:space-y-6">
						<Card>
							<CardHeader>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
									<div>
										<CardTitle className="text-lg sm:text-xl">
											Live Results
										</CardTitle>
										<CardDescription className="text-sm">
											Real-time voting results
										</CardDescription>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={handleRefresh}
										className="w-full sm:w-auto"
									>
										<RefreshCw className="mr-2 h-4 w-4" />
										Refresh
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								{election.candidates.length > 0 ? (
									election.candidates.map((candidate, index) => (
										<div key={candidate.id} className="space-y-2">
											<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
												<div className="min-w-0 flex-1">
													<p className="font-medium text-sm sm:text-base truncate">
														{candidate.name}
													</p>
													<p className="text-xs sm:text-sm text-muted-foreground">
														{candidate.party}
													</p>
												</div>
												<div className="text-left sm:text-right flex-shrink-0">
													<p className="font-bold text-base sm:text-lg">
														{candidate.votes} votes
													</p>
													<p className="text-xs sm:text-sm text-muted-foreground">
														{candidate.percentage}%
													</p>
												</div>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
												<div
													className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${index === 0
															? "bg-blue-500"
															: index === 1
																? "bg-green-500"
																: "bg-yellow-500"
														}`}
													style={{ width: `${candidate.percentage}%` }}
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

						{election.status === "active" && (
							<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
								<CardContent className="pt-4 sm:pt-6">
									<div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
										<span className="font-medium text-sm sm:text-base">
											Live Election in Progress
										</span>
									</div>
									<p className="text-xs sm:text-sm text-green-700 dark:text-green-300 mt-2">
										Results are updating in real-time as votes are cast.
										Current turnout: {turnoutRate.toFixed(1)}%
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				)}
			</div>
		</MainLayout>
	);
}
