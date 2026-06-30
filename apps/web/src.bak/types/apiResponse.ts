export type Pagination = {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

export type PaginatedResponse<V> = {
    data: V,
    pagination: Pagination
}

export type ApiErrorResponse = {
    message: string;
}

export type ApiResponse<T> = T | ApiErrorResponse
