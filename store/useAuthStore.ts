import { create } from 'zustand';

interface AuthState {
    user: any | null;
    accessToken: string | null;
    setAuth: (user: any, accessToken: string, refreshToken: string) => void;
    setUser: (user: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, accessToken });
    },
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null });
    },
}));
