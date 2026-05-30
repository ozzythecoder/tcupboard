import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Auth0Wrapper } from "./config/auth";

import "./main.css";

// biome-ignore lint/style/noNonNullAssertion: this will always be defined
const rootEl = document.getElementById("root")!;

if (!rootEl.innerHTML) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <Auth0Wrapper>
            <App />
        </Auth0Wrapper>,
    );
}
