import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ErrorComponent } from "#/components/errors";
import { Sidebar, ToggleSidebarButton } from "#/components/Sidebar";

export const Route = createFileRoute("/campaign")({
    component: RouteComponent,
    errorComponent: ErrorComponent,
});

/**
 * Separate pathless layout for campaign pages. Removes sidebar in favor of full-screen for impact.
 */
function RouteComponent() {
    return (
        <div className="flex flex-col min-h-screen relative" >
            <Sidebar behavior="hide" />
            <Outlet />
        </div>
    );
}
