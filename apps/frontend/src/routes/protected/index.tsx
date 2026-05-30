import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/protected/")({
    beforeLoad: ({ context }) => {
        console.log(context.auth)
        if (!context.auth.isAuthenticated) {
            context.auth.login();
            return;
        }
    },
    component: RouteComponent,
    errorComponent: ({ error }) => {
        console.log(error)
        return <div>An error occurred</div>
    }
});

function RouteComponent() {
    return <div>Hello "/protected/"!</div>;
}
