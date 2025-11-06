import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/main-layout";

export default function ElectionsSkeleton() {
	return (
		<MainLayout userType="admin" userName="Admin User" showSidebar={true}>
			<div className="space-y-4 sm:space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
					<div>
						<Skeleton className="h-8 w-64 mb-2" />
						<Skeleton className="h-4 w-96" />
					</div>
					<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-40" />
					</div>
				</div>

				{/* Filters Skeleton */}
				<Card>
					<CardContent className="pt-4 sm:pt-6">
						<div className="flex flex-col space-y-4">
							<Skeleton className="h-10 w-full" />
							<div className="flex flex-wrap gap-2">
								{[1, 2, 3, 4].map((i) => (
									<Skeleton key={i} className="h-8 w-24" />
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Elections Grid Skeleton */}
				<div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Card key={i}>
							<CardHeader className="pb-3 sm:pb-6">
								<div className="flex items-start justify-between mb-2">
									<Skeleton className="h-6 w-20" />
									<div className="flex space-x-1">
										<Skeleton className="h-8 w-8" />
										<Skeleton className="h-8 w-8" />
									</div>
								</div>
								<Skeleton className="h-6 w-full mb-2" />
								<Skeleton className="h-4 w-full" />
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4 pt-0">
								<div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
									{[1, 2, 3].map((j) => (
										<div key={j}>
											<Skeleton className="h-6 w-12 mx-auto mb-1" />
											<Skeleton className="h-3 w-16 mx-auto" />
										</div>
									))}
								</div>
								<div className="space-y-1 sm:space-y-2">
									{[1, 2, 3].map((j) => (
										<div key={j} className="flex justify-between">
											<Skeleton className="h-3 w-16" />
											<Skeleton className="h-3 w-24" />
										</div>
									))}
								</div>
								<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
									<Skeleton className="h-9 w-full" />
									<Skeleton className="h-9 w-full" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</MainLayout>
	);
}
