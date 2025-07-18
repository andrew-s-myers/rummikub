// src/context/ProtectedRoute.tsx
import { Navigate } from 'react-router';
import type { ReactElement } from 'react';   // ← type-only import
import { useAuth } from './AuthContext';

interface Props {
    children: ReactElement;
}

export default function ProtectedRoute({ children }: Props) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" replace />;
}

// May adjust to <below> if wanting to pass more than just 1 ReactElement as children
// import { Navigate } from 'react-router';
// import type { ReactNode } from 'react';
// import { useAuth } from './AuthContext';

// export default function ProtectedRoute({ children }: { children: ReactNode }) {
//   return useAuth().user ? children : <Navigate to="/" replace />;
// }
