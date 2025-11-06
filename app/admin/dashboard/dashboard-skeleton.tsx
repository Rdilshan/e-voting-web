import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/main-layout";

export default function DashboardSkeleton() {
    return (
        <MainLayout userType="admin" userName="Admin User" showSidebar={true}>
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-4 rounded" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-3 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-7">
                    {/* Recent Elections Skeleton */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <Skeleton className="h-6 w-40 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 sm:space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-0"
                                    >
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <Skeleton className="w-2 h-2 rounded-full" />
                                            <div className="min-w-0">
                                                <Skeleton className="h-4 w-48 mb-2" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right ml-6 sm:ml-0">
                                            <Skeleton className="h-4 w-20 mb-2" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions Skeleton */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4">
                            <div className="grid gap-2 sm:gap-3">
                                {[1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center space-x-3 p-3 border rounded-lg"
                                    >
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Status Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-3 p-3 border rounded-lg"
                                >
                                    <Skeleton className="w-5 h-5 rounded-full" />
                                    <div className="min-w-0">
                                        <Skeleton className="h-4 w-32 mb-2" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
