import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    isAdmin?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (credentials) => {
                set({ isLoading: true });
                try {
                    const response = await api.post("/auth/login", credentials);
                    const { token, ...userData } = response.data;

                    // Set the token in axios defaults for all future requests
                    if (token) {
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }

                    set({
                        user: userData,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true });
                try {
                    const response = await api.post("/auth/register", userData);
                    const { token, ...user } = response.data;

                    // Set the token in axios defaults for all future requests
                    if (token) {
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await api.post("/auth/logout");
                } catch (error) {
                    console.error("Logout failed:", error);
                }

                // Remove the token from axios defaults
                delete api.defaults.headers.common['Authorization'];

                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                // When the app reloads, restore the token to axios headers
                if (state?.token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
                }
            },
        }
    )
);
