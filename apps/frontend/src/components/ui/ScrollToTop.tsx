import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
    const scroll = () => {
        window.scrollTo(0, 0);
    }
    return (
        <button onClick={scroll} className="btn preset-filled-primary-50-950 z-4 ring-2 flex flex-row align-center gap-2" type="button">
            <ArrowUp className="size-4" />
            <span>Top</span>
        </button>
    );
}
