"use client";
import { useState, useEffect } from 'react';

import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'job_seeker' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/auth/register/', formData);
            const data = await res.json();

            if (res.ok) {
                // Auto-login after registration
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user_role', data.role);

                if (data.role === 'hr') {
                    router.push('/recruiter');
                } else {
                    router.push('/profile');
                }
            } else {
                // Handle validation errors
                const errorMsg = data.username ? `Username: ${data.username[0]}` :
                    data.email ? `Email: ${data.email[0]}` :
                        data.password ? `Password: ${data.password[0]}` :
                            "Registration failed. Please try again.";
                setError(errorMsg);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to server. Please check if backend is running.");
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
                background: 'radial-gradient(circle at 50% 50%, rgba(60, 168, 255, 0.08) 0%, transparent 100%)'
            }}>
                <motion.div
                    className="glass-card"
                    style={{ padding: '48px', width: '100%', maxWidth: '450px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(60, 168, 255, 0.12)',
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto 20px',
                            border: '1px solid var(--border)'
                        }}>
                            <UserPlus color="var(--primary)" size={32} />
                        </div>
                        <h2 style={{ fontSize: '28px' }}>Create Account</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px' }}>Start your AI-powered career journey</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                color: 'var(--accent)',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                marginBottom: '24px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                border: '1px solid rgba(244, 63, 94, 0.2)'
                            }}
                        >
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'job_seeker' })}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: formData.role === 'job_seeker' ? 'rgba(60, 168, 255, 0.12)' : 'transparent',
                                    color: formData.role === 'job_seeker' ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Job Seeker
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'hr' })}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: formData.role === 'hr' ? 'rgba(60, 168, 255, 0.12)' : 'transparent',
                                    color: formData.role === 'hr' ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                HR / Recruiter
                            </button>
                        </div>

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
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
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


                        <button type="submit" className="btn-primary" style={{ height: '52px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Register <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                        Already have an account? <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login</a>
                    </p>
                </motion.div>
            </div>
        </>
    );
}
