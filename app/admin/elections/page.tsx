import { Suspense } from "react";
import ElectionsClient from "./elections-client";
import ElectionsSkeleton from "./elections-skeleton";
import { getAllElections } from "./action";

// Async component that fetches data - wrapped in Suspense
async function ElectionsDataLoader() {
    const result = await getAllElections();
    const electionsData = result.success && result.data ? result.data : null;
    return <ElectionsClient electionsData={electionsData} />;
}

export default function ElectionsManagement() {
    return (
        <Suspense fallback={<ElectionsSkeleton />}>
            <ElectionsDataLoader />
        </Suspense>
    );
}
