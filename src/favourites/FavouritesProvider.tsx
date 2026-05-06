import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

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

    const saveFavourites = (items: FavouriteProduct[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    const addToFavourites = (product: FavouriteProduct) => {
        setFavourites((prev) => {
            const exists = prev.some((item) => item.id === product.id);

            if (exists) {
                return prev;
            }

            const next = [...prev, product];
            saveFavourites(next);

            return next;
        });
    };

    const removeFromFavourites = (id: string) => {
        setFavourites((prev) => {
            const next = prev.filter((item) => item.id !== id);
            saveFavourites(next);

            return next;
        });
    };

    const toggleFavourite = (product: FavouriteProduct) => {
        setFavourites((prev) => {
            const exists = prev.some((item) => item.id === product.id);

            const next = exists
                ? prev.filter((item) => item.id !== product.id)
                : [...prev, product];

            saveFavourites(next);

            return next;
        });
    };

    const isFavourite = (id: string) => {
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