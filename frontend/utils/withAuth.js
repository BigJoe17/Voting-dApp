import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function withAuth(WrappedComponent, requireAdmin = false) {
  return function ProtectedRoute(props) {
    const { isAuthenticated, isAdmin, checkAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
      async function verify() {
        const isAuthed = await checkAuth();
        if (!isAuthed) {
          router.replace('/login');
        } else if (requireAdmin && !isAdmin) {
          router.replace('/');
        }
      }
      verify();
    }, []);

    if (!isAuthenticated || (requireAdmin && !isAdmin)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}