import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
    loader: ({ context }) => {
        context.auth.login();
        if (context.auth.isAuthenticated) {
            throw redirect({ to: "/" });
        } else {
            context.auth.login();
        }
    },
});

function RouteComponent() {
    return null;
}
