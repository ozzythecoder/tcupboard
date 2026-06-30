import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./config/api";

export const router = createRouter({
    routeTree,
    // @ts-expect-error authContext is applied when instantiated in `App.tsx`
    context: {
        queryClient,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
