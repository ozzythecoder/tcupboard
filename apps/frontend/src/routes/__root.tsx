import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Sidebar, SidebarContextProvider } from "#/components/Sidebar";
import type { Auth0ContextType } from "#/config/auth";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
    auth: Auth0ContextType;
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    return (
        <SidebarContextProvider>
            <div id="modal-root" className="relative" />
            <div className="flex flex-row relative">
                <Sidebar />
                <div id="content" className="flex-5 md:flex-4 px-3 min-h-screen max-h-screen">
                    <Outlet />
                </div>
            </div>
        </SidebarContextProvider>
    );
}
