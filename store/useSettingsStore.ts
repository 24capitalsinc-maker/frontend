import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface SettingsState {
    settings: {
        companyName: string;
        logoText: string;
        logoAccent: string;
        logoUrl: string;
        supportEmail: string;
        isRegistrationEnabled?: boolean;
        socialLinks: {
            twitter?: string;
            linkedin?: string;
            instagram?: string;
            facebook?: string;
        };
    } | null;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: {
        companyName: 'optimanexgen',
        logoText: 'optima',
        logoAccent: 'nexgen',
        logoUrl: '/logo.png',
        supportEmail: 'support@optimanexgen.org',
        isRegistrationEnabled: true,
        socialLinks: {}
    },
    fetchSettings: async () => {
        try {
            const res = await axios.get(`${API_URL}/public/settings`);
            set({ settings: res.data });
        } catch (error) {
            // Fallback defaults
            set({
                settings: {
                    companyName: 'optimanexgen',
                    logoText: 'optima',
                    logoAccent: 'nexgen',
                    logoUrl: '/logo.png',
                    supportEmail: 'support@optimanexgen.org',
                    isRegistrationEnabled: true,
                    socialLinks: {}
                }
            });
        }
    },
}));
