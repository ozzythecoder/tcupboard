import { ThreadList, useAllThreadsQuery } from "#/features/threads";
import { createFileRoute } from "@tanstack/react-router";
import type { Pagination } from "#/types/apiResponse";
import { useState } from "react";

export const Route = createFileRoute("/threads/")({
    component: RouteComponent,
});

const INIT_PAGINATION: Pagination = {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
};

function RouteComponent() {
    const [pagination, setPagination] = useState<Pagination>(INIT_PAGINATION);
    const { data, error, isFetching } = useAllThreadsQuery(pagination);
    if (isFetching) return <div>Loading...</div>;

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page: pagination.page + page }));
    };

    if (error)
        return (
            <p>
                uh oh! I Fucked Up: <pre>{JSON.stringify(error)}</pre>
            </p>
        );

    if (!data) {
        return <div>nothin.</div>;
    }

    return (
        <div className="flex flex-col justify-between pb-12">
            <ThreadList threads={data.data} />
            <div className="grid grid-cols-3 place-items-center py-4 mx-auto w-full max-w-[60ch]">
                {data.pagination.page > 1 ? (
                    <button
                        className="btn preset-outlined"
                        type="button"
                        onClick={() => handlePageChange(-1)}
                    >
                        Previous
                    </button>
                ) : (
                    <div />
                )}
                <span>
                    Page {data.pagination.page} of {data.pagination.pages}
                </span>
                {data.pagination.page < data.pagination.pages ? (
                    <button
                        className="btn preset-outlined"
                        type="button"
                        onClick={() => handlePageChange(1)}
                    >
                        Next
                    </button>
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
}
