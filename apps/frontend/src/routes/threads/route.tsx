import { TopBar } from "#/components/TopBar";
import { Gutter } from "#/components/ui/Gutter";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/threads")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Gutter>
            <TopBar title="Threads" href="/threads/" />
            <Outlet />
        </Gutter>
    );
}
