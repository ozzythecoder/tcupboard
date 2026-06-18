import { Loading } from "#/components/Loading";
import { getProtectedApi } from "#/config/api";
import { NotFoundError } from "#/config/error";
import { profileQueries, ProfileView } from "#/features/profile";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/$id")({
    beforeLoad: async ({ context }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({ to: "/login" });
        }
        const token = await context.auth.getToken()
        return {
            authApi: getProtectedApi(token),
        };
    },
    component: RouteComponent,
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(profileQueries.one(params.id, context.authApi));
    },
});

function RouteComponent() {
    const { authApi } = Route.useRouteContext();
    const { id } = Route.useParams();
    const { data, isLoading } = useQuery(profileQueries.one(id, authApi));

    if (isLoading) return <Loading />;
    if (!data) throw new NotFoundError("User not found.");

    return <ProfileView user={data} />;
}
