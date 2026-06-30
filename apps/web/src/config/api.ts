import { QueryClient } from "@tanstack/react-query";
import ky, { isHTTPError, type KyInstance } from "ky";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            throwOnError: true,
            retry: (failureCount, error) => {
                if (isHTTPError(error)) {
                    if (error.response.status === 427) {
                        return failureCount < 3;
                    }
                }
                return false;
            },
        },
    },
});

export const api = ky.extend({
    baseUrl: `${import.meta.env.VITE_API_URL}/`,
    prefix: "/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getProtectedApi = (token: string) => {
    return api.extend({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export type ProtectedApi = KyInstance;
