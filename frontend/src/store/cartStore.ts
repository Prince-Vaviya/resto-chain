import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
    id: string; // MenuItem _id
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,

            addItem: (newItem) => {
                const { items } = get();
                const existingItem = items.find((item) => item.id === newItem.id);

                let updatedItems;
                if (existingItem) {
                    updatedItems = items.map((item) =>
                        item.id === newItem.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    updatedItems = [...items, { ...newItem, quantity: 1 }];
                }

                const total = updatedItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );

                set({ items: updatedItems, total });
            },

            removeItem: (id) => {
                const { items } = get();
                const updatedItems = items.filter((item) => item.id !== id);
                const total = updatedItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
                set({ items: updatedItems, total });
            },

            updateQuantity: (id, quantity) => {
                const { items } = get();
                if (quantity <= 0) {
                    const updatedItems = items.filter((item) => item.id !== id);
                    const total = updatedItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    );
                    set({ items: updatedItems, total });
                    return;
                }

                const updatedItems = items.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                );
                const total = updatedItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
                set({ items: updatedItems, total });
            },

            clearCart: () => set({ items: [], total: 0 }),
        }),
        {
            name: "cart-storage",
        }
    )
);
