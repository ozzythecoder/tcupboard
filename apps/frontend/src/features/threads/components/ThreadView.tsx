import type { ForumMessage } from "#/types/resources";
import { Link } from "@tanstack/react-router";
import { DraftJsContent } from "../content/render";
import "./thread.css";
import { Avatar } from "#/components/ui/Avatar";
import { ArrowLeft } from "lucide-react";
import { utils } from "#/utils/utils";
import { Gutter } from "#/components/ui/Gutter";
import { ImageGrid } from "./ImageGrid";
import { ScrollToTopButton } from "#/components/ui/ScrollToTop";
import { Editor } from "./Editor";

function ThreadEntry({ message }: { message: ForumMessage }) {
    return (
        <li className="card relative p-4 sm:py-8 flex flex-col sm:flex-row gap-4 sm:gap-8 preset-filled-surface-100-900">
            <div className="flex sm:flex-col items-center justify-between sm:min-w-16 md:min-w-24">
                <div className="flex flex-row sm:flex-col items-center gap-2">
                    <Avatar user={message.author ?? "Unknown User"} className="not-sm:size-8" />
                    <p className="text-surface-600-400">{message.author}</p>
                </div>
                <time className="text-xs italic text-surface-600-400 sm:hidden">
                    {utils.formatDate(message.created_at)}
                </time>
            </div>
            <div>
                <time className="text-xs italic text-surface-600-400 hidden sm:block">
                    {utils.formatDate(message.created_at)}
                </time>
                <div className="_thread-content">
                    <DraftJsContent rawContent={message.content} />
                </div>
                <ImageGrid images={message.images} />
            </div>
        </li>
    );
}

export function ThreadView({ thread, replies }: { thread: ForumMessage; replies: ForumMessage[] }) {
    return (
        <Gutter>
            <main>
                <div className="flex flex-row items-baseline justify-between">
                    <h2 className="h4 mb-4">{thread.title}</h2>
                    <Link
                        to="/threads"
                        from="/threads/$id"
                        className="text-sm anchor flex flex-row gap-2 items-center hover:text-primary-900-100"
                    >
                        <ArrowLeft className="inline size-4" /> <span>Back</span>
                    </Link>
                </div>
                <ul className="flex flex-col gap-4">
                    <ThreadEntry message={thread} />
                    {replies.map((r) => (
                        <ThreadEntry key={r.id} message={r} />
                    ))}
                </ul>
                <Editor />
                <div className="grid place-items-center mt-4">
                    <ScrollToTopButton />
                </div>
            </main>
        </Gutter>
    );
}
