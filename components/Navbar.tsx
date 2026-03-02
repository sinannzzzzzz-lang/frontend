"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem('access_token');
            setIsLoggedIn(!!token);
            setRole(localStorage.getItem('user_role'));
        };

        checkLogin();
        // Listen for storage changes
        window.addEventListener('storage', checkLogin);

        // Custom event for same-tab login updates
        window.addEventListener('login-update', checkLogin);

        return () => {
            window.removeEventListener('storage', checkLogin);
            window.removeEventListener('login-update', checkLogin);
        };
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        router.push('/');
        router.refresh(); // Force re-render
    };

    return (
        <nav className="top-nav">
            <Link href="/" className="brand-link">
                <div className="brand-mark">AIVault</div>
            </Link>

            <div className="nav-links">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/jobs" className="nav-link">Job Market</Link>

                {isLoggedIn ? (
                    <>
                        <Link href={role === 'hr' ? '/recruiter' : '/profile'} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={16} /> {role === 'hr' ? 'Dashboard' : 'Profile'}
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="btn-outline nav-cta"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="nav-link">Login</Link>
                        <Link href="/register" className="btn-primary nav-cta">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
