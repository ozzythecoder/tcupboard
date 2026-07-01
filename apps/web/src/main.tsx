import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Auth0Wrapper } from "./config/auth-context";

import "./main.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/api";

// biome-ignore lint/style/noNonNullAssertion: this will always be defined
const rootEl = document.getElementById("root")!;

if (!rootEl.innerHTML) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <QueryClientProvider client={queryClient}>
            <Auth0Wrapper>
                <App />
            </Auth0Wrapper>
        </QueryClientProvider>,
    );
}
