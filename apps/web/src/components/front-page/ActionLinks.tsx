import { Link } from "@tanstack/react-router";
import { Info, MessagesSquare, Newspaper } from "lucide-react";

export function ActionLinks() {
    return (
        <div className="flex flex-col md:flex-row justify-evenly gap-4">
            <Link
                className="card btn preset-filled-tertiary-600-400 p-2 w-full shadow hover:shadow-lg active:shadow-none"
                to="/faq"
            >
                Who are we? <Info />
            </Link>
            <Link
                className="card btn preset-filled-primary-700-300 p-2 w-full shadow hover:shadow-lg active:shadow-none"
                to="/updates"
            >
                What's new at TCUP <Newspaper />
            </Link>
            <Link
                className="card btn preset-filled-secondary-700-300 p-2 w-full shadow hover:shadow-lg active:shadow-none"
                to="/threads"
            >
                TCUPboard chat <MessagesSquare />
            </Link>
        </div>

    )
}