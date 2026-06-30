import type { PostWithReplies } from "@repo/shared";
import { Link } from "@tanstack/react-router";
import { Avatar } from "#/components/ui/Avatar";
import { utils } from "#/utils/utils";

export function ThreadListItem({ thread }: { thread: PostWithReplies }) {
    console.log(thread);
    const createdAt = utils.formatDate(thread.createdAt);

    return (
        <li className="card p-4 flex flex-col gap-2 sm:grid sm:grid-cols-[auto_1fr] preset-glass-surface-100-900 has-[.-thread-title-anchor:hover]:preset-filled-surface-50-950 overflow-hidden">
            <div className="flex sm:flex-col items-center justify-between sm:min-w-16 md:min-w-24">
                <div className="flex flex-row sm:flex-col items-center gap-2">
                    <Avatar
                        link
                        id={thread.authorId.toString()}
                        user={thread.authorName ?? "Unknown User"}
                        avatarUrl={thread.authorAvatar ?? undefined}
                        className="not-sm:size-8"
                    />
                    <Link
                        to="/profile/$id"
                        params={{ id: thread.authorId.toString() }}
                        className="group"
                    >
                        <p className="text-surface-600-400 group-hover:underline group-hover:brightness-110">
                            {thread.authorName}
                        </p>
                    </Link>
                </div>
            </div>
            <Link
                to="/threads/$id"
                params={{ id: thread.id.toString() }}
                className="-thread-title-anchor group"
            >
                <div className="flex flex-col justify-between px-2 gap-2 md:gap-4 h-full break-normal">
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

export function ThreadList({ threads }: { threads: PostWithReplies[] }) {
    return (
        <ul className="flex flex-col gap-2 sm:gap-4">
            {threads.map((t) => (
                <ThreadListItem thread={t} key={t.id} />
            ))}
        </ul>
    );
}
