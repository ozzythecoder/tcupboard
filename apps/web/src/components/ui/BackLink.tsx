import {
    type LinkProps,
    type RegisteredRouter,
    useNavigate,
    useRouter,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface Props {
    to?: LinkProps<RegisteredRouter>["to"];
    label?: string;
    variant?: "ghost" | "solid";
}
export function BackLink({ to, label, variant = "ghost" }: Props) {
    const navigate = useNavigate();
    const router = useRouter();
    const handle = () => {
        if (to) {
            navigate({ to });
        } else if (router.history.canGoBack()) {
            router.history.back();
        } else {
            navigate({ to: "/" });
        }
    };

    const variantClasses = {
        solid: "preset-glass-surface-100-900",
        ghost: "anchor hover:bg-primary-200/20 hover:text-surface-950-50",
    } as const satisfies Record<typeof variant, string>;
    return (
        <button
            type="button"
            onClick={handle}
            className={`btn flex flex-row items-center justify-center gap-2 text-xs ${variantClasses[variant]}`}
        >
            <ArrowLeft className="size-3" />
            <span className="sr-only md:not-sr-only">{label ?? "Back"}</span>
        </button>
    );
}
