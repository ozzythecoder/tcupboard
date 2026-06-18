import { QueryClientProvider } from "@tanstack/react-query";
import { useAuth0Context } from "./config/auth";
import { queryClient } from "./config/api";
import { router } from "./router";
import { RouterProvider } from "@tanstack/react-router";
import { Loading } from "./components/Loading";

export function App() {
    const auth = useAuth0Context();

    if (auth.isLoading) {
        return <Loading />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} context={{ auth }} />
        </QueryClientProvider>
    );
}
