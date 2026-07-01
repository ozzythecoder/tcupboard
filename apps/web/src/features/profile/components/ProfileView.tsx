import type { User } from "@repo/shared";
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useAuth0Context } from "#/config/auth-context";
import { utils } from "#/utils/utils";
import "./ProfileView.css";
import "#/features/editor/styles/RichText.css";
import { RichTextContent } from "#/features/editor";

export function ProfileView({ user }: { user: User }) {
    const { user: authUser, isLoading } = useAuth0Context();
    const isMe = authUser && authUser.id === user.id;
    const editReady = !isLoading && isMe;
    const joinedDate = utils.formatDate(user.createdAt ?? "", { dateStyle: "long" });
    return (
        <div className="my-6 relative">
            <div className="card h-70 xs:min-h-50 max-h-70 pr-4 xs:pr-6 preset-glass-primary-200-800 grid grid-cols-[auto_1fr] overflow-hidden">
                <div className="flex flex-col items-end justify-between py-6 text-right order-last">
                    <div className="flex flex-col grow">
                        <h3 className="text-right h1 font-secondary _username-heading z-10 sm:text-shadow-hard-surface-50-950 text-shadow-hard-surface-950 text-surface-50 sm:text-surface-950-50">
                            {user.username}
                        </h3>
                        <p className="italic font-semibold text-2xl text-surface-200 text-shadow-hard-surface-900  xs:text-surface-800-200 xs:text-shadow-hard-surface-100-900">
                            {user.tagline}
                        </p>
                    </div>
                    <span className="text-surface-50 xs:text-surface-800-200">
                        Joined {joinedDate}
                    </span>
                </div>
                {editReady && (
                    <Link
                        to="/profile/edit"
                        className="btn py-1 px-2 absolute top-2 left-2 text-sm preset-filled-primary-400-600 hidden md:flex flex-row gap-2"
                    >
                        <Pencil className="size-4" />
                        Edit
                    </Link>
                )}
                {user.avatarUrl ? (
                    <div className="rounded-container xs:rounded-r-none overflow-hidden">
                        <img
                            className="absolute w-full h-full top-0 left-0 -z-20 brightness-50 object-cover xs:max-w-2xs xs:brightness-100"
                            src={user.avatarUrl}
                            alt=""
                        />
                    </div>
                ) : (
                    <div />
                )}
            </div>
            <div className="flex flex-col mt-4 gap-4">
                {editReady && (
                    <Link
                        to="/profile/edit"
                        className="btn py-1 px-2 preset-filled-primary-400-600 md:hidden flex flex-row gap-2"
                    >
                        <Pencil className="size-4 inline" />
                        Edit Profile
                    </Link>
                )}
                {user.bio && (
                    <div className="card preset-glass-surface-100-900 mt-4 p-4 mx-auto w-full">
                        <div className="_rich-text-content font-secondary">
                            <RichTextContent content={user.bio} />
                        </div>
                    </div>
                )}
                {import.meta.env.DEV && (
                    <details>
                        <summary>code response</summary>
                        <code className="wrap-break-word text-xs">
                            {JSON.stringify(user, null, 2)}
                        </code>
                    </details>
                )}
            </div>
        </div>
    );
}
