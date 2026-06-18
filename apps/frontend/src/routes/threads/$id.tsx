import { useMutation,  useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { Loading } from "#/components/Loading";
import { ScrollToTopButton } from "#/components/ui/ScrollToTop";
import { getProtectedApi } from "#/config/api";
import { Editor, editorOptions } from "#/features/editor";
import {
    type IThreadActionContext,
    reactionMutations,
    reactionQueries,
    ThreadActionContext,
    ThreadView,
    threadMutations,
    threadQueries,
} from "#/features/threads";
import {
    type IPostReactionContext,
    PostReactionContext,
} from "#/features/threads/reactions/actions/context";

export const Route = createFileRoute("/threads/$id")({
    beforeLoad: async ({ params, context }) => {
        context.auth.guard();
        const userId = await context.auth.getId()
        const { id } = params;
        return {
            id,
            userId
        };
    },
    loader: async ({ context: { queryClient, auth, id } }) => {
        const authApi = getProtectedApi(await auth.getToken());
        const threadOptions = threadQueries.one(id, authApi);
        const replyOptions = threadQueries.replies(id, authApi);
        const threadReactionOptions = reactionQueries.getByPostId(Number(id), authApi);
        const replyReactionOptions = reactionQueries.getAllForThread(id, authApi);

        queryClient.prefetchQuery(threadOptions);
        queryClient.prefetchQuery(replyOptions);
        queryClient.prefetchQuery(replyReactionOptions)
        return {
            authApi,
            threadOptions,
            replyOptions,
            threadReactionOptions,
            replyReactionOptions,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { auth, queryClient, userId } = Route.useRouteContext();
    const { authApi, replyOptions, threadOptions, replyReactionOptions } = Route.useLoaderData();
    const navigate = useNavigate();

    const thread = useQuery(threadOptions);
    const replies = useQuery(replyOptions);
    const allReplyReactions = useQuery(replyReactionOptions); // bulk fetch reactions once on load
    const replyMutation = useMutation(threadMutations.createReply(authApi));
    const deleteMutation = useMutation(threadMutations.deleteThreadOrReply(authApi));
    const reactionMutation = useMutation(reactionMutations.toggleReaction(authApi));

    useEffect(() => {
        // state management - populate query cache here instead of multiple round trips
        if (!allReplyReactions.data) return;
        const groupedReactions = Object.groupBy(allReplyReactions.data, (r) => r.postId);
        for (const [id, reactions] of Object.entries(groupedReactions)) {
            queryClient.setQueryData(["reaction", id], reactions);
        }
    }, [queryClient, allReplyReactions.data]);

    if (thread.isPending) return <Loading />;
    if (thread.error) throw thread.error;

    const editorOpts = editorOptions({
        mode: "reply",
        isSaving: replyMutation.isPending,
        onSave: replyMutation.mutateAsync,
        metadata: {
            user: auth.user,
            parentThreadId: thread.data.id,
        },
    });

    const threadActionContext: IThreadActionContext = {
        canDeletePostsBy: (author_id) => {
            return (
                auth.user.sub === author_id ||
                auth.user["https://tcupboard.org/roles"].includes("admin")
            );
        },
        deleteThread: async (id, redirect = false) => {
            const r = await deleteMutation.mutateAsync(id);
            if (r.ok && redirect) navigate({ to: "/threads" });
        },
    };

    const postReactionContext: IPostReactionContext = {
        userId: Number(userId),
        authApi,
        isMutating: reactionMutation.isPending,
        reactToPost: async (createReaction) => {
            await reactionMutation.mutateAsync(createReaction);
        },
    };

    return (
        <Fragment>
            <ThreadActionContext value={threadActionContext}>
                <PostReactionContext value={postReactionContext}>
                    <ThreadView thread={thread.data} replies={replies.data ?? []} />
                </PostReactionContext>
            </ThreadActionContext>
            <Editor {...editorOpts} />
            <div className="grid place-items-center mt-4 pb-24">
                <ScrollToTopButton />
            </div>
        </Fragment>
    );
}
