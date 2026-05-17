import { CartProvider } from "./cart/CartProvider";
import AppRouter from "./app/ router.tsx";

export default function App() {
    return (
        <CartProvider>
            <AppRouter />
        </CartProvider>
    );
}