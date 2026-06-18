import { Link } from "@tanstack/react-router";
import type { Auth0User } from "#/config/auth";
import { Avatar } from "../ui/Avatar";

export function MiniProfile({ user }: { user: Auth0User }) {
    const username = user["https://tcupboard.org/username"]
    return (
        <Link to="/profile/me" className="grid grid-cols-[auto_1fr] p-2 hover:bg-surface-200-800 rounded-md mb-2">
            <Avatar user={username} avatarUrl={user.picture} className="size-6" />
            <span className="text-right">{username}</span>
        </Link>
    );
}
