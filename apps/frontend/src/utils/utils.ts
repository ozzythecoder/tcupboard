const formatDate = (isoDate: string | Date) => {
    try {
        const date = isDate(isoDate) ? isoDate : new Date(isoDate);
        return formatter.format(date).replace(" at", ",");
    } catch (_) {
        console.warn("could not parse valid date from input:", isoDate);
        return String(isoDate);
    }
};

const formatter = new Intl.DateTimeFormat("en-US", {
    // July 9, 2025
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
});

const isDate = (date: unknown): date is Date => {
    return Object.prototype.toString.call(date) === "[object Date]";
};

const isImagePayload = (
    arr: unknown,
): arr is { url: string; width: number; height: number; publicId: string }[] => {
    if (!Array.isArray(arr)) {
        return false;
    }
    if (arr.length === 0) {
        return false; // can't say for certain
    }

    for (const item of arr) {
        if (typeof item !== "object") {
            return false;
        }
        for (const key in ["url", "width", "height", "publicId"]) {
            if (!(key in item)) {
                return false;
            }
        }
        if (!Number.isNaN(parseInt(item.width, 10)) || !Number.isNaN(parseInt(item.height, 10))) {
            return false;
        }
        if (typeof item.url !== "string") {
            return false;
        }
    }

    return true;
};

const getEmojiCodePoints = (emoji: string) => {
    return Array.from(emoji).map((e) => e.codePointAt(0)?.toString(16));
};

export const utils = {
    formatDate,
    isImagePayload,
    getEmojiCodePoints,
};
