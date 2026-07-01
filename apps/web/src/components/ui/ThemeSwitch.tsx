import { Moon, Sun } from "lucide-react";
import { useState } from "react";

interface Props {
    className?: string;
}

export function ThemeSwitch({ className }: Props) {
    const [isDarkMode, setDarkMode] = useState(!(localStorage.getItem("mode") === "light"));

    const onCheckedChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const newMode = isDarkMode ? "light" : "dark";
        document.documentElement.setAttribute("data-mode", newMode);
        localStorage.setItem("mode", newMode);
        setDarkMode(newMode === "dark");
    };

    return (
        <label className={className}>
            <span className="sr-only">Dark Mode</span>
            <button
                className="w-fit text-surface-800-200"
                onClick={onCheckedChange}
                title="Toggle dark mode"
                type="button"
            >
                {isDarkMode ? <Moon /> : <Sun />}
            </button>
        </label>
    );
}
