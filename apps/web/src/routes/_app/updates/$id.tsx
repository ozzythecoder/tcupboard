import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { ErrorComponent } from "#/components/errors";
import { Loading } from "#/components/Loading";
import { UpdateView } from "#/features/updates/components/UpdateView";
import { updateQueries } from "#/features/updates/updates.api";

const searchSchema = z.object({
    preview: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_app/updates/$id")({
    validateSearch: searchSchema,
    component: RouteComponent,
    errorComponent: ErrorComponent,
    loaderDeps: ({ search }) => ({ preview: search.preview }),
    loader: async ({ context, params, deps }) => {
        const opts = updateQueries.one(params.id, deps.preview);
        context.queryClient.ensureQueryData(opts);
        return {
            opts,
            preview: deps.preview,
        };
    },
});

function RouteComponent() {
    const { opts, preview } = Route.useLoaderData();
    const { data, isFetching, error } = useQuery(opts);

    if (isFetching) return <Loading />;
    if (error || !data) throw error;

    return (
        <main>
            {preview && (
                <div className="min-w-screen grid place-items-center bg-amber-400 fixed z-100">
                    <pre>DRAFT PREVIEW</pre>
                </div>
            )}
            <UpdateView data={data} />
        </main>
    );
}
