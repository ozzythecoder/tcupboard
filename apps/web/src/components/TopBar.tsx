import { Link } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useSidebarContext } from "./Sidebar";
import { Teapot } from "./Teapot";

type Props =
    | {
          title: string;
          href?: string;
      }
    | {
          title?: undefined;
          href?: never;
      };

export function TopBar({ title, href }: Props) {
    if (href && !title) {
        throw new Error("A title must be supplied to a TopBar if configured as a link");
    }

    return (
        <div className="grid grid-cols-3 md:flex items-center justify-between gap-2 px-2 sm:px-0 py-4">
            <SidebarToggle />

            <Link to="/" className="block md:hidden max-w-fit mx-auto">
                <Teapot className="h-8 w-8 hover:brightness-110" />
            </Link>
            {href ? (
                <h1 className="text-right text-shadow-hard-surface-contrast-800-200">
                    <Link
                        to={href}
                        from="/"
                        className="h1 font-secondary text-2xl sm:text-3xl md:text-4xl tracking-tight md:text-left hover:text-surface-800-200 text-shadow-hard"
                    >
                        {title ?? " "}
                    </Link>
                </h1>
            ) : (
                <h1 className="h1 font-secondary text-2xl sm:text-3xl md:text-4xl tracking-tight text-right md:text-left">
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
