import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/main-layout";

export default function ElectionDetailsSkeleton() {
	return (
		<MainLayout userType="admin" userName="Admin User" showSidebar={true}>
			<div className="space-y-4 sm:space-y-6">
				{/* Header Skeleton */}
				<div className="flex flex-col space-y-4 sm:space-y-2">
					<Skeleton className="h-10 w-32" />
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
						<div className="space-y-2 flex-1">
							<Skeleton className="h-8 w-64 mb-2" />
							<Skeleton className="h-4 w-full max-w-2xl" />
						</div>
						<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
						</div>
					</div>
				</div>

				{/* Stats Cards Skeleton */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardContent className="pt-4 sm:pt-6">
								<div className="text-center">
									<Skeleton className="h-8 w-16 mx-auto mb-2" />
									<Skeleton className="h-4 w-24 mx-auto" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Tabs Skeleton */}
				<div className="border-b">
					<div className="flex space-x-4 sm:space-x-8">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} className="h-10 w-24" />
						))}
					</div>
				</div>

				{/* Content Skeleton */}
				<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
						</CardHeader>
						<CardContent className="space-y-3 sm:space-y-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-32" />
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="space-y-2">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-10 w-full" />
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</MainLayout>
	);
}
