type Method = "get" | "post" | "put" | "patch" | "delete";
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type ApiFunction = <T = unknown>(input: RequestInfo, json?: Json) => Promise<T>;

const BASE_URL = import.meta.env.VITE_API_URL;
const VERBOSE = import.meta.env.DEV;

type ApiSkeleton = Record<Method, ApiFunction>;

export const api: ApiSkeleton = {
    async get(input) {
        try {
            const r = await _fetch(input);
            return await r.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async post(input, json) {
        try {
            const r = await _fetch(input, {
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
            const r = await _fetch(input, {
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
            const r = await _fetch(input, {
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
            const r = await _fetch(input, {
                method: "DELETE",
            });
            return await r.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
};

const _fetch = (input: RequestInfo, init?: RequestInit) => {
    return fetch(`${BASE_URL}${input.toString()}`, init);
};

////////////////////////////////////////////////////////////////////////

type GetToken = () => Promise<string>;
type JsonBody = Record<string, unknown> | unknown[];

interface RequestOptions {
    headers?: Record<string, string>;
}

interface ApiInstance {
    get<T = unknown>(path: string, options?: RequestOptions): Promise<T>;
    post<T = unknown>(path: string, body?: JsonBody, options?: RequestOptions): Promise<T>;
    put<T = unknown>(path: string, body?: JsonBody, options?: RequestOptions): Promise<T>;
    patch<T = unknown>(path: string, body?: JsonBody, options?: RequestOptions): Promise<T>;
    delete<T = unknown>(path: string, options?: RequestOptions): Promise<T>;
}

async function parseResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const message = await res.text().catch(() => res.statusText);
        throw new ApiError(res.status, message);
    }
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
        return undefined as T;
    }
    return res.json() as Promise<T>;
}

async function request<T>(
    getToken: GetToken | undefined,
    path: string,
    init: RequestInit = {},
    options: RequestOptions = {}
): Promise<T> {
    const token = getToken ? await getToken() : null;
    const fullPath = `${BASE_URL}${path}`

    if (VERBOSE) {
        const method = init.method ?? "GET"
        console.debug(`REQUEST OUT --- ${method} ${fullPath}`)
        if (init.body) {
            console.debug(init.body)
        }
    }

    const res = await fetch(fullPath, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
            ...options.headers,
            ...init.headers,
        },
    });

    return parseResponse<T>(res);
}

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

export function createApi(getToken?: GetToken): ApiInstance {
    return {
        get<T>(path: string, options?: RequestOptions) {
            return request<T>(getToken, path, { method: "GET" }, options);
        },
        post<T>(path: string, body?: JsonBody, options?: RequestOptions) {
            return request<T>(getToken, path, { method: "POST", body: JSON.stringify(body) }, options);
        },
        put<T>(path: string, body?: JsonBody, options?: RequestOptions) {
            return request<T>(getToken, path, { method: "PUT", body: JSON.stringify(body) }, options);
        },
        patch<T>(path: string, body?: JsonBody, options?: RequestOptions) {
            return request<T>(getToken, path, { method: "PATCH", body: JSON.stringify(body) }, options);
        },
        delete<T>(path: string, options?: RequestOptions) {
            return request<T>(getToken, path, { method: "DELETE" }, options);
        },
    };
}
