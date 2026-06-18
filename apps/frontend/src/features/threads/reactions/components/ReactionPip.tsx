import { Portal, Tooltip } from "@skeletonlabs/skeleton-react";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Emoji } from "#/components/Emoji";
import { reactionQueries } from "../../reactions.api";
import { usePostReactionContext } from "../actions/context";

interface ReactionListProps {
    postId: number;
}

export function ReactionList({ postId }: ReactionListProps) {
    const { reactToPost, authApi, isMutating, userId } = usePostReactionContext();

    const {
        data: reactions,
        isError,
        isLoading,
    } = useQuery(reactionQueries.getByPostId(postId, authApi));

    if (isLoading) {
        return (
            <span>
                <LoaderCircle className="size-4 animate-spin" />
            </span>
        );
    }

    if (isError || !reactions) {
        return null;
    }

    const data = reactions
        .reduce(
            (ac, cr) => {
                const key = cr.type;
                ac[key] = [...(ac[key] ?? []), { id: cr.userId, username: cr.username }];
                return ac;
            },
            {} as { [x: string]: { id: number; username: string }[] },
        );

    return (
        <ul className="flex flex-row flex-wrap gap-1 mt-2">
            {Object.entries(data).map(([r, metadata]) => {
                return (
                    <ReactionPip
                        key={r}
                        reactionCode={r}
                        selected={metadata.some(e => e.id === userId)}
                        metadata={metadata}
                        isMutating={isMutating}
                        reactToPost={async () => {
                            await reactToPost(
                                {
                                    userId,
                                    postId,
                                    type: r,
                                },
                                metadata,
                            );
                        }}
                    />
                );
            })}
        </ul>
    );
}

interface ReactionPipProps {
    reactToPost: () => Promise<unknown>;
    reactionCode: string;
    selected: boolean;
    metadata: { id: number; username: string }[];
    isMutating: boolean;
}

export function ReactionPip({ reactionCode, selected, isMutating, metadata, reactToPost }: ReactionPipProps) {
    const count = metadata.length;
    const reactors = metadata.slice(0, 6);
    if (count > 6) {
        reactors.push({
            id: -1,
            username: "...",
        });
    }
    return (
        <li>
            <Tooltip>
                <Tooltip.Trigger
                    disabled={isMutating}
                    data-selected={selected}
                    className="chip preset-tonal-surface data-[selected=true]:preset-filled-primary-300-700 flex flex-row items-center justify-center"
                    type="button"
                    onClick={reactToPost}
                >
                    <Emoji code={reactionCode} />
                    {count}
                </Tooltip.Trigger>
                <Portal>
                    <Tooltip.Positioner>
                        <Tooltip.Content className="flex flex-col gap-0.5 card p-1 preset-filled-surface-50-950 transition-all min-w-[5ch]">
                            {reactors.map((u) => {
                                return (
                                    <span
                                        key={u.id}
                                        data-ellipses={u.id === -1}
                                        className="text-xs data-[ellipses=true]:text-surface-400-600"
                                    >
                                        {u.username}
                                    </span>
                                );
                            })}
                            <Tooltip.Arrow className="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-50-950)]">
                                <Tooltip.ArrowTip />
                            </Tooltip.Arrow>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Portal>
            </Tooltip>
        </li>
    );
}
