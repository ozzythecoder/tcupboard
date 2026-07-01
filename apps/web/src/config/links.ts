import { type LinkProps, linkOptions, type RegisteredRouter } from "@tanstack/react-router";
import { type LucideIcon, MessageCirclePlus, MessagesSquare, User2Icon } from "lucide-react";

export const NAVIGATION_LINKS = [
    {
        text: "Chat",
        nested: [
            linkOptions({
                to: "/threads",
                text: "Threads",
                Icon: MessagesSquare,
                activeOptions: {
                    exact: true,
                    includeSearch: false,
                },
            }),
            linkOptions({
                to: "/threads/create",
                text: "Create",
                Icon: MessageCirclePlus,
                activeOptions: {
                    exact: true,
                },
            }),
        ],
    },
    linkOptions({
        to: "/profile/me",
        text: "My Profile",
        Icon: User2Icon,
        activeOptions: {
            exact: true,
        },
    }),
] as const satisfies ReadonlyArray<NavItem>;

export type NavItem = NavLink | NestedNavLink;

export type NavLink = LinkProps<RegisteredRouter> & {
    text: string;
    Icon?: LucideIcon;
    nested?: never;
};
export type NestedNavLink = {
    text: string;
    Icon?: LucideIcon;
    nested: NavLink[];
};
