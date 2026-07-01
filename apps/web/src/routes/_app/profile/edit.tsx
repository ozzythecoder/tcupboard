import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loading, PendingComponent } from "#/components/Loading";
import { BackLink } from "#/components/ui/BackLink";
import { toaster } from "#/components/ui/Toast";
import { getProtectedApi } from "#/config/api";
import { ProfileEditor, profileMutations } from "#/features/profile";
import { userQueries } from "#/features/user/api";

export const Route = createFileRoute("/_app/profile/edit")({
    beforeLoad: ({ context }) => {
        context.auth.guard();
        const id = context.auth.user.id;
        return { id };
    },
    component: RouteComponent,
    pendingComponent: PendingComponent,
    loader: async ({ context }) => {
        const token = await context.auth.getToken();
        const authApi = getProtectedApi(token);
        const queryOpts = userQueries.getMe(authApi);
        const mutationOpts = profileMutations.edit(context.id, authApi);
        context.queryClient.ensureQueryData(queryOpts);
        return {
            queryOpts,
            mutationOpts,
        };
    },
});

function RouteComponent() {
    const { queryOpts, mutationOpts } = Route.useLoaderData();
    const { data: me, isLoading, error } = useQuery(queryOpts);
    const { mutateAsync } = useMutation(mutationOpts);
    const navigate = useNavigate();

    if (isLoading) return <Loading />;
    if (error || !me) throw error;

    return (
        <div className="mb-16">
            <div className="flex flex-row md:flex-row-reverse">
                <BackLink to="/profile/me" />
                <h2 className="h2 font-secondary grow">Edit Profile</h2>
            </div>
            <ProfileEditor
                save={async (json) => {
                    await mutateAsync(json, {
                        onSuccess: () => {
                            navigate({ to: "/profile/me" });
                        },
                        onError: (e) => {
                            console.error(e);
                            toaster.error({
                                title: "Error",
                                description: "Failed to save profile due to a request error.",
                            });
                        },
                    });
                }}
                me={me}
            />
        </div>
    );
}
