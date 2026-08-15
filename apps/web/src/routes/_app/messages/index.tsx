import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ErrorComponent } from "#/components/errors";
import { Loading } from "#/components/Loading";
import { getProtectedApi } from "#/config/api";
import { ConversationList } from "#/features/direct-messages/components/ConversationList";
import { conversationQueries } from "#/features/direct-messages/direct-messages.api";

export const Route = createFileRoute("/_app/messages/")({
    beforeLoad: async ({ context }) => {
        context.auth.guard();
        return {
            token: await context.auth.getToken(),
        };
    },
    component: RouteComponent,
    errorComponent: ErrorComponent,
    loader: async ({ context }) => {
        const authApi = getProtectedApi(context.token);
        const conversationOpts = conversationQueries.all(authApi);
        return {
            conversationOpts,
        };
    },
});

function RouteComponent() {
    const { conversationOpts } = Route.useLoaderData();

    const { data, error, isFetching } = useQuery(conversationOpts);

    if (isFetching) return <Loading />;
    if (error || !data) throw error;

    return <ConversationList conversations={data} />;
}
