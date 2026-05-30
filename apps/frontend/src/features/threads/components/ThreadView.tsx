import type { ForumMessage } from "#/types/resources";

function ThreadEntry({ message }: { message: ForumMessage }) {
    return (
        <div>
            {message.author}
        </div>
    );
}

export function ThreadView({ thread, replies }: { thread: ForumMessage; replies: ForumMessage[] }) {
    console.log("REPLIES:", replies)
    return (
        <div>
            <ul>
                <li>
                    <ThreadEntry message={thread} />
                </li>
                {replies.map((r) => (
                    <li key={r.id}>
                        <ThreadEntry message={r} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
