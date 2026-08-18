import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Loading } from "#/components/Loading";
import { ToggleSidebarButton } from "#/components/Sidebar";
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
        <main className="relative" style={{ backgroundColor: data.theme.background }}>
            <div className="flex flex-row w-full items-center px-8">
                <ToggleSidebarButton hideOnDesktop={false} />
                <Link className="group w-fit h-fit mx-auto" to="/">
                    <img
                        alt=""
                        className="h-15 w-15 mt-4 mx-auto object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all group-hover:brightness-105"
                        src="/assets/icons/tcuplogo.png"
                    />
                </Link>
                <div />
            </div>
            {preview && (
                <div className="min-w-screen grid place-items-center bg-amber-400 fixed z-100">
                    <pre>DRAFT PREVIEW</pre>
                </div>
            )}
            <div id="content" tabIndex={-1}>
                <CampaignView campaign={data} />
            </div>
        </main>
    );
}
