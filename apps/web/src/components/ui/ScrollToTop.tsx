import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
    const scroll = () => {
        window.scrollTo(0, 0);
    };
    return (
        <button
            className="btn btn-sm preset-filled-primary-50-950 z-4 ring-2 ring-surface-500 flex flex-row align-center gap-2"
            onClick={scroll}
            type="button"
        >
            <ArrowUp className="size-4" />
            <span>Top</span>
        </button>
    );
}
