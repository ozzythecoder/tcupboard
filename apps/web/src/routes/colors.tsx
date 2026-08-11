import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/colors")({
    component: RouteComponent,
});

type Theme = {
    name: string;
    value: string;
    fg: string;
    bg: string;
};

const TEXT_DARK = "oklch(0.145 0 0)";
const TEXT_LIGHT = "oklch(1 0 0)";

const THEMES = [
    {
        name: "Medium Purple",
        value: "medium_purple",
        bg: "oklch(73.71% 0.17 299)",
        fg: TEXT_DARK,
    },
    {
        name: "Smoke White",
        value: "smoke_white",
        bg: "oklch(95% 0.09 0)",
        fg: TEXT_DARK,
    },
    {
        name: "Chateau Green",
        value: "chateau_green",
        bg: "oklch(69.66% 0.15 150)",
        fg: TEXT_DARK,
    },
    {
        name: "Riptide",
        value: "riptide",
        bg: "oklch(84.34% 0.09 191)",
        fg: TEXT_DARK,
    },
    {
        name: "Las Palmas",
        value: "las_palmas",
        bg: "oklch(87.23% 0.21 124)",
        fg: TEXT_DARK,
    },
    {
        name: "Persimmon",
        value: "persimmon",
        bg: "oklch(71.95% 0.18 36)",
        fg: TEXT_DARK,
    },
    {
        name: "Marigold Yellow",
        value: "marigold_yellow",
        bg: "oklch(91.82% 0.13 101)",
        fg: TEXT_DARK,
    },
    {
        name: "Valentino",
        value: "valentino",
        bg: "oklch(22.54% 0.11 315)",
        fg: TEXT_LIGHT,
    },
    {
        name: "Purple Reign",
        value: "purple_reign",
        bg: "oklch(39.97% 0.07 314)",
        fg: TEXT_LIGHT
    },
    {
        name: "Zucchini",
        value: "zucchini",
        bg: "oklch(33.36% 0.07 157)",
        fg: TEXT_LIGHT,
    },
    {
        name: "Poseidon",
        value: "poseidon",
        bg: "oklch(22.84% 0.03 235)",
        fg: TEXT_LIGHT,
    },
    {
        name: "Deep Bronze",
        value: "deep_bronze",
        bg: "oklch(34.26% 0.09 84)",
        fg: TEXT_LIGHT,
    },
    {
        name: "Creole",
        value: "creole",
        bg: "oklch(20.26% 0.2 90)",
        fg: TEXT_LIGHT,
    },
    {
        name: "Night",
        value: "night",
        bg: "oklch(13% 0.02 310)",
        fg: TEXT_LIGHT
    },
] as const satisfies ReadonlyArray<Theme>;

function RouteComponent() {
    return (
        <div className="grid grid-cols-5 gap-2 bg-neutral-200 min-h-screen">
            {THEMES.map((t) => (
                <div
                    className="h-36 w-36 grid place-items-center"
                    style={{ backgroundColor: t.bg, color: t.fg }}
                >
                    <span style={{ color: t.fg }}>{t.name}</span>
                </div>
            ))}

            <div className="h-36 w-36" />
        </div>
    );
}
