import { LoaderCircle } from "lucide-react";
import { TopBar } from "./TopBar";
import { Gutter } from "./ui/Gutter";

export function Loading() {
    return (
        <div className="grid place-items-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <h3 className="h3">Just a minute...</h3>
                <LoaderCircle className="size-12 animate-spin" />
            </div>
        </div>
    );
}

export function PendingComponent() {
    return (
        <Gutter>
            <TopBar />
            <Loading />
        </Gutter>
    );
}
