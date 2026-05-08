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

const saveCartToStorage = (nextCart: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(readCartFromStorage);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setCartItems((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id
            );

            const nextCart = existingItem
                ? prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                : [...prevCart, { ...product, quantity: 1 }];

            saveCartToStorage(nextCart);

            return nextCart;
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems((prevCart) => {
            const nextCart = prevCart.filter((item) => item.id !== id);

            saveCartToStorage(nextCart);

            return nextCart;
        });
    };

    const increaseQuantity = (id: string) => {
        setCartItems((prevCart) => {
            const nextCart = prevCart.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            saveCartToStorage(nextCart);

            return nextCart;
        });
    };

    const decreaseQuantity = (id: string) => {
        setCartItems((prevCart) => {
            const nextCart = prevCart
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);

            saveCartToStorage(nextCart);

            return nextCart;
        });
    };

    const clearCart = () => {
        setCartItems([]);

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
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