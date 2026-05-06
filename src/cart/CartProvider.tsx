import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { CartContext } from './cart-context';
import type { CartItem } from './cart-context';

const CART_STORAGE_KEY = 'trend-price-cart';

const readCartFromStorage = (): CartItem[] => {
    try {
        const rawCart = localStorage.getItem(CART_STORAGE_KEY);

        if (!rawCart) {
            return [];
        }

        const parsedCart = JSON.parse(rawCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart;
    } catch (error) {
        console.log('CART READ ERROR:', error);
        return [];
    }
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(readCartFromStorage);

    const saveCart = (nextCart: CartItem[]) => {
        setCartItems(nextCart);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
    };

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        const existingItem = cartItems.find((item) => item.id === product.id);

        const nextCart = existingItem
            ? cartItems.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
            : [...cartItems, { ...product, quantity: 1 }];

        saveCart(nextCart);
    };

    const removeFromCart = (id: string) => {
        const nextCart = cartItems.filter((item) => item.id !== id);
        saveCart(nextCart);
    };

    const increaseQuantity = (id: string) => {
        const nextCart = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );

        saveCart(nextCart);
    };

    const decreaseQuantity = (id: string) => {
        const nextCart = cartItems
            .map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0);

        saveCart(nextCart);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const totalQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                totalQuantity,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}