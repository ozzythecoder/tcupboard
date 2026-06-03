import { Navigation as Nav } from "@skeletonlabs/skeleton-react";
import {
    Link,
    useRouterState,
    type LinkProps,
    type RegisteredRouter,
} from "@tanstack/react-router";
import { Home, Lock, MessagesSquare, X, type LucideIcon } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeSwitch } from "./ui/ThemeSwitch";
import { ToggleSidebarButton } from "./Sidebar";

const links = [
    {
        to: "/",
        text: "Home",
        Icon: Home,
    },
    {
        to: "/threads",
        text: "Threads",
        Icon: MessagesSquare,
    },
    {
        to: "/protected",
        text: "Protected",
        Icon: Lock,
    },
] as const satisfies ReadonlyArray<
    LinkProps<RegisteredRouter> & { text: string; Icon?: LucideIcon }
>;

function LinkElement({ l, location }: { l: (typeof links)[number]; location: string }) {
    return (
        <div className="group">
            <Link
                data-active={location === l.to}
                to={l.to}
                className="anchor w-full py-2 px-4 rounded-md flex flex-row items-center data-[active=true]:bg-primary-100-900 group-hover:underline text-surface-900-100 data-[active=true]:text-primary-700-300"
            >
                <span className="grow">{l.text}</span>
                {l.Icon && <l.Icon className="inline shrink" size={18} />}
            </Link>
        </div>
    );
}

export function Navigation() {
    const location = useRouterState({ select: (s) => s.location });
    return (
        <Nav layout="sidebar" className="w-full min-h-screen grid grid-rows-[auto_1fr_auto] gap-4">
            <Nav.Header className="flex flex-col items-center mx-auto">
                <div className="w-full pl-1 mt-1">
                    <ToggleSidebarButton icon={X} />
                </div>
                <Logo />
                <h1 className="h3 text-2xl text-center tracking-tight">
                    <span className="text-secondary-800-200">TCUP</span>board
                </h1>
            </Nav.Header>
            <Nav.Content>
                <Nav.Menu>
                    {links.map((l) => (
                        <Nav.Trigger
                            key={l.text}
                            element={() => <LinkElement l={l} location={location.pathname} />}
                        />
                    ))}
                </Nav.Menu>
            </Nav.Content>
            <Nav.Footer>
                {/*user data*/}
                <ThemeSwitch />
                <div className="rounded-full min-w-6 min-h-6 bg-black"></div>
            </Nav.Footer>
        </Nav>
    );
}
