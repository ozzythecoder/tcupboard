import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <p>Welcome to the index</p>
        </div>
    );
}
