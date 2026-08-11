import { createFileRoute } from "@tanstack/react-router";
import { ErrorComponent } from "#/components/errors";
import { ActionLinks } from "#/components/front-page/ActionLinks";
import { Hero } from "#/components/front-page/Hero";
import { Intro } from "#/components/front-page/Intro";
import { Footer } from "#/components/layouts/Footer";
import { ThemeSwitch } from "#/components/ui/ThemeSwitch";
import { FrontPageCampaignHighlight } from "#/features/campaign/components/FrontPageCampaignHighlight";

export const Route = createFileRoute("/")({
    component: RouteComponent,
    errorComponent: ErrorComponent,
});

function RouteComponent() {
    return (
        <div className="_noisy-background min-h-dvh flex flex-col justify-between">
            <div className="pt-18 pb-24 relative flex flex-col gap-8 max-w-[65ch] md:max-w-[80ch] px-4 mx-auto">
                <ThemeSwitch className="absolute top-4 right-4" />
                <main
                    className="flex flex-col gap-8 max-w-[65ch] md:max-w-[80ch] px-4 mx-auto"
                    id="content"
                    tabIndex={-1}
                >
                    <Hero />
                    <FrontPageCampaignHighlight />
                    <ActionLinks />
                    <Intro />
                </main>
            </div>
            <Footer />
        </div>
    );
}
