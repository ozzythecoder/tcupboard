import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { ErrorComponent } from "#/components/errors";
import type { Auth0ContextType } from "#/config/auth-context";
import { SidebarContextProvider } from "../components/Sidebar";
import { SkipToContent } from "../components/SkipToContent";
import { ToastProvider, toaster } from "../components/ui/Toast";

interface RouterContext {
    auth: Auth0ContextType;
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    errorComponent: ErrorComponent,
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <SidebarContextProvider>
                <SkipToContent />
                <Outlet />
                <ReactQueryDevtools initialIsOpen={false} />
            </SidebarContextProvider>
            <ToastProvider toast={toaster} />
        </>
    );
}
