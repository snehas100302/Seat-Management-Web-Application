export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

export interface ApiResponseBody<T = any> {
    code: number;
    message: string;
    errorMsg?: string;
    data: T;
    paginationData?: {
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        totalElements: number;
    };
    accessToken?: string;
    refreshToken?: string;
}

const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('seat_cms_token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    get: async <T>(endpoint: string): Promise<ApiResponseBody<T>> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return response.json();
    },

    post: async <T>(endpoint: string, body?: any): Promise<ApiResponseBody<T>> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            ...(body ? { body: JSON.stringify(body) } : {})
        });
        return response.json();
    },

    put: async <T>(endpoint: string, body: any): Promise<ApiResponseBody<T>> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return response.json();
    },

    patch: async <T>(endpoint: string, body?: any): Promise<ApiResponseBody<T>> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(),
            ...(body ? { body: JSON.stringify(body) } : {})
        });
        return response.json();
    },

    delete: async <T>(endpoint: string): Promise<ApiResponseBody<T>> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return response.json();
    }
};
