"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import {
	Vote,
	Users,
	UserCheck,
	TrendingUp,
	Calendar,
	CheckCircle,
	BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardData } from "./action";

interface DashboardClientProps {
	dashboardData: DashboardData | null;
}

export default function DashboardClient({ dashboardData }: DashboardClientProps) {
	const router = useRouter();

	// Default data if fetch fails
	const data = dashboardData || {
		totalElections: 0,
		activeElections: 0,
		totalVoters: 0,
		totalCandidates: 0,
		totalVotes: 0,
		voterTurnout: 0,
		recentElections: [],
	};

	return (
		<MainLayout userType="admin" userName="Admin User" showSidebar={true}>
			<div className="space-y-4 sm:space-y-6">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
						Dashboard
					</h1>
					<p className="text-muted-foreground text-sm sm:text-base">
						Overview of your e-voting system
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Elections
							</CardTitle>
							<Vote className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{data.totalElections}
							</div>
							<p className="text-xs text-muted-foreground">
								{data.activeElections} currently active
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Registered Voters
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{data.totalVoters.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground">
								Across all elections
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Candidates
							</CardTitle>
							<UserCheck className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{data.totalCandidates}
							</div>
							<p className="text-xs text-muted-foreground">
								Across all elections
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Voter Turnout
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{data.voterTurnout}%
							</div>
							<p className="text-xs text-muted-foreground">
								Completed elections average
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 lg:grid-cols-7">
					{/* Recent Elections */}
					<Card className="lg:col-span-4">
						<CardHeader>
							<CardTitle className="text-lg sm:text-xl">
								Recent Elections
							</CardTitle>
							<CardDescription className="text-sm">
								Overview of recent and upcoming elections
							</CardDescription>
						</CardHeader>
						<CardContent>
							{data.recentElections.length > 0 ? (
								<div className="space-y-3 sm:space-y-4">
									{data.recentElections.map((election) => (
										<div
											key={election.id}
											className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-0"
										>
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
														<p className="font-medium text-sm sm:text-base truncate">
															{election.title}
														</p>
														<p className="text-xs sm:text-sm text-muted-foreground">
															Ends:{" "}
															{new Date(
																election.endDate * 1000
															).toLocaleDateString()}
														</p>
													</div>
												</div>
											</div>
											<div className="text-left sm:text-right ml-6 sm:ml-0">
												<p className="font-medium text-sm sm:text-base">
													{election.totalVotes.toLocaleString()}{" "}
													votes
												</p>
												<p className="text-xs sm:text-sm text-muted-foreground capitalize">
													{election.status}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									No elections found
								</p>
							)}
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card className="lg:col-span-3">
						<CardHeader>
							<CardTitle className="text-lg sm:text-xl">
								Quick Actions
							</CardTitle>
							<CardDescription className="text-sm">
								Common administrative tasks
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 sm:space-y-4">
							<div className="grid gap-2 sm:gap-3">
								<Button
									className="justify-start h-auto p-3 text-left"
									variant="outline"
									onClick={() => router.push("/admin/create-election")}
								>
									<Vote className="w-4 h-4 mr-3 flex-shrink-0" />
									<span className="text-sm font-medium">
										Create New Election
									</span>
								</Button>

								<Button
									className="justify-start h-auto p-3 text-left"
									variant="outline"
									onClick={() => router.push("/admin/results")}
								>
									<BarChart3 className="w-4 h-4 mr-3 flex-shrink-0" />
									<span className="text-sm font-medium">
										View Results
									</span>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

			</div>
		</MainLayout>
	);
}
