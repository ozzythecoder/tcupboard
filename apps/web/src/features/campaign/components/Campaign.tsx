import type { Campaign as ICampaign } from "@repo/shared";
import { Footer } from "#/components/layouts/Footer";
import { Block } from "./Block";
import { Hero } from "./Hero";

export function CampaignView({ campaign }: { campaign: ICampaign }) {
    const bgColor = campaign.theme.background;
    const fgColor = campaign.theme.foreground;
    const footerPadding = !campaign.show_footer ? "pb-24" : ""

    return (
        <div>
            <div
                className={`min-h-screen _uncontrolled pt-4 ${footerPadding}`}
                style={{
                    backgroundColor: bgColor,
                    color: fgColor,
                    colorScheme: "light",
                    // @ts-expect-error valid css variable
                    "--campaign-bg-color": bgColor,
                }}
            >
                <Hero campaign={campaign} />
                {campaign.blocks.map((b) => (
                    <Block block={b} key={b.id} />
                ))}
            </div>
            {campaign.show_footer && <Footer />}
        </div>
    );
}
