import type { CampaignCTA } from "@repo/shared";
import { ArrowRight } from "lucide-react";
import { Gutter } from "#/components/ui/Gutter";

interface Props {
    cta: CampaignCTA;
}

export function CallToAction({ cta }: Props) {
    const bgColor = cta.theme ?? "var(--campaign-bg-color)";

    return (
        // @ts-expect-error `--bg-color` is a valid css variable
        <div className="min-h-75 grid place-items-center" style={{ "--bg-color": bgColor }}>
            <Gutter width={60}>
                <h2 className="h3">{cta.callout}</h2>
                <a
                    className="btn btn-lg preset-filled-surface-950-50 font-bold w-full drop-shadow-hard-surface-800"
                    href={cta.url}
                    id="cta-action"
                >
                    {cta.action}
                    <ArrowRight />
                </a>
            </Gutter>
        </div>
    );
}
