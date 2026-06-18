import { ErrorComponent } from "#/components/errors";
import { TopBar } from "#/components/TopBar";
import { Gutter } from "#/components/ui/Gutter";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
    component: RouteComponent,
    errorComponent: ErrorComponent,
});

function RouteComponent() {
    return (
        <Gutter>
            <TopBar />
            <Outlet />
        </Gutter>
    );
}
