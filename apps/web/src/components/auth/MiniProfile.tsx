import type { User } from "@repo/shared";
import { Link } from "@tanstack/react-router";
import { Avatar } from "../ui/Avatar";

export function MiniProfile({ user }: { user: User }) {
    const username = user.username;
    return (
        <Link
            to="/profile/me"
            className="w-full grid grid-cols-[auto_1fr] p-2 hover:bg-surface-200-800 rounded-md mb-2"
            title="View profile"
        >
            <Avatar user={username} avatarUrl={user.avatarUrl} className="size-6" />
            <span className="text-right">{username}</span>
        </Link>
    );
}
