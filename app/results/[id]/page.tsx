import { Suspense } from "react";
import PublicElectionResults from "./election-result";
import ElectionResultSkeleton from "./election-result-skeleton";
import { getElectionResults } from "./action";
import {
    ElectionResultsResponse,
    TransformedElectionData,
    TransformedCandidate,
    CandidateDataArray,
} from "@/app/lib/interface";

interface PageParams {
    params: {
        id: Promise<string>;
    }
}

// Transform contract data to a format suitable for the component
function transformElectionData(results: ElectionResultsResponse, electionId: number): TransformedElectionData | null {
    if (!results || !results.success || !results.results) {
        return null;
    }

    const [electionData, candidatesData, totalEligibleVoters] = results.results;

    // Election data: [electionTitle, description, startDate, endDate, totalVotes, exists]
    const election = {
        title: electionData[0] || "",
        description: electionData[1] || "",
        startDate: Number(electionData[2]) || 0,
        endDate: Number(electionData[3]) || 0,
        totalVotes: Number(electionData[4]) || 0,
        exists: electionData[5] || false,
    };

    // Determine status based on dates
    const now = Math.floor(Date.now() / 1000);
    let status: "active" | "completed" | "upcoming";
    if (now < election.startDate) {
        status = "upcoming";
    } else if (now > election.endDate) {
        status = "completed";
    } else {
        status = "active";
    }

    // Transform candidates: [[name, nic, party, voteCount], ...]
    const candidates: TransformedCandidate[] = candidatesData.map((candidate: CandidateDataArray, index: number) => {
        const voteCount = Number(candidate[3] || 0);
        const totalVotes = election.totalVotes || 1; // Avoid division by zero
        const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

        return {
            id: index,
            name: candidate[0] || "",
            nic: candidate[1] || "",
            party: candidate[2] || "Independent",
            votes: voteCount,
            percentage: parseFloat(percentage.toFixed(1)),
        };
    });

    return {
        id: electionId,
        title: election.title,
        description: election.description,
        status: status,
        startDate: new Date(election.startDate * 1000).toISOString(),
        endDate: new Date(election.endDate * 1000).toISOString(),
        totalVotes: election.totalVotes,
        totalEligibleVoters: Number(totalEligibleVoters) || 0,
        candidates: candidates.sort((a, b) => b.votes - a.votes),
    };
}

export default async function page({ params }: PageParams) {
    const { id } = await params;
    const electionId = Number(id);
    const results = await getElectionResults(electionId);
    const electionData = transformElectionData(results, electionId);

    return (
        <>
            <Suspense fallback={<ElectionResultSkeleton />}>
                <PublicElectionResults electionData={electionData} />
            </Suspense>
        </>
    );
}
