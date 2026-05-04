import { CartProvider } from "./cart/CartProvider";
import AppRouter from "./app/ router.tsx";
import FloatingAIButton from "./ components/FloatingAIButton/FloatingAIButton";
export default function App() {
    return (
        <CartProvider>
            <AppRouter />
            <FloatingAIButton />
        </CartProvider>
    );
}