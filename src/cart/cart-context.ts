import { createContext } from 'react';

export type CartItem = {
    id: string;
    title: string;
    price: number;
    currency: string;
    quantity: number;
    subtitle?: string;
    oldPrice?: number;
    image?: string;
};

export type CartContextType = {
    cartItems: CartItem[];
    totalQuantity: number;
    addToCart: (product: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    clearCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);