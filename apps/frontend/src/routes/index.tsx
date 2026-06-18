import { ErrorBoundary } from "#/components/ErrorBoundary";
import { TopBar } from "#/components/TopBar";
import { Gutter } from "#/components/ui/Gutter";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Gutter>
            <TopBar />
            <h4 className="h4">Welcome welcome my pretties</h4>
        </Gutter>
    );
}
