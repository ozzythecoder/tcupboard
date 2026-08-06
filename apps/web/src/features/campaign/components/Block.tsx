import type { CampaignBlock } from "@repo/shared";
import "./Block.css";
import { Gutter } from "#/components/ui/Gutter";
import { RichTextContent } from "#/features/editor";

export function Block({ block }: { block: CampaignBlock }) {
    const bgColor = block.item?.theme?.background ?? "var(--campaign-bg-color)";
    const textColor = block.item?.theme?.foreground ?? "var(--campaign-fg-color)";

    return (
        <div
            className="_block py-16"
        // @ts-expect-error valid css variables
            style={{ "--block-bg-color": bgColor, "--block-fg-color": textColor }}
        >
            <Gutter width={60}>
                <div className="_block-content md:mx-auto">
                    <RichTextContent content={block.item?.content} />
                </div>
            </Gutter>
        </div>
    );
}
