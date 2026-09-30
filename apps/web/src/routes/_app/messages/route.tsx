import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ErrorComponent } from "#/components/errors";
import { TopBar } from "#/components/TopBar";
import { Gutter } from "#/components/ui/Gutter";

export const Route = createFileRoute("/_app/messages")({
    beforeLoad: async ({ context }) => {
        context.auth.guard();
    },
    component: RouteComponent,
    errorComponent: ErrorComponent,
});

function RouteComponent() {
    return (
        <Gutter>
            <TopBar title="Direct Messages" />
            <Outlet />
        </Gutter>
    );
}
