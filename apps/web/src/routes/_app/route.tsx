import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "#/components/Sidebar";
import { campaignQueries } from "#/features/campaign/campaign.api";
import { CampaignHighlightBanner, CampaignHighlightWrapper } from "#/features/campaign/components/CampaignHighlightBanner";

export const Route = createFileRoute("/_app")({
    component: RouteComponent,
    loader: () => {
        const highlightOpts = campaignQueries.highlighted();
        return {
            highlightOpts,
        };
    },
});

/**
 * Wraps entire app in sidebar.
 */

function RouteComponent() {
    const { highlightOpts } = Route.useLoaderData();
    const { data: highlightedCampaign } = useQuery(highlightOpts);

    return (
        <div className="flex flex-row">
            {highlightedCampaign && <CampaignHighlightWrapper campaign={highlightedCampaign} />}
            <Sidebar />
            <div
                className="flex-5 md:flex-4 px-3 min-h-screen _page-gradient"
                id="content"
                tabIndex={-1}
            >
                <Outlet />
            </div>
        </div>
    );
}
