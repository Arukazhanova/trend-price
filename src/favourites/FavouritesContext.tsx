import { createContext } from 'react';

export type FavouriteProduct = {
    id: string;
    priceId?: string;
    title: string;
    subtitle: string;
    price: string;
    oldPrice?: string;
    discount?: string;
    image?: string;
};

export type FavouritesContextType = {
    favourites: FavouriteProduct[];
    addToFavourites: (product: FavouriteProduct) => void;
    removeFromFavourites: (id: string) => void;
    toggleFavourite: (product: FavouriteProduct) => void;
    isFavourite: (id: string) => boolean;
    totalPrice: number;
};

export const FavouritesContext =
    createContext<FavouritesContextType | undefined>(undefined);