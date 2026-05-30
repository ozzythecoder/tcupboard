const formatDate = (isoDate: string) => {
    try {
        const date = new Date(isoDate);
        return formatter.format(date)
    } catch (_) {
        console.warn("could not parse valid date from input:", isoDate);
        return isoDate;
    }
};

const formatter = new Intl.DateTimeFormat('en-US', {
    // July 9, 2025 
    month: "long",
    day: "numeric",
    year: "numeric",
})

export const utils = {
    formatDate
}