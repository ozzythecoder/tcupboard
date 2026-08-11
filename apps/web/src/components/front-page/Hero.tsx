import { Fragment } from "react/jsx-runtime";
import { Teapot } from "../Teapot";

export function Hero() {
    return (
        <Fragment>
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
                    className="anchor"
                    href="https://takeactionminnesota.org/twin-cities-united-performers/"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Twin Cities United Performers
                </a>
            </h3>
        </Fragment>
    );
}
