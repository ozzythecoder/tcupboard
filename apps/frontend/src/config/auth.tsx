import { Auth0Provider, type Auth0ProviderOptions, useAuth0 } from "@auth0/auth0-react";
import { createContext, use } from "react";

export interface Auth0ContextType {
    isAuthenticated: boolean;
    user: Record<string, string | object>;
    login: () => void;
    logout: () => void;
    isLoading: boolean;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

const auth0options: Auth0ProviderOptions = {
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    authorizationParams: {
        scope: "openid profile email offline_access",
        redirect_uri: `${import.meta.env.VITE_WEB_URL}/callback`,
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
    const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();

    const context = {
        isAuthenticated,
        user,
        login: loginWithRedirect,
        logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
        isLoading,
    };

    return <Auth0Context.Provider value={context}>{children}</Auth0Context.Provider>;
}

export function useAuth0Context() {
    const context = use(Auth0Context);
    if (!context) {
        throw new Error("Auth context must be used within Auth0Wrapper");
    }
    return context;
}
