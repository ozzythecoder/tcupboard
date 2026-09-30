import { useAuth0 } from "@auth0/auth0-react";
import { QueryClient } from "@tanstack/react-query";
import ky, { isHTTPError, type KyInstance } from "ky";
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { useAuth0Context } from "./auth-context";
import { UnauthorizedError } from "./error";

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

interface IProtectedApiContext {
    getApi: () => ProtectedApi;
}

const ProtectedApiContext = createContext<IProtectedApiContext | undefined>(undefined);

export const ProtectedApiProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | undefined>(undefined);
    const { getToken } = useAuth0Context();

    const context: IProtectedApiContext = {
        getApi: () => {
            if (!token) throw new UnauthorizedError()
            return getProtectedApi(token);
        },
    };

    useEffect(() => {
        const fetchToken = async () => {
            setToken(await getToken());
        };
        fetchToken();
    }, [getToken]);

    return <ProtectedApiContext value={context}>{children}</ProtectedApiContext>;
};

export const useProtectedApiContext = () => {
    const context = use(ProtectedApiContext);
    if (!context) {
        throw new Error("useProtectedApiContext must be used within a ProtectedApiProvider");
    }
    return context;
};
