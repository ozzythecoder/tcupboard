import axios from "axios";

export const api = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

export const getProtectedApi = (token: string) =>
    axios.create({
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
