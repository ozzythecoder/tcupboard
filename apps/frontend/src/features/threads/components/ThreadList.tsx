import type { ForumMessageWithReplyDetails } from "#/types/resources";
import { Avatar } from "@skeletonlabs/skeleton-react";
import { utils } from "#/utils/utils";
import { Link } from "@tanstack/react-router";

export function ThreadListItem({ thread }: { thread: ForumMessageWithReplyDetails }) {
    const createdAt = utils.formatDate(thread.created_at);

    return (
        <li className="card p-4 grid grid-cols-[auto_1fr] preset-filled-surface-100-900 has-[.-thread-title-anchor:hover]:preset-filled-primary-50-950 overflow-hidden">
            <div className="flex flex-col items-center gap-4 w-25">
                <Link to="/" from="/threads/">
                    <Avatar className="size-14 hover:brightness-110">
                        <Avatar.Image src={thread.author_avatar ?? undefined} />
                        <Avatar.Fallback>{thread.author?.charAt(0).toUpperCase()}</Avatar.Fallback>
                    </Avatar>
                </Link>
                <Link to="/" from="/threads/">
                    <p className="anchor text-xs text-surface-400-600">{thread.author}</p>
                </Link>
            </div>
            <Link
                to="/threads/$id"
                params={{ id: thread.id!.toString() }}
                className="-thread-title-anchor group"
            >
                <div className="flex flex-col justify-between gap-4 h-full break-normal">
                    <h3 className="h6 group-hover:underline">{thread.title}</h3>
                    <p className="text-xs text-surface-400-600">
                        {createdAt} &bull; {thread.replyCount ?? 0}{" "}
                        {thread.replyCount === 1 ? "reply" : "replies"}
                    </p>
                </div>
            </Link>
        </li>
    );
}

export function ThreadList({ threads }: { threads: ForumMessageWithReplyDetails[] }) {
    return (
        <ul className="flex flex-col gap-4">
            {threads.map((t) => (
                <ThreadListItem thread={t} key={t.id} />
            ))}
        </ul>
    );
}
