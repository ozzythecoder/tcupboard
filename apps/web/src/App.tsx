import { RouterProvider } from "@tanstack/react-router";
import { Loading } from "./components/Loading";
import { useAuth0Context } from "./config/auth-context";
import { router } from "./router";

export function App() {
    const auth = useAuth0Context();

    if (auth.isLoading) {
        return <Loading />;
    }

    return <RouterProvider router={router} context={{ auth }} />;
}
