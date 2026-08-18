import type { GlobalFaq } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ErrorComponent } from "#/components/errors";
import { Loading } from "#/components/Loading";
import { Footer } from "#/components/layouts/Footer";
import { Sidebar, ToggleSidebarButton } from "#/components/Sidebar";
import { Gutter } from "#/components/ui/Gutter";
import { api } from "#/config/api";
import { handleHttpError, NotFoundError } from "#/config/error";
import { SiteFaq } from "#/features/faq";

export const Route = createFileRoute("/faq")({
    errorComponent: ErrorComponent,
    component: RouteComponent,
});

function RouteComponent() {
    const { data, isFetching, error } = useQuery({
        queryKey: ["global", "faq"],
        queryFn: async () => {
            try {
                const res = await api.get<GlobalFaq>("globals/faq");
                return await res.json();
            } catch (e) {
                throw handleHttpError(e);
            }
        },
    });

    if (isFetching) return <Loading />;
    if (error) throw error;
    if (!data) throw new NotFoundError();

    return (
        <>
            <Sidebar behavior="hide" />
            <div className="_noisy-background relative min-h-screen">
                <div className="flex flex-row w-full items-center px-8 pb-8">
                    <ToggleSidebarButton hideOnDesktop={false} />
                    <Link className="group w-fit h-fit mx-auto" to="/">
                        <img
                            alt=""
                            className="h-15 w-15 mt-4 mx-auto object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all group-hover:brightness-105"
                            src="/assets/icons/tcuplogo.png"
                        />
                    </Link>
                    <div />
                </div>
                <Gutter>
                    <h1 className="h1">Frequently Asked Questions</h1>
                    <main id="content" tabIndex={-1}>
                        <SiteFaq questions={data?.questions} />
                    </main>
                </Gutter>
            </div>
            <Footer />
        </>
    );
}
