import { ThreadList, threadQueries } from "#/features/threads";
import { createFileRoute } from "@tanstack/react-router";
import type { Pagination } from "#/types/apiResponse";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProtectedApi } from "#/config/api";

const INIT_PAGINATION: Pagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
};

export const Route = createFileRoute("/threads/")({
    beforeLoad: ({ context }) => {
        return {
            authApi: getProtectedApi(context.auth.user.sub as string),
        };
    },
    component: RouteComponent,
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(threadQueries.all(INIT_PAGINATION, context.authApi));
    },
});


function RouteComponent() {
    const { authApi } = Route.useRouteContext();
    const [pagination, setPagination] = useState<Pagination>(INIT_PAGINATION);
    const { data, error, isFetching } = useQuery(threadQueries.all(pagination, authApi));
    if (isFetching) return <div>Loading...</div>;

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page: pagination.page + page }));
    };

    if (error) throw error;
    
    if (!data) {
        return <div>nothin.</div>;
    }

    return (
        <div className="flex flex-col justify-between pb-12">
            <PaginationButtons handlePageChange={handlePageChange} data={data} />
            <ThreadList threads={data.data} />
            <PaginationButtons handlePageChange={handlePageChange} data={data} />
        </div>
    );
}

function PaginationButtons({
    data,
    handlePageChange,
}: {
    data: { pagination: Pagination };
    handlePageChange: (count: number) => void;
}) {
    console.log(data)
    return (
        <div className="grid grid-cols-3 place-items-center py-4 mx-auto w-full max-w-[60ch]">
            {data.pagination.page > 1 ? (
                <button
                    className="btn btn-sm preset-outlined"
                    type="button"
                    onClick={() => handlePageChange(-1)}
                >
                    Previous
                </button>
            ) : (
                <div />
            )}
            <span className="chip preset-outline-surface">
                Page {data.pagination.page} of {data.pagination.pages}
            </span>
            {data.pagination.page < data.pagination.pages ? (
                <button
                    className="btn btn-sm preset-outlined"
                    type="button"
                    onClick={() => handlePageChange(1)}
                >
                    Next
                </button>
            ) : (
                <div />
            )}
        </div>
    );
}
