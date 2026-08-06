import { createFileRoute, redirect } from "@tanstack/react-router";
import { campaignQueries } from "#/features/campaign/campaign.api";

export const Route = createFileRoute("/campaign/")({
    beforeLoad: async ({ context }) => {
        const opts = campaignQueries.highlighted();
        const highlighted = await context.queryClient.ensureQueryData(opts);
        throw redirect({ to: "/campaign/$slug", params: { slug: highlighted.campaign.slug } });
    },
    component: RouteComponent,
});

function RouteComponent() {
    return null;
}
