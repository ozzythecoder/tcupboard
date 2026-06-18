import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Sidebar, SidebarContextProvider } from "#/components/Sidebar";
import { SkipToContent } from "#/components/SkipToContent";
import type { Auth0ContextType } from "#/config/auth";

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
            <SkipToContent />
            <div className="flex flex-row">
                <Sidebar />
                <div id="content" tabIndex={-1} className="flex-5 md:flex-4 px-3">
                    <Outlet />
                </div>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </SidebarContextProvider>
    );
}
