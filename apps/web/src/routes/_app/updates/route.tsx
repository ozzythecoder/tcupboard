import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { TopBar } from "#/components/TopBar";
import { Gutter } from "#/components/ui/Gutter";

export const Route = createFileRoute("/_app/updates")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Fragment>
            <Gutter>
                <TopBar href="/updates" title="News" />
            </Gutter>
            <Outlet />
        </Fragment>
    );
}
