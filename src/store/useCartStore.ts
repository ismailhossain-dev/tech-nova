import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItemState {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  image: string;
  attributes: Record<string, string>;
  quantity: number;
  stockQuantity: number;
}

interface CartStore {
  items: CartItemState[];
  wishlistVariantIds: string[];
  addItem: (item: Omit<CartItemState, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (variantId: string) => void;
  isInWishlist: (variantId: string) => boolean;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlistVariantIds: [],

      addItem: (itemData, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.variantId === itemData.variantId);

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const newQty = updatedItems[existingIndex].quantity + quantity;
          updatedItems[existingIndex].quantity = Math.min(
            newQty,
            itemData.stockQuantity
          );
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...items,
              {
                ...itemData,
                quantity: Math.min(quantity, itemData.stockQuantity),
              },
            ],
          });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleWishlist: (variantId) => {
        const { wishlistVariantIds } = get();
        if (wishlistVariantIds.includes(variantId)) {
          set({
            wishlistVariantIds: wishlistVariantIds.filter((id) => id !== variantId),
          });
        } else {
          set({ wishlistVariantIds: [...wishlistVariantIds, variantId] });
        }
      },

      isInWishlist: (variantId) => {
        return get().wishlistVariantIds.includes(variantId);
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "technova-cart-storage",
    }
  )
);
