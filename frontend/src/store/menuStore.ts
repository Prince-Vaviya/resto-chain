import { create } from "zustand";
import api from "../lib/api";

interface Category {
    _id: string;
    name: string;
}

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category_id: Category;
    is_available: boolean;
}

interface MenuState {
    categories: Category[];
    items: MenuItem[];
    isLoading: boolean;
    error: string | null;
    fetchMenu: () => Promise<void>;
    fetchCategories: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
    categories: [],
    items: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get("/menu/categories");
            set({ categories: response.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch categories", isLoading: false });
        }
    },

    fetchMenu: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get("/menu/items");
            set({ items: response.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch menu items", isLoading: false });
        }
    },
}));
