import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './auth/AuthProvider';
import { FavouritesProvider } from './favourites/FavouritesProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <FavouritesProvider>
                <App />
            </FavouritesProvider>
        </AuthProvider>
    </React.StrictMode>,
);