import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loading } from "#/components/Loading";

export const Route = createFileRoute("/callback")({
    beforeLoad: async ({ context }) => {
        context.auth.guard();
        return redirect({ to: "/threads" });
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <Loading />;
}
