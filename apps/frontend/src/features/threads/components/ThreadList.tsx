import type { ForumMessageWithReplyDetails } from "#/types/resources";
import { Avatar } from "#/components/ui/Avatar";
import { utils } from "#/utils/utils";
import { Link } from "@tanstack/react-router";

export function ThreadListItem({ thread }: { thread: ForumMessageWithReplyDetails }) {
    const createdAt = utils.formatDate(thread.created_at);

    return (
        <li className="card p-4 flex flex-col gap-2 sm:grid sm:grid-cols-[auto_1fr] preset-filled-surface-100-900 has-[.-thread-title-anchor:hover]:preset-filled-primary-50-950 overflow-hidden">
            <div className="flex sm:flex-col items-center justify-between sm:min-w-16 md:min-w-24">
                <div className="flex flex-row sm:flex-col items-center gap-2">
                    <Avatar user={thread.author ?? "Unknown User"} avatarUrl={thread.author_avatar} className="not-sm:size-8" />
                    <p className="text-surface-600-400">{thread.author}</p>
                </div>
            </div>
            <Link
                to="/threads/$id"
                params={{ id: thread.id!.toString() }}
                className="-thread-title-anchor group"
            >
                <div className="flex flex-col justify-between gap-2 md:gap-4 h-full break-normal">
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
