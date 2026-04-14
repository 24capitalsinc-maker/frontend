import { create } from 'zustand';

interface AuthState {
    user: any | null;
    accessToken: string | null;
    isInitialized: boolean;
    setAuth: (user: any, accessToken: string, refreshToken: string) => void;
    setUser: (user: any) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    isInitialized: false,
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
    initialize: () => {
        const { accessToken } = get();

        if (!accessToken) {
            // No access token at all — clear everything
            get().logout();
            set({ isInitialized: true });
            return;
        }

        try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const isExpired = Date.now() >= payload.exp * 1000;
            const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

            if (isExpired && !refreshToken) {
                // Both tokens gone — force clean logout
                get().logout();
            }
            // If expired but refresh token exists, the api.ts interceptor will handle it on first request
        } catch (e) {
            // Malformed token — clear the session
            get().logout();
        }

        set({ isInitialized: true });
    },
}));
