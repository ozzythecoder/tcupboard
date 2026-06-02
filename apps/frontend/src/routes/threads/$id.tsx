import { TopBar } from "#/components/TopBar";
import { ThreadView, useThreadOptions, useThreadRepliesOptions } from "#/features/threads";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/threads/$id")({
    beforeLoad: ({ params }) => {
        const { id } = params;
        return {
            threadOptions: useThreadOptions(id),
            threadReplyOptions: useThreadRepliesOptions(id),
        };
    },
    loader: async ({ context: { auth, queryClient, threadOptions, threadReplyOptions } }) => {
        if (!auth.isAuthenticated) {
            // auth.login();
        }
        queryClient.prefetchQuery(threadReplyOptions);
        await queryClient.prefetchQuery(threadOptions);
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { threadOptions, threadReplyOptions } = Route.useRouteContext();
    const thread = useQuery(threadOptions);
    const replies = useQuery(threadReplyOptions);

    if (thread.isPending) {
        return <div>Loading...</div>;
    }

    if (thread.error) {
        return <div>Error</div>;
    }

    return <ThreadView thread={thread.data} replies={replies.data ?? []} />;
}
