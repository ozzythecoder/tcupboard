import type { Campaign } from "@repo/shared";
import { Link } from "@tanstack/react-router";
import { ExternalLink, X } from "lucide-react";
import { useState } from "react";

const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
const CAMPAIGN_CLOSED_KEY = "campaignHighlightClosed";

export function CampaignHighlightWrapper({ campaign }: { campaign: Campaign }) {
    const closedState = localStorage.getItem(CAMPAIGN_CLOSED_KEY);
    const maxClosedTime = THREE_DAYS;

    const campaignClosed = !!(closedState && Date.now() - Number(closedState) < maxClosedTime);

    if (!campaignClosed) {
        localStorage.removeItem(CAMPAIGN_CLOSED_KEY);
    }

    const handleClose = () => {
        console.log("closed");
        localStorage.setItem(CAMPAIGN_CLOSED_KEY, Date.now().toString());
    };

    return (
        <CampaignHighlightBanner
            campaign={campaign}
            initClosed={campaignClosed}
            onClose={handleClose}
        />
    );
}

export function CampaignHighlightBanner({
    campaign,
    onClose,
    initClosed,
}: {
    campaign: Campaign;
    onClose: () => void;
    initClosed?: boolean;
}) {
    const [closed, setClosed] = useState(initClosed);

    const handleClose = () => {
        onClose();
        setClosed(true);
    };

    return closed ? null : (
        <div
            className="fixed top-0 left-0 z-100 min-w-screen p-2 border-b border-b-surface-900 flex flex-row justify-center"
            style={{ backgroundColor: campaign.theme.background, color: campaign.theme.foreground }}
        >
            <Link
                className="font-base font-bold tracking-wider hover:underline hover:brightness-90 w-full text-center flex flex-row items-center justify-center gap-2"
                to="/campaign"
            >
                {campaign.title} <ExternalLink className="inline size-4" />
            </Link>
            <button className="aspect-square" onClick={handleClose} type="button">
                <X />
            </button>
        </div>
    );
}
