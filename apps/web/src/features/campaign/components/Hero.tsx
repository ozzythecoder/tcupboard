import type { Campaign } from "@repo/shared";
import { Link } from "@tanstack/react-router";
import { CallToAction } from "./Cta";

export function Hero({ campaign }: { campaign: Campaign }) {
    console.log(campaign);
    
    // TODO - This hard-coded text color could cause trouble later.
    const titleShadow =
        campaign.theme.foreground === "#FFFFFF"
            ? "text-shadow-hard-surface-950"
            : "text-shadow-hard-surface-50";
    
    return (
        <div className="min-h-[90dvh] grid grid-cols-1" data-mode="light">
            {campaign.image && (
                <figure className="max-h-175 pb-12 pt-6">
                    <img
                        alt={campaign.title}
                        className="w-full h-full object-contain"
                        height={700}
                        src={campaign.image}
                        width={1000}
                    />
                </figure>
            )}
            <div className="place-self-end mx-auto flex flex-col gap-4">
                <h1
                    className={`h1 uppercase text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl mx-auto max-w-fit font-caprasimo place-self-end font-normal tracking-normal ${titleShadow}`}
                >
                    {campaign.title}
                </h1>
                {campaign.subtitle && (
                    <h2 className="h4 md:h3 mx-auto text-balance px-4 md:text-right md:max-w-[40ch] tracking-[-0.0125em]">
                        {campaign.subtitle}
                    </h2>
                )}
            </div>
            <div className="place-self-start mx-auto">
                {campaign.call_to_action && <CallToAction cta={campaign.call_to_action} />}
            </div>
        </div>
    );
}
