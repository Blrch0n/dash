"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            setIsAuthed(authenticated);
            setIsLoading(false);
            
            if (!authenticated) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Only render children if authenticated
    return isAuthed ? children : null;
};

export default ProtectedRoute;
