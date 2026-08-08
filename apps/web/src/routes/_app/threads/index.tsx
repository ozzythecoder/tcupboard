import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";
import { ErrorComponent } from "#/components/errors";
import { Loading } from "#/components/Loading";
import { getProtectedApi } from "#/config/api";
import { NotFoundError } from "#/config/error";
import { ThreadList, threadQueries } from "#/features/threads";
import { ThreadsLoading } from "./-loading";

const routeQuerySchema = z.object({
    page: z.number().default(1),
});

export const Route = createFileRoute("/_app/threads/")({
    validateSearch: routeQuerySchema,
    component: RouteComponent,
    errorComponent: ErrorComponent,
    pendingComponent: Loading,
    loaderDeps: ({ search }) => ({ page: search.page }),
    loader: async ({ context, deps }) => {
        const authApi = getProtectedApi(await context.auth.getId());
        context.queryClient.ensureQueryData(threadQueries.all({ page: deps.page }, authApi));
        return {
            authApi,
        };
    },
});

function RouteComponent() {
    const { page } = Route.useSearch();
    const { authApi } = Route.useLoaderData();
    const { data, error, isFetching } = useQuery(threadQueries.all({ page }, authApi));

    if (isFetching) return <ThreadsLoading />;
    if (error) throw error;
    if (!data) {
        throw new NotFoundError();
    }

    return (
        <div className="flex flex-col justify-between pb-12">
            <PaginationButtons
                pageData={{ current: data.pagination.page, total: data.pagination.pages }}
            />
            <ThreadList threads={data.data} />
            <PaginationButtons
                pageData={{ current: data.pagination.page, total: data.pagination.pages }}
            />
        </div>
    );
}

function PaginationButtons({ pageData }: { pageData: { current: number; total: number } }) {
    return (
        <div className="grid grid-cols-3 place-items-center py-4 mx-auto w-full max-w-[60ch]">
            {pageData.current > 1 ? (
                <Link
                    className="btn btn-sm preset-outlined"
                    search={{ page: pageData.current - 1 }}
                    to={`/threads`}
                >
                    Previous
                </Link>
            ) : (
                <div />
            )}
            <span className="chip hover:brightness-100 preset-outline-surface">
                Page {pageData.current} of {pageData.total}
            </span>
            {pageData.current < pageData.total ? (
                <Link
                    className="btn btn-sm preset-outlined"
                    search={{ page: pageData.current + 1 }}
                    to={`/threads`}
                >
                    Next
                </Link>
            ) : (
                <div />
            )}
        </div>
    );
}
