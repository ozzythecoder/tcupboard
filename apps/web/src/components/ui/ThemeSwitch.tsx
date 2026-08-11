import { Portal, Tooltip } from "@skeletonlabs/skeleton-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

interface Props {
    className?: string;
}

export function ThemeSwitch({ className }: Props) {
    const [isDarkMode, setDarkMode] = useState(!(localStorage.getItem("mode") === "light"));

    useHotkey("T", () => {
        changeTheme();
    });

    const changeTheme = () => {
        const newMode = isDarkMode ? "light" : "dark";
        document.documentElement.setAttribute("data-mode", newMode);
        localStorage.setItem("mode", newMode);
        setDarkMode(newMode === "dark");
    };

    return (
        <Tooltip positioning={{ placement: "bottom" }}>
            <Tooltip.Trigger
                aria-label="Toggle dark mode"
                className={`w-fit text-surface-800-200 ${className}`}
                id="theme-switch"
                onClick={changeTheme}
                type="button"
            >
                {isDarkMode ? <Moon aria-hidden /> : <Sun aria-hidden />}
            </Tooltip.Trigger>
            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Content className="text-xs">
                        <kbd className="kbd text-xs text-surface-800-200 mr-1">T</kbd> Switch theme
                    </Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip>
    );
}
