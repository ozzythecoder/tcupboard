import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TopBar } from "#/components/TopBar";
import { Gutter } from "#/components/ui/Gutter";

export const Route = createFileRoute("/_app/messages")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Gutter>
            <TopBar title="Direct Messages" />
            <Outlet />
        </Gutter>
    );
}
