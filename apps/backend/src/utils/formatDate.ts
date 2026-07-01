export const formatDate = (isoDate: string | Date) => {
    try {
        const date = isDate(isoDate) ? isoDate : new Date(isoDate);
        return formatter.format(date).replace(/at\s+|,/g, "");
    } catch (_) {
        console.warn("could not parse valid date from input:", isoDate);
        return String(isoDate);
    }
};

const formatter = new Intl.DateTimeFormat("en-US", {
    // July 9, 2025
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    fractionalSecondDigits: 2,
});

const isDate = (date: unknown): date is Date => {
    return Object.prototype.toString.call(date) === "[object Date]";
};
