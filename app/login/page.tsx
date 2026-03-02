"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [demoRole, setDemoRole] = useState<'job_seeker' | 'hr'>('job_seeker');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login/', formData);
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user_role', data.role);

                if (data.role === 'hr') {
                    router.push('/recruiter');
                } else {
                    router.push('/profile');
                }
            } else {
                alert('Invalid credentials. For demo, try your registered accounts.');
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <>
            <Navbar />
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: demoRole === 'hr'
                    ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 100%)'
                    : 'radial-gradient(circle at 50% 50%, rgba(60, 168, 255, 0.1) 0%, transparent 100%)'
            }}>
                <motion.div
                    className="glass-card"
                    style={{ padding: '48px', width: '100%', maxWidth: '450px', borderColor: demoRole === 'hr' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(60, 168, 255, 0.34)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: demoRole === 'hr' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(60, 168, 255, 0.12)',
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto 20px',
                            border: '1px solid var(--border)',
                            transition: 'all 0.5s ease'
                        }}>
                            <LogIn color={demoRole === 'hr' ? 'var(--secondary)' : 'var(--primary)'} size={32} />
                        </div>
                        <h2 style={{ fontSize: '28px' }}>Security Portal</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px' }}>Authenticating for {demoRole === 'hr' ? 'Recruiter Access' : 'Candidate Suite'}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border)' }}>
                        <button
                            type="button"
                            onClick={() => setDemoRole('job_seeker')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: demoRole === 'job_seeker' ? 'var(--primary)' : 'transparent',
                                color: demoRole === 'job_seeker' ? 'white' : 'rgba(255,255,255,0.4)',
                                border: 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            JOB SEEKER
                        </button>
                        <button
                            type="button"
                            onClick={() => setDemoRole('hr')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: demoRole === 'hr' ? 'var(--secondary)' : 'transparent',
                                color: demoRole === 'hr' ? 'white' : 'rgba(255,255,255,0.4)',
                                border: 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            RECRUITER
                        </button>
                    </div>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }}>
                                <UserIcon size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                style={{ paddingLeft: '48px', width: '100%' }}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }}>
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ paddingLeft: '48px', width: '100%' }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{
                                height: '52px',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                background: demoRole === 'hr' ? 'var(--secondary)' : 'var(--primary)'
                            }}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                        Don&apos;t have an account? <a href="/register" style={{ color: demoRole === 'hr' ? 'var(--secondary)' : 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Register</a>
                    </p>
                </motion.div>
            </div>
        </>
    );
}

