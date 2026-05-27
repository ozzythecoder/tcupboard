type Method = "get" | "post" | "put" | "patch" | "delete";
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type ApiFunction = <T = unknown>(input: RequestInfo, json?: Json) => Promise<T>;

const BASE_URL = import.meta.env.VITE_API_URL;

export const api: Record<Method, ApiFunction> = {
    /**
     * Runs a GET request and returns the JSON payload from the response.
     * @param input - The URL or Request object to send the GET request to.
     * @returns A Promise that resolves to the JSON payload from the response.
     */
    async get(input) {
        try {
            const r = await f(input);
            return await r.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async post(input, json) {
        try {
            const r = await f(input, {
                method: "POST",
                body: JSON.stringify(json),
            });
            return await r.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async put(input, json) {
        try {
            const r = await f(input, {
                method: "PUT",
                body: JSON.stringify(json),
            });
            return await r.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async patch(input, json) {
        try {
            const r = await f(input, {
                method: "PATCH",
                body: JSON.stringify(json),
            });
            return await r.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async delete(input) {
        try {
            const r = await f(input, {
                method: "DELETE",
            });
            return await r.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
};

const f = (input: RequestInfo, init?: RequestInit) => {
    return fetch(`${BASE_URL}${input.toString()}`, {
        headers: {
            contentType: "application/json",
        },
        ...init,
    });
};
