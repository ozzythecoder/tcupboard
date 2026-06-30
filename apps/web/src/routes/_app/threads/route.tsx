import { ErrorComponent } from "#/components/errors";
import { TopBar } from "#/components/TopBar";
import { Gutter } from "#/components/ui/Gutter";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/threads")({
    component: RouteComponent,
    errorComponent: ErrorComponent,
});

function RouteComponent() {
    return (
        <Gutter>
            <TopBar title="Threads" href="/threads/" />
            <Outlet />
        </Gutter>
    );
}
