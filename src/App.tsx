import { AuthProvider } from "./auth/AuthProvider.tsx";
import { CartProvider } from "./cart/CartProvider";
import AppRouter from "./app/ router.tsx";

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <AppRouter />
            </CartProvider>
        </AuthProvider>
    );
}