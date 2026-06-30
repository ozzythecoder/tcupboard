import { createFileRoute, Link } from "@tanstack/react-router";
import { Teapot } from "#/components/Teapot";
import { ThemeSwitch } from "#/components/ui/ThemeSwitch";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <ThemeSwitch className="absolute top-4 right-4" />
            <div className="pt-18 flex flex-col gap-8 max-w-[65ch] md:max-w-[80ch] px-4 mx-auto">
                <div className="flex flex-row justify-between items-end">
                    <h1 className="h1 font-secondary text-4xl flex flex-col gap-1 md:text-6xl gradient-text-warning-800-200!">
                        <span className="text-xl md:text-2xl">The</span>{" "}
                        <span className="block">CUPboard</span>
                    </h1>
                    <Teapot className="size-12 xs:size-20" />
                </div>
                <h2 className="h4 text-balance font-secondary text-surface-800-200 text-shadow-sm">
                    A social platform and resource hub for Twin Cities performers.
                </h2>
                <h3 className="font-secondary font-semibold">
                    Brought to you by{" "}
                    <a
                        href="https://takeactionminnesota.org/twin-cities-united-performers/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="anchor"
                    >
                        Twin Cities United Performers
                    </a>
                </h3>
                <Link
                    to="/threads"
                    className="btn xs:btn-lg w-fit preset-filled-primary-800-200 font-secondary mx-auto"
                >
                    Join the Conversation <ArrowRight />
                </Link>
                <div>
                    <p className="pb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris neque arcu,
                        condimentum nec tempor ut, dapibus in quam. Proin ultricies, sapien a
                        ultrices ultricies, augue tortor cursus sapien, egestas mollis erat odio sit
                        amet magna. Aliquam vitae erat suscipit, commodo lorem egestas, pellentesque
                        metus. Vivamus tempus non neque in pretium. Duis convallis, massa a
                        venenatis ultrices, purus quam laoreet leo, nec iaculis diam enim nec metus.
                    </p>
                    <p>
                        Donec id diam sed lorem fermentum hendrerit. Fusce ipsum risus, feugiat vel
                        enim vel, molestie tristique dolor. Nam nec lectus commodo, viverra odio
                        vitae, tincidunt tellus. Donec sagittis lectus sit amet tellus facilisis
                        dapibus. Maecenas vitae aliquam nunc. Nunc in nisi sapien. Duis egestas
                        ipsum sit amet justo tincidunt, sed facilisis quam facilisis. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            </div>
        </div>
    );
}
