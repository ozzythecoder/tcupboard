import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { ErrorComponent } from "#/components/errors";
import { Loading } from "#/components/Loading";
import { getProtectedApi } from "#/config/api";
import { ConversationList } from "#/features/direct-messages/components/ConversationList";
import { conversationQueries } from "#/features/direct-messages/direct-messages.api";

export const Route = createFileRoute("/_app/messages/")({
    beforeLoad: async ({ context }) => {
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

    return (
        <div>
            <div className="flex flex-row justify-between items-center w-full mb-4">
                <h3 className="h3">Latest Conversations</h3>
                <Link className="btn preset-tonal-primary" to="/messages/conversation/new">
                    New <Plus />
                </Link>
            </div>
            <ConversationList conversations={data} />
        </div>
    );
}
