import { createContext } from "react";

export type CartItem = {
    id: number;
    title: string;
    subtitle: string;
    price: string;
    oldPrice?: string;
    discount?: string;
    quantity: number;
};

export type CartContextType = {
    cartItems: CartItem[];
    addToCart: (product: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: number) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
};

export const CartContext = createContext<CartContextType | null>(null);