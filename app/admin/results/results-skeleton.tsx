import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/main-layout";

export default function ResultsSkeleton() {
	return (
		<MainLayout userType="admin" userName="Admin User" showSidebar={true}>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<Skeleton className="h-8 w-64 mb-2" />
						<Skeleton className="h-4 w-96" />
					</div>
					<Skeleton className="h-10 w-24" />
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Elections List Skeleton */}
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32 mb-2" />
							<Skeleton className="h-4 w-48" />
						</CardHeader>
						<CardContent className="space-y-2">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="p-3 border rounded-lg space-y-2"
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Skeleton className="h-4 w-full mb-2" />
											<Skeleton className="h-3 w-32" />
										</div>
										<Skeleton className="h-6 w-20 rounded-full" />
									</div>
									<Skeleton className="h-3 w-40" />
								</div>
							))}
						</CardContent>
					</Card>

					{/* Results Display Skeleton */}
					<div className="lg:col-span-2 space-y-6">
						{/* Election Overview Skeleton */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Skeleton className="h-6 w-64 mb-2" />
										<Skeleton className="h-4 w-48" />
									</div>
									<div className="flex space-x-2">
										<Skeleton className="h-8 w-24" />
										<Skeleton className="h-8 w-28" />
										<Skeleton className="h-8 w-32" />
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-3 gap-4">
									{[1, 2, 3].map((i) => (
										<div key={i} className="text-center space-y-2">
											<Skeleton className="h-8 w-16 mx-auto" />
											<Skeleton className="h-4 w-24 mx-auto" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Candidates Results Skeleton */}
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-48 mb-2" />
								<Skeleton className="h-4 w-64" />
							</CardHeader>
							<CardContent className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<Skeleton className="h-4 w-32 mb-2" />
												<Skeleton className="h-3 w-24" />
											</div>
											<div className="text-right">
												<Skeleton className="h-4 w-20 mb-2" />
												<Skeleton className="h-3 w-16" />
											</div>
										</div>
										<Skeleton className="w-full h-2 rounded-full" />
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
