import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ErrorComponent } from "#/components/errors";
import { Loading } from "#/components/Loading";
import { UpdateView } from "#/features/updates/components/UpdateView";
import { updateQueries } from "#/features/updates/updates.api";

export const Route = createFileRoute("/_app/updates/$id")({
    component: RouteComponent,
    errorComponent: ErrorComponent,
    loader: async ({ context, params }) => {
        const opts = updateQueries.one(params.id);
        context.queryClient.ensureQueryData(opts);
        return {
            opts,
        };
    },
});

function RouteComponent() {
    const { opts } = Route.useLoaderData();
    const { data, isFetching, error } = useQuery(opts);
    
    if (isFetching) return <Loading />;
    if (error || !data) throw error;

    return <UpdateView data={data} />;
}
