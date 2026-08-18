import type { PostWithAuthor } from "@repo/shared";
import { Link } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { Avatar } from "#/components/ui/Avatar";
import { Gutter } from "#/components/ui/Gutter";
import { RichTextContent } from "#/features/editor";
import { utils } from "#/utils/utils";
import { useThreadActionsContext } from "../actions/context";
import { ImageGrid } from "./ImageGrid";
import "./thread.css";
import { BackLink } from "#/components/ui/BackLink";
import { ReactionList } from "../reactions";

function ThreadEntry({ post }: { post: PostWithAuthor }) {
    const fullSizeDate = utils.formatDate(post.createdAt);
    const miniSizeDate = utils
        .formatDate(post.createdAt, {
            dateStyle: "medium",
            timeStyle: "short",
        })
        .split(/(?<=\d{4}),/); // split on second comma

    return (
        <li className="card relative p-4 flex flex-col sm:flex-row gap-4 sm:gap-8 preset-glass-surface-50-950">
            <div className="flex sm:flex-col items-center justify-between sm:min-w-16 md:min-w-24">
                <div className="flex flex-row sm:flex-col items-center gap-2">
                    <Avatar
                        avatarUrl={post.authorAvatar}
                        className="not-sm:size-8"
                        id={post.authorId.toString()}
                        link
                        user={post.author ?? "Unknown User"}
                    />
                    <Link
                        className="text-surface-600-400 anchor"
                        params={{ id: post.authorId.toString() }}
                        to="/profile/$id"
                    >
                        {post.author}
                    </Link>
                </div>
                {/* mobile date and time */}
                <time className="text-xs italic text-surface-600-400 sm:hidden">
                    {miniSizeDate.map((e) => (
                        <span className="block text-right" key={e}>
                            {e}
                        </span>
                    ))}
                </time>
            </div>
            <DeleteButton className="absolute top-4 right-4" post={post} />
            <div>
                {/* full-size date and time */}
                <time className="text-xs italic text-surface-600-400 hidden sm:block mb-2">
                    {fullSizeDate}
                </time>
                <div className="_thread-content _uncontrolled">
                    <RichTextContent content={post.content} />
                </div>
                <ImageGrid images={post.images} />
                <ReactionList postId={post.id} />
            </div>
        </li>
    );
}

export function ThreadView({
    thread,
    replies,
}: {
    thread: PostWithAuthor;
    replies: PostWithAuthor[];
}) {
    return (
        <Gutter>
            <main>
                <div className="flex flex-row-reverse gap-4 sm:flex-row items-center justify-end sm:justify-between mb-4">
                    <h2 className="h4">{thread.title}</h2>
                    <BackLink label="Threads" variant="ghost" />
                </div>
                <ul className="flex flex-col gap-4 mb-8">
                    <ThreadEntry post={thread} />
                    {replies.map((r) => (
                        <ThreadEntry key={r.id} post={r} />
                    ))}
                </ul>
            </main>
        </Gutter>
    );
}

function DeleteButton({ className, post }: { className: string; post: PostWithAuthor }) {
    const [confirm, setConfirm] = useState(false);
    const { deleteThread, canDeletePostsBy } = useThreadActionsContext();

    const handleConfirm = useCallback(async () => {
        if (!confirm) {
            setConfirm(true);
            setTimeout(() => setConfirm(false), 3000);
            return;
        } else {
            // move back to "/threads" if this is the first post of the thread
            const redirect = !post.parentId;
            await deleteThread(post.id, redirect);
        }
    }, [confirm, deleteThread, post.id, post.parentId]);

    if (!canDeletePostsBy(post.authorId) || post.deletedAt) return null;

    return (
        <button
            className={`btn text-sm h-8 preset-outlined-error-500 data-[confirmed='true']:preset-filled-error-400-600 transition-colors ${className}`}
            data-confirmed={confirm}
            onClick={handleConfirm}
            type="button"
        >
            {confirm ? "Confirm?" : null} <Trash className="size-4" />
        </button>
    );
}
