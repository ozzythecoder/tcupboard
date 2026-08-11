import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="m-12">
            <h1 className="h1">Frequently Asked Questions</h1>
            <details>
                <summary>What is TCUP?</summary>
                TCUP is lorem ipsum dolor est ajfiwiajosdjofaijefoijewijfaoij
            </details>
        </div>
    );
}
