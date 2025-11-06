import { Suspense } from "react";
import ElectionDetailsClient from "./election-details-client";
import ElectionDetailsSkeleton from "./election-details-skeleton";
import { getElectionDetails } from "./action";

interface PageParams {
    params: {
        id: Promise<string>;
    };
}

// Async component that fetches data - wrapped in Suspense
async function ElectionDetailsDataLoader({ electionId }: { electionId: number }) {
    const result = await getElectionDetails(electionId);
    const electionData = result.success && result.data ? result.data : null;
    return <ElectionDetailsClient electionData={electionData} />;
}

export default async function ElectionDetails({ params }: PageParams) {
    const { id } = await params;
    const electionId = Number(id);

    if (isNaN(electionId)) {
        return (
            <ElectionDetailsClient electionData={null} />
        );
    }

    return (
        <Suspense fallback={<ElectionDetailsSkeleton />}>
            <ElectionDetailsDataLoader electionId={electionId} />
        </Suspense>
    );
}