import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loading } from "#/components/Loading";
import { Avatar } from "#/components/ui/Avatar";
import { getProtectedApi } from "#/config/api";
import { NotFoundError } from "#/config/error";
import { userQueries } from "#/features/user/api";
import { utils } from "#/utils/utils";
import { ProfileView } from "#/features/profile";

export const Route = createFileRoute("/_app/profile/me")({
    beforeLoad: async ({ context }) => {
        context.auth.guard();
    },
    loader: async ({ context }) => {
        const token = await context.auth.getToken();
        const authApi = getProtectedApi(token);
        const queryOpts = userQueries.getMe(authApi);
        context.queryClient.ensureQueryData(queryOpts);
        return {
            queryOpts,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { auth } = Route.useRouteContext();
    const { queryOpts } = Route.useLoaderData();
    console.log(auth.user);
    const { data, isLoading } = useQuery(queryOpts);

    if (isLoading) return <Loading />;
    if (!data) throw new NotFoundError();

    return (
        <div>
            <ProfileView user={data} />
        </div>
    );
}
