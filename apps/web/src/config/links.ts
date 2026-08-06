import { type LinkProps, linkOptions, type RegisteredRouter } from "@tanstack/react-router";
import { type LucideIcon, Megaphone, MessageCirclePlus, MessagesSquare, Newspaper } from "lucide-react";

export const FOOTER_NAVIGATION_LINKS = [
    linkOptions({
        to: "/updates",
        text: "News",
    }),
    linkOptions({
        to: "/campaign",
        text: "Campaigns"
    }),
    linkOptions({
        to: "/threads",
        text: "TCUPboard Chat"
    })
] as const satisfies ReadonlyArray<NavItem>;

export const SIDEBAR_NAVIGATION_LINKS = [
    linkOptions({
        to: "/campaign",
        text: "Campaigns",
        Icon: Megaphone,
        activeOptions: {
            exact: true,
        },
    }),
    linkOptions({
        to: "/updates",
        text: "News",
        Icon: Newspaper,
        activeOptions: {
            exact: true,
        },
    }),
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
