import { useEffect } from "react";

export const useScrollLock = () =>
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);
