import { useState } from "react";

export function ThemeSwitch() {
    const [checked, setChecked] = useState(!(localStorage.getItem("mode") === "light"));

    const onCheckedChange = (e: { checked: boolean }) => {
        const mode = e.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-mode", mode);
        localStorage.setItem("mode", mode);
        setChecked(e.checked);
    };

    return (
        <label className="flex flex-row justify-between items-center">
            Dark Mode
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onCheckedChange(e.currentTarget)}
            />
        </label>
    );
}
