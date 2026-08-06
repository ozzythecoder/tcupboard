import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "#/components/Sidebar";

export const Route = createFileRoute("/_app")({
    component: RouteComponent,
});

/**
 * Wraps entire app in sidebar.
 */

function RouteComponent() {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <div className="flex-5 md:flex-4 px-3 min-h-screen _page-gradient" id="content" tabIndex={-1}>
                <Outlet />
            </div>
        </div>
    );
}
