import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Loading } from "#/components/Loading";
import { campaignQueries } from "#/features/campaign/campaign.api";
import { CampaignView } from "#/features/campaign/components/Campaign";

const searchSchema = z.object({
    preview: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/campaign/$slug")({
    validateSearch: searchSchema,
    component: RouteComponent,
    loaderDeps: ({ search }) => ({ preview: search.preview }),
    loader: ({ params, context, deps }) => {
        const { preview } = deps;
        const campaignOpts = campaignQueries.one(params.slug, preview);
        context.queryClient.ensureQueryData(campaignOpts);
        return {
            campaignOpts,
        };
    },
});

function RouteComponent() {
    const { campaignOpts } = Route.useLoaderData();
    const { preview } = Route.useSearch();
    const { data, isFetching, error } = useQuery(campaignOpts);

    if (isFetching) return <Loading />;
    if (error || !data) throw error;

    return (
        <main>
            {preview && (
                <div className="min-w-screen grid place-items-center bg-amber-400 fixed z-100">
                    <pre>DRAFT PREVIEW</pre>
                </div>
            )}
            <CampaignView campaign={data} />
        </main>
    );
}
