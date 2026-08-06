import { Component, captureOwnerStack, type ErrorInfo, type ReactNode } from "react";
import { isAppError } from "#/config/error";
import { InternalErrorComponent, UnauthorizedComponent } from "./errors";

export class ErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: undefined };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log(error, errorInfo.componentStack, captureOwnerStack());
        this.setState({ error });
    }

    getFallback(error: Error): ReactNode {
        if (isAppError(error)) {
            switch (error._tag) {
                case "NOT_FOUND": {
                    return <h1 className="h1">Not Found</h1>;
                }
                case "UNAUTHORIZED": {
                    return <UnauthorizedComponent />;
                }
                default:
                    return <InternalErrorComponent />;
            }
        }

        return (
            <div className="grid place-items-center">
                <h1 className="h1">Error</h1>
                <p>
                    An unknown error occurred: <pre>{String(error.message)}</pre>
                </p>
            </div>
        );
    }

    render(): ReactNode {
        if (this.state.error) {
            return this.getFallback(this.state.error);
        }
        return this.props.children;
    }
}
