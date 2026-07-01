import { Link } from "@tanstack/react-router";
import { isAppError } from "#/config/error";
import { TopBar } from "./TopBar";
import { Gutter } from "./ui/Gutter";

export function UnauthorizedComponent() {
    return (
        <div className="grid place-items-center gap-4">
            <h1 className="h1">Unauthorized</h1>
            <p>
                You need to{" "}
                <Link className="anchor" to="/login">
                    log in
                </Link>{" "}
                to view this resource.
            </p>
        </div>
    );
}

export function InternalErrorComponent() {
    return (
        <div className="grid place-items-center gap-4">
            <h1 className="h1">Internal Error</h1>
            <p>
                You didn't do anything wrong; the server is dealing with an unknown error. Try again
                later.
            </p>
        </div>
    );
}

export function NetworkErrorComponent() {
    return (
        <div className="grid place-items-center gap-4">
            <h1 className="h1">Network Error</h1>
            <p>Check your internet connection.</p>
        </div>
    );
}

/**
 * Generic error component. Matches against established app errors and returns an appropriate view and user suggestion for each.
 */
export function ErrorComponent({ error }: { error: unknown }) {
    if (isAppError(error)) {
        switch (error._tag) {
            case "NOT_FOUND": {
                return <h1 className="h1">Resource Not Found</h1>;
            }
            case "UNAUTHORIZED": {
                return <UnauthorizedComponent />;
            }
            case "NETWORK_ERROR": {
                return <NetworkErrorComponent />;
            }
            default:
                return <InternalErrorComponent />;
        }
    }

    return (
        <Gutter>
            <TopBar />
            <h1 className="h1">Error</h1>
            <p>An unknown error occurred:</p>
            <pre>{String(error)}</pre>
        </Gutter>
    );
}
