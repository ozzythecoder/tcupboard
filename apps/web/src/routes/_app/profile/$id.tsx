import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loading } from "#/components/Loading";
import { BackLink } from "#/components/ui/BackLink";
import { getProtectedApi } from "#/config/api";
import { NotFoundError } from "#/config/error";
import { ProfileView } from "#/features/profile";
import { userQueries } from "#/features/user/api";

export const Route = createFileRoute("/_app/profile/$id")({
    beforeLoad: async ({ context, params }) => {
        context.auth.guard();
        return {
            id: Number(params.id),
        };
    },
    loader: async ({ context }) => {
        const token = await context.auth.getToken();
        const authApi = getProtectedApi(token);
        const queryOpts = userQueries.getOneById(context.id, authApi);
        context.queryClient.ensureQueryData(queryOpts);
        return {
            authApi,
            queryOpts,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { queryOpts } = Route.useLoaderData();
    const { data, isLoading } = useQuery(queryOpts);

    if (isLoading) return <Loading />;
    if (!data) throw new NotFoundError("User not found.");

    return (
        <div>
            <div className="grid-cols-[1fr_auto]">
                <div />
                <BackLink />
            </div>
            <ProfileView user={data} />
        </div>
    );
}
