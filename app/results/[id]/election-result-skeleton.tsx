import { Skeleton } from "@/components/ui/skeleton"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ElectionResultSkeleton() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                    {/* Header Skeleton */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-9 w-24 sm:w-32" />
                        </div>

                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                                <Skeleton className="h-8 w-64 sm:w-80 mx-auto" />
                                <Skeleton className="h-6 w-24 mx-auto" />
                            </div>
                            <Skeleton className="h-4 w-96 max-w-full mx-auto" />
                            <Skeleton className="h-3 w-48 mx-auto" />
                        </div>
                    </div>

                    {/* Stats Cards Skeleton */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-center space-y-2">
                                    <Skeleton className="h-8 w-16 mx-auto" />
                                    <Skeleton className="h-4 w-20 mx-auto" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-center space-y-2">
                                    <Skeleton className="h-8 w-16 mx-auto" />
                                    <Skeleton className="h-4 w-20 mx-auto" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-2 sm:col-span-1">
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="text-center space-y-2">
                                    <Skeleton className="h-8 w-16 mx-auto" />
                                    <Skeleton className="h-4 w-20 mx-auto" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                                <Skeleton className="h-9 w-24 sm:w-auto" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6">
                            {/* Candidate skeletons */}
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-32 sm:w-48" />
                                                    <Skeleton className="h-3 w-24 sm:w-36" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right flex-shrink-0 space-y-1">
                                            <Skeleton className="h-5 w-20 sm:w-24" />
                                            <Skeleton className="h-4 w-16 sm:w-20" />
                                        </div>
                                    </div>
                                    <Skeleton className="w-full h-3 rounded-full" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Status Banner Skeleton */}
                    <Card>
                        <CardContent className="pt-4 sm:pt-6 space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>

                    {/* Public Access Note Skeleton */}
                    <Card>
                        <CardContent className="pt-4 sm:pt-6">
                            <div className="text-center space-y-2">
                                <Skeleton className="h-4 w-32 mx-auto" />
                                <Skeleton className="h-3 w-64 mx-auto" />
                                <div className="pt-2">
                                    <Skeleton className="h-9 w-40 mx-auto" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}

