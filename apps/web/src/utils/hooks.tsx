import { useEffect, useState } from "react";

export const useScrollLock = () =>
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

export const useError = () => {
    const [error, setError] = useState<string | null>(null);

    const clearError = () => {
        setError(null);
    };

    const ErrorMessage = () => {
        return error ? <span className="text-error-600-400 bold">{error}</span> : null;
    };

    // returns
    //  - error state get & set
    //  - boundary component
    //  - error rendering component
    //  - other hook(s?) to reset state

    return {
        error,
        setError,
        clearError,
        ErrorMessage,
    };
};
