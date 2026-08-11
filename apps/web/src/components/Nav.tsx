import { Collapsible, Navigation as Nav } from "@skeletonlabs/skeleton-react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { useAuth0Context } from "#/config/auth-context";
import { SIDEBAR_NAVIGATION_LINKS, type NavLink, type NestedNavLink } from "#/config/links";
import { LogoutButton } from "./auth/LogoutButton";
import { MiniProfile } from "./auth/MiniProfile";
import { Logo } from "./Logo";
import { ToggleSidebarButton } from "./Sidebar";
import { ThemeSwitch } from "./ui/ThemeSwitch";

function LinkElement({ l }: { l: NavLink }) {
    const { text, Icon, ...link } = l;

    return (
        <div className="group w-full">
            <Link
                activeProps={{
                    className: "bg-primary-100-900 text-primary-700-300",
                }}
                className="_navlink anchor w-full py-2 px-4 rounded-md flex flex-row items-center font-secondary group-hover:underline text-surface-900-100"
                {...link}
            >
                <span className="grow">{text}</span>
                {Icon && <Icon className="inline shrink" size={18} />}
            </Link>
        </div>
    );
}

function Dropdown({ l }: { l: NestedNavLink }) {
    const { text, nested } = l;
    return (
        <Collapsible className="group/link">
            <Collapsible.Trigger className="_navlink z-10 anchor w-full py-2 px-4 rounded-md flex flex-row items-center font-secondary group-hover/link:underline text-surface-900-100 border-0">
                <span className="grow text-left">{text}</span>
                <Collapsible.Indicator className="shrink group/collapse">
                    {l.Icon ? (
                        <l.Icon className="inline" size={18} />
                    ) : (
                        <span>
                            <ChevronDown
                                className="group-data-[state=closed]/collapse:inline hidden"
                                size={18}
                            />
                            <ChevronUp
                                className="group-data-[state=open]/collapse:inline hidden"
                                size={18}
                            />
                        </span>
                    )}
                </Collapsible.Indicator>
            </Collapsible.Trigger>
            <Collapsible.Content className="overflow-hidden data-[state=open]:animate-[collapsible-open_200ms_ease-out] data-[state=closed]:animate-[collapsible-close_200ms_ease-out] w-full pl-4 flex flex-col items-center gap-2">
                {nested.map((c) => (
                    <Nav.Trigger element={() => <LinkElement l={c} />} key={c.text} />
                ))}
            </Collapsible.Content>
        </Collapsible>
    );
}

export function Navigation() {
    return (
        <Nav className="w-full min-h-screen grid grid-rows-[auto_1fr_auto] gap-4" layout="sidebar">
            <Nav.Header className="flex flex-col items-center mx-auto">
                <div className="w-full pl-1 mt-1">
                    <ToggleSidebarButton icon={X} />
                </div>
                <Logo />
                <h1 className="h3 text-2xl text-center tracking-tight text-shadow-hard-surface-contrast-700-300 font-secondary mt-1">
                    <span className="text-secondary-800-200">TCUP</span>board
                </h1>
            </Nav.Header>
            <Nav.Content>
                <Nav.Menu>
                    {SIDEBAR_NAVIGATION_LINKS.map((l) => {
                        return "nested" in l ? (
                            <Dropdown key={l.text} l={l} />
                        ) : (
                            <Nav.Trigger element={() => <LinkElement l={l} />} key={l.text} />
                        );
                    })}
                </Nav.Menu>
            </Nav.Content>
            <Nav.Footer className="flex flex-col items-end">
                <ThemeSwitch />
                <SidebarFooter />
            </Nav.Footer>
        </Nav>
    );
}

function SidebarFooter() {
    const { user } = useAuth0Context();

    return user ? (
        <Fragment>
            <MiniProfile user={user} />
            <LogoutButton />
        </Fragment>
    ) : null;
}
