import { Suspense } from "react";
import ResultsClient from "./results-client";
import ResultsSkeleton from "./results-skeleton";
import { getAllElectionsResults } from "./action";

// Async component that fetches data - wrapped in Suspense
async function ResultsDataLoader() {
    const result = await getAllElectionsResults();
    const electionsData = result.success && result.data ? result.data : null;
    return <ResultsClient electionsData={electionsData} />;
}

export default function VotingResults() {
    return (
        <Suspense fallback={<ResultsSkeleton />}>
            <ResultsDataLoader />
        </Suspense>
    );
}
