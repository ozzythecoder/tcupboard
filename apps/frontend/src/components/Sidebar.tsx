import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Dispatch, JSX, SetStateAction } from "react";
import { Navigation } from "./Nav";
import { MenuIcon, type LucideIcon } from "lucide-react";

interface ISidebarContext {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
}

const SidebarContext = createContext<ISidebarContext>({} as ISidebarContext);

export function SidebarContextProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
        setOpen((p) => !p);
    };

    return <SidebarContext value={{ open, setOpen, toggleOpen }}>{children}</SidebarContext>;
}

export const useSidebarContext = () => useContext(SidebarContext);

export function Sidebar() {
    const { open, setOpen } = useSidebarContext();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function clickOutside(e: PointerEvent) {
            if (open && ref.current && !ref.current.contains(e.target)) setOpen(false);
        }

        document.addEventListener("click", clickOutside);
        return () => document.removeEventListener("click", clickOutside);
    }, [open, setOpen]);

    return (
        <aside
            id="sidebar"
            ref={ref}
            data-open={open}
            className="fixed md:sticky z-10 transition-all min-h-screen max-h-screen max-w-60 duration-200 ease-in-out top-0 -left-50 data-[open=true]:left-0 md:flex-1 border-r border-r-surface-300-700 drop-shadow-md"
        >
            <Navigation />
        </aside>
    );
}

export function ToggleSidebarButton({ icon: ToggleIcon = MenuIcon }: { icon?: LucideIcon }) {
    const { toggleOpen } = useSidebarContext();

    return (
        <button
            className="block md:hidden"
            id="open-sidebar"
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                toggleOpen();
            }}
        >
            <label className="sr-only" htmlFor="open-sidebar">
                Open Sidebar
            </label>
            <ToggleIcon />
        </button>
    );
}
