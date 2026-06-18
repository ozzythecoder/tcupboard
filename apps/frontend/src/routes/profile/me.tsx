import { Loading } from "#/components/Loading";
import { getProtectedApi } from "#/config/api";
import { handleHttpError } from "#/config/error";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/me")({
    beforeLoad: async ({ context }) => {
        if (!context.auth.user) {
            throw redirect({ to: "/login" });
        }
        const token = await context.auth.getToken()
        return {
            authApi: getProtectedApi(token),
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { authApi, auth } = Route.useRouteContext();
    console.log(auth.user)
    const { data, isLoading } = useQuery({
        queryKey: ["profile", "me"],
        queryFn: async () => {
            return await authApi.get("users/profile").catch((e) => {
                throw handleHttpError(e);
            });
        },
    });

    if (isLoading) return <Loading />;

    return <div>Hello "/profile/me"!</div>;
}
