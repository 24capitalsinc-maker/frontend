import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        console.log('DEBUG: API Client - Adding token to request:', config.url);
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log('DEBUG: API Client - No token found for request:', config.url);
    }
    return config;
});

export default api;
