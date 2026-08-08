import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle, Megaphone } from "lucide-react";
import { campaignQueries } from "../campaign.api";
import "./FrontPageCampaign.css";

export function FrontPageCampaignHighlight() {
    const { data, isFetching, error } = useQuery({
        ...campaignQueries.highlighted(),
        throwOnError: false,
    });

    if (isFetching) {
        return (
            <div className="mx-auto">
                <LoaderCircle className="animate-spin size-28" />
            </div>
        );
    }

    if (!data || error) {
        return (
            <div className="h-42 sm:h-28 _campaign-highlight-gradient flex flex-row items-center justify-center rounded-md">
                <h3 className="h3 px-2">Minnesota musicians are building power.</h3>
            </div>
        );
    }

    return (
        <div
            className="card relative p-4 flex flex-col transition-all hover:brightness-110 drop-shadow-[0_4px_16px_var(--color-amber-300)]"
            style={{
                border: `1px solid color-mix(in oklch, ${data.theme.background} 90%, var(--color-surface-50-950))`,
                backgroundImage: `linear-gradient(to right, ${data.theme.background} 10%, ${getGradientStop(data.theme.background)} 90%)`,
                color: data.theme.foreground,
            }}
        >
            <Link
                className="h3 anchor flex flex-col xs:flex-row justify-between items-center gap-2"
                id="campaign-highlight-link"
                params={{ slug: data.slug }}
                to="/campaign/$slug"
            >
                <Megaphone className="size-8" />
                <span className="max-w-fit">{data.title}</span>
                <ArrowRight className="size-8 hidden xs:block" />
            </Link>
            <p className="font-bold text-center text-lg">{data.subtitle}</p>
        </div>
    );
}

/**
 * Derives a gradient stop color based on the lightness of the passed color.
 *
 * Dark colors return a slightly lighter color, light colors return a slightly darker color.
 * Colors with less than 0.5 luminance are considered dark.
 *
 * @param bgColor - a string representing an oklch color, i.e. `oklch(0.2 0.2 90)`
 */
function getGradientStop(bgColor: string) {
    const lch = bgColor.slice(bgColor.indexOf("(") + 1, bgColor.indexOf(")")).split(" ");

    if (lch.length !== 3) {
        console.warn(`Couldn't parse a valid oklch value from ${bgColor}`);
        return bgColor;
    }

    const [l, c, h] = lch.map((v) => {
        // if v is a percentage, convert to decimal
        if (v.includes("%")) {
            return parseFloat((Number(v.slice(0, v.indexOf("%"))) / 100).toFixed(2));
        } else {
            return Number(v);
        }
    });

    if (Number.isNaN(l) || Number.isNaN(c) || Number.isNaN(h)) {
        console.warn(`Couldn't parse a valid oklch value from ${bgColor}`);
        return bgColor;
    }

    return l < 0.5 ? `oklch(${l + 0.15} ${c} ${h})` : `oklch(${l - 0.2} ${c} ${h})`;
}
