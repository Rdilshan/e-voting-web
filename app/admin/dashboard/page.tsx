import { Suspense } from "react";
import DashboardClient from "./dashboard-client";
import DashboardSkeleton from "./dashboard-skeleton";
import { getDashboardData } from "./action";

// Async component that fetches data - wrapped in Suspense
async function DashboardDataLoader() {
    const result = await getDashboardData();
    const dashboardData = result.success && result.data ? result.data : null;
    return <DashboardClient dashboardData={dashboardData} />;
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardDataLoader />
        </Suspense>
    );
}

