import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { FOOTER_NAVIGATION_LINKS } from "#/config/links";

export function Footer() {
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
        <footer className="min-h-36 pt-12 bg-neutral-800 text-neutral-100 font-base">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-26 mx-[15%] lg:mx-auto lg:max-w-185">
                <div className="not-md:order-2 flex flex-col-reverse gap-4 lg:flex-row lg:justify-between">
                    <Link className="group w-fit h-fit mx-auto" to="/">
                        <img
                            alt=""
                            className="px-4 object-contain mx-auto transition-all brightness-95 group-hover:brightness-105"
                            height={150}
                            src="/assets/icons/tcuplogo.png"
                            width={150}
                        />
                    </Link>
                    <div className="flex flex-col lg:text-right">
                        <div>Twin Cities United Performers</div>
                        <div>Take Action Minnesota</div>
                    </div>
                </div>
                <div className="not-md:order-1">
                    <ul className="flex flex-col gap-2">
                        {FOOTER_NAVIGATION_LINKS.map((link) => (
                            <Link
                                className="text-neutral-300 hover:text-neutral-50"
                                key={link.text}
                                to={link.to}
                            >
                                {link.text}
                            </Link>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="grid place-items-center py-8 text-neutral-400 text-sm italic">
                &copy; {currentYear} Twin Cities United Performers
            </div>
        </footer>
    );
}
