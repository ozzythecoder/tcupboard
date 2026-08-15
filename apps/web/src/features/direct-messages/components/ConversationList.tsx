import type { Conversation } from "@repo/shared";
import { Link } from "@tanstack/react-router";
import { Avatar } from "#/components/ui/Avatar";
import { RichTextContent } from "#/features/editor";
import { utils } from "#/utils/utils";

interface Props {
    conversations: Conversation[];
}

export function ConversationList({ conversations }: Props) {
    return (
        <div>
            <ul className="flex flex-col gap-2">
                {Object.entries(conversations).map(([id, c]) => (
                    <ConversationListItem c={c} key={id} />
                ))}
            </ul>
        </div>
    );
}

export function ConversationListItem({ c }: { c: Conversation }) {
    if (!c.messages.at(-1)) return null;
    const latestMessage = c.messages.at(-1)!;

    return (
        <li
            className="card p-4 preset-glass-surface-200-800 hover:preset-glass-surface-50-950 group grid grid-cols-[auto_1fr] gap-4 relative"
            key={latestMessage.id}
        >
            <Link
                className="absolute before:absolute before:content-[''] cursor-pointer inset-0"
                params={{ id: c.conversationId.toString() }}
                to="/messages/conversation/$id"
            >
                <span className="sr-only">
                    Go to conversation with {latestMessage.authorUsername}
                </span>
            </Link>
            <div className="flex flex-col items-center">
                <Avatar
                    avatarUrl={latestMessage.authorAvatarUrl}
                    className="size-12 flex-shrink z-10"
                    id={latestMessage.authorId.toString()}
                    link
                    user={latestMessage.authorUsername}
                />
            </div>
            <div>
                <time className="text-xs text-neutral-500 italic absolute top-4 right-4">
                    {utils.formatDate(latestMessage.createdAt)}
                </time>
                <Link
                    className="text-lg anchor z-20 font-secondary font-bold"
                    params={{ id: latestMessage.authorId.toString() }}
                    to="/profile/$id"
                >
                    {latestMessage.authorUsername}
                </Link>
                <RichTextContent content={latestMessage.content} />
            </div>
        </li>
    );
}
