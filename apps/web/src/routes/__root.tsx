import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { Auth0ContextType } from "#/config/auth-context";
import { SidebarContextProvider } from "../components/Sidebar";
import { SkipToContent } from "../components/SkipToContent";
import { ToastProvider, toaster } from "../components/ui/Toast";

interface RouterContext {
    auth: Auth0ContextType;
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <SidebarContextProvider>
                <SkipToContent />
                <div className="flex-5 md:flex-4 min-h-screen">
                    <Outlet />
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
            </SidebarContextProvider>
            <ToastProvider toast={toaster} />
        </>
    );
}
