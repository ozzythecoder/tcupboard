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
        <div>
            <div className="flex flex-row">
                <Sidebar />
                <div id="content" tabIndex={-1} className="flex-5 md:flex-4 px-3 min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
