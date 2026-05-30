import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Sidebar } from "#/components/Sidebar";
import type { Auth0ContextType } from "#/config/auth";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
    auth: Auth0ContextType
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <div id="content" className="flex-5 bg-surface-200-800">
                <Outlet />
            </div>
        </div>
    );
}
