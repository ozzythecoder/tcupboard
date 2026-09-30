import { createFileRoute } from "@tanstack/react-router";
import { CreateNewConversationForm } from "#/features/direct-messages/forms/create";

export const Route = createFileRoute("/_app/messages/conversation/new")({
    component: RouteComponent,
    loader: async ({ context }) => {
        return {
            userId: await context.auth.getId(),
        };
    },
});

function RouteComponent() {
    const { userId } = Route.useLoaderData();
    return (
        <div>
            <CreateNewConversationForm userId={parseInt(userId!)} />
        </div>
    );
}
