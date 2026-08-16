import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getProtectedApi } from "#/config/api";
import { editorOptions, ThreadEditor } from "#/features/editor";
import { threadMutations } from "#/features/threads";

export const Route = createFileRoute("/_app/threads/create")({
    beforeLoad: async ({ context }) => {
        context.auth.guard();
        return {
            token: await context.auth.getToken(),
        };
    },
    component: RouteComponent,
    loader: ({ context }) => {
        return {
            user: context.auth.user,
            authApi: getProtectedApi(context.token),
        };
    },
});

function RouteComponent() {
    const navigate = useNavigate();
    const { user, authApi } = Route.useLoaderData();
    const { mutateAsync, isPending } = useMutation(threadMutations.createThread(authApi));

    const opts = editorOptions({
        mode: "compose",
        onSave: async (json) => {
            const r = await mutateAsync(json);
            if (r.id) {
                navigate({ to: "/threads/$id", params: { id: r.id } });
            }
        },
        isSaving: isPending,
        metadata: {
            user,
        },
    });

    return (
        <div>
            <h1 className="h3">Create a Thread</h1>
            <ThreadEditor {...opts} />
        </div>
    );
}
