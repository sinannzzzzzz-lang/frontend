const API_URL = 'http://localhost:8000/api';

export const fetcher = async (endpoint: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && typeof window !== 'undefined') {
        // Handle token refresh or logout
        localStorage.removeItem('access_token');
        // window.location.href = '/login';
    }

    return response;
};

export const api = {
    get: (endpoint: string) => fetcher(endpoint, { method: 'GET' }),
    post: (endpoint: string, data: any) => fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    upload: (endpoint: string, formData: FormData, method: string = 'POST') => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        return fetch(`${API_URL}${endpoint}`, {
            method: method,
            body: formData,
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            }
        });
    },
    put: (endpoint: string, data: any) => fetcher(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (endpoint: string) => fetcher(endpoint, { method: 'DELETE' }),
};

