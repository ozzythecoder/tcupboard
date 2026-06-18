import { LoaderCircle } from "lucide-react";

export function Loading() {
    return (
        <div className="grid place-items-center">
            <h3 className="h3">Just a minute...</h3>
            <LoaderCircle className="size-12 animate-spin" />
        </div>
    )
}