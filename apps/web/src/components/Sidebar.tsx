import { useLocation } from "@tanstack/react-router";
import { type LucideIcon, MenuIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Navigation } from "./Nav";

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
    const { pathname } = useLocation();
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function clickOutside(e: PointerEvent) {
            if (open && sidebarRef.current && !sidebarRef.current.contains(e.target))
                setOpen(false);
        }

        // keep sidebar open if keyboard focus moves into it, keep it closed otherwise
        function focusWithin() {
            if (sidebarRef.current?.matches(":focus-within")) {
                setOpen(true);
            } else {
                setOpen(false);
            }
        }

        document.addEventListener("click", clickOutside);
        document.addEventListener("focusin", focusWithin);
        return () => {
            document.removeEventListener("click", clickOutside);
            document.removeEventListener("focusin", focusWithin);
        };
    }, [open, setOpen]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional to close sidebar on navigation
    useEffect(() => {
        setOpen(false);
        document.getElementById("content")?.focus();
    }, [setOpen, pathname]);

    return (
        <aside
            className="fixed md:sticky z-10 transition-all max-h-screen max-w-60 duration-200 ease-in-out top-0 -left-50 data-[open=true]:left-0 md:left-0 md:flex-1 border-r border-r-surface-300-700 drop-shadow-md"
            data-open={open}
            id="sidebar"
            ref={sidebarRef}
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
