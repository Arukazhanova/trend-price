import { useMemo, useState, type ReactNode } from 'react';
import {
    FavouritesContext,
    type FavouriteProduct,
} from './FavouritesContext';

const STORAGE_KEY = 'trend-price-favourites';

export function FavouritesProvider({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    const [favourites, setFavourites] = useState<FavouriteProduct[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const addToFavourites = (product: FavouriteProduct) => {
        setFavourites((prev) => {
            const exists = prev.some((item) => item.id === product.id);
            const next = exists ? prev : [...prev, product];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const removeFromFavourites = (id: number) => {
        setFavourites((prev) => {
            const next = prev.filter((item) => item.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const toggleFavourite = (product: FavouriteProduct) => {
        setFavourites((prev) => {
            const exists = prev.some((item) => item.id === product.id);

            const next = exists
                ? prev.filter((item) => item.id !== product.id)
                : [...prev, product];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const isFavourite = (id: number) => {
        return favourites.some((item) => item.id === id);
    };

    const totalPrice = useMemo(() => {
        return favourites.reduce((sum, item) => {
            const numericPrice = Number(item.price.replace(/[^\d]/g, ''));
            return sum + numericPrice;
        }, 0);
    }, [favourites]);

    return (
        <FavouritesContext.Provider
            value={{
                favourites,
                addToFavourites,
                removeFromFavourites,
                toggleFavourite,
                isFavourite,
                totalPrice,
            }}
        >
            {children}
        </FavouritesContext.Provider>
    );
}