import { useLocation } from "@tanstack/react-router";
import { type LucideIcon, MenuIcon } from "lucide-react";
import type { Dispatch, FocusEvent, SetStateAction } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Navigation } from "./Nav";
import { useHotkey } from "@tanstack/react-hotkeys";

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

interface SidebarProps {
    behavior?: "hide" | "sticky";
}

export function Sidebar({ behavior = "sticky" }: SidebarProps) {
    const { open, setOpen } = useSidebarContext();
    const { pathname } = useLocation();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const behaviorClass = behavior === "sticky" ? "md:sticky md:left-0 md:flex-1" : "md:w-60";

    useHotkey('M', () => setOpen(p => !p))
    useHotkey('Escape', () => setOpen(false))

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const contains = sidebarRef.current?.contains(e.target as Node);
            if (open && !contains) setOpen(false);
        }

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [open, setOpen]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional to close sidebar on navigation
    useEffect(() => {
        setOpen(false);
        document.getElementById("content")?.focus();
    }, [setOpen, pathname]);

    const handleFocus = (e: FocusEvent) => {
        setOpen(e.currentTarget.contains(e.target));
    };

    return (
        <aside
            className={`fixed ${behaviorClass} z-50 transition-all max-h-screen max-w-60 duration-200 ease-in-out top-0 -left-70 data-[open=true]:left-0 md:flex-1 border-r border-r-surface-300-700 drop-shadow-md`}
            data-open={open}
            id="sidebar"
            onBlur={() => setOpen(false)}
            onFocus={handleFocus}
            ref={sidebarRef}
        >
            <Navigation />
        </aside>
    );
}

interface SidebarButtonProps {
    Icon?: LucideIcon;
    hideOnDesktop?: boolean;
    className?: string;
}

export function ToggleSidebarButton({
    Icon = MenuIcon,
    hideOnDesktop = true,
    className,
}: SidebarButtonProps) {
    const { toggleOpen } = useSidebarContext();
    const hiddenClass = hideOnDesktop ? "md:hidden" : "";

    return (
        <button
            className={`block ${hiddenClass} ${className}`}
            id="open-sidebar"
            onClick={(e) => {
                e.stopPropagation();
                toggleOpen();
            }}
            tabIndex={-1}
            type="button"
        >
            <label className="sr-only" htmlFor="open-sidebar">
                Open Sidebar
            </label>
            <Icon />
        </button>
    );
}
