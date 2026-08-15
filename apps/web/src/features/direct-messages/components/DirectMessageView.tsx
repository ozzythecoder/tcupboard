import type { Conversation } from "@repo/shared";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Avatar } from "#/components/ui/Avatar";
import { RichTextContent } from "#/features/editor";
import { utils } from "#/utils/utils";

export function DirectMessage({ message }: { message: Conversation["messages"][number] }) {
    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, []);

    return (
        <div className="relative flex flex-col sm:flex-row items-start card preset-glass-surface-50-950 p-4 gap-2">
            <div className="flex-1 flex sm:flex-col items-center sm:items-start justify-between w-full gap-2">
                <div className="flex-1 flex flex-row items-center gap-2 relative group">
                    <Avatar
                        avatarUrl={message.authorAvatarUrl}
                        className="size-4 md:size-8 group-hover:brightness-110"
                        user={message.authorUsername}
                    />
                    <Link
                        className="anchor before:absolute before:w-full before:h-full before:inset-0"
                        params={{ id: message.senderId.toString() }}
                        to="/profile/$id"
                    >
                        {message.authorUsername}
                    </Link>
                </div>
                <time className="text-xs text-neutral-500">
                    {utils.formatDate(message.createdAt, {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </time>
            </div>
            <div className="sm:flex-4 pt-2 sm:pt-0">
                <RichTextContent content={message.content} />
            </div>
        </div>
    );
}
