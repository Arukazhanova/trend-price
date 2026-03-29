import { AuthProvider } from './auth/AuthProvider.tsx';
import AppRouter from './app/ router.tsx';

export default function App() {
  return (
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
  );
}