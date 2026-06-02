import { MenuIcon } from "lucide-react";
import { useSidebarContext } from "./Sidebar";
import { Link } from "@tanstack/react-router";

export function TopBar({ title, href }: { title?: string; href?: string }) {
    if (href && !title) {
        throw new Error("A title must be supplied to a TopBar if it configured as a link");
    }

    return (
        <div className="grid grid-cols-3 md:flex items-center gap-2 px-2 sm:px-0 py-4">
            <SidebarToggle />

            <h1 className="h6 xs:text-lg tracking-tight text-center block md:hidden">TCUPboard</h1>
            {href ? (
                <Link to={href} from="/">
                    <h1 className="h1 text-2xl sm:text-3xl md:text-4xl tracking-tight text-right md:text-left hover:text-surface-800-200">
                        {title ?? " "}
                    </h1>
                </Link>
            ) : (
                <h1 className="h1 text-2xl sm:text-3xl md:text-4xl tracking-tight text-right md:text-left">
                    {title ?? " "}
                </h1>
            )}
        </div>
    );
}

function SidebarToggle() {
    const { toggleOpen } = useSidebarContext();
    return (
        <button
            className="block md:hidden max-w-fit"
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                toggleOpen();
            }}
        >
            <span className="sr-only">Open Sidebar</span>
            <MenuIcon className="inline" />
        </button>
    );
}
