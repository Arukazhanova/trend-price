import { createContext } from 'react';

export type FavouriteProduct = {
    id: number;
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
    removeFromFavourites: (id: number) => void;
    toggleFavourite: (product: FavouriteProduct) => void;
    isFavourite: (id: number) => boolean;
    totalPrice: number;
};

export const FavouritesContext =
    createContext<FavouritesContextType | undefined>(undefined);