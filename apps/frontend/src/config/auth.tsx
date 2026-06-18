import { Auth0Provider, type Auth0ProviderOptions, useAuth0 } from "@auth0/auth0-react";
import { redirect } from "@tanstack/react-router";
import { createContext, use } from "react";
import { api, getProtectedApi } from "./api";

export interface Auth0User {
    id: string;
    name: string;
    nickname: string;
    picture: string;
    email: string;
    email_verified: boolean;
    updated_at: string;
    sub: string;
    "https://tcupboard.org/username": string;
    "https://tcupboard.org/roles": Array<unknown>;
}

export interface Auth0ContextType {
    isAuthenticated: boolean;
    user: Auth0User;
    login: () => void;
    logout: () => void;
    guard: () => void;
    getToken: () => Promise<string>;
    getId: () => Promise<string>;
    isLoading: boolean;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

const auth0options: Auth0ProviderOptions = {
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    authorizationParams: {
        scope: "openid profile email offline_access",
        redirect_uri: `${import.meta.env.VITE_WEB_URL}/threads`,
        audience: import.meta.env.VITE_AUTH0_API_IDENTIFIER,
    },
    cacheLocation: "localstorage",
    useRefreshTokens: true,
    onRedirectCallback: (state) => {
        window.history.replaceState(
            {},
            document.title,
            state?.returnTo || window.location.pathname,
        );
    },
};

export function Auth0Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Auth0Provider {...auth0options}>
            <Auth0ContextProvider>{children}</Auth0ContextProvider>
        </Auth0Provider>
    );
}

function Auth0ContextProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, getAccessTokenSilently, user, loginWithRedirect, logout, isLoading } =
        useAuth0();

    const context = {
        isAuthenticated,
        user,
        getToken: getAccessTokenSilently,
        getId: async () => {
            if (!isAuthenticated) return;
            const api = getProtectedApi(await getAccessTokenSilently());
            return api.get<Auth0User>(`users/byAuthId?auth0Id=${user?.sub}`).json().then((it) => it.id);
        },
        login: () =>
            loginWithRedirect({
                authorizationParams: {
                    prompt: "login",
                },
            }),
        logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
        guard: () => {
            if (!isAuthenticated) {
                throw redirect({ to: "/login" });
            }
        },
        isLoading,
    };

    return <Auth0Context value={context}>{children}</Auth0Context>;
}

export function useAuth0Context() {
    const context = use(Auth0Context);
    if (!context) {
        throw new Error("Auth context must be used within Auth0Wrapper");
    }
    return context;
}
