"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { Users, Briefcase, BarChart3, TrendingUp, Filter, Plus, Upload, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function RecruiterDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    useEffect(() => {
        fetchStats();
        fetchProfile();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/recruiter/analytics/');
            if (res.ok) setStats(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile/');
            if (res.ok) setProfile(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = async (appId: number, status: string) => {
        try {
            const res = await api.post(`/recruiter/applications/${appId}/status/`, { status });
            if (res.ok) {
                alert(`Candidate ${status}ed successfully! Email sent.`);
                fetchStats();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let res;
            if (logoFile) {
                const formData = new FormData();
                formData.append('logo', logoFile);
                formData.append('company_name', profile.company_name || '');
                formData.append('industry', profile.industry || '');
                res = await api.upload('/profile/', formData, 'PUT');
            } else {
                res = await api.put('/profile/', {
                    company_name: profile.company_name || '',
                    industry: profile.industry || ''
                });
            }
            if (res.ok) {
                setIsEditingProfile(false);
                alert('Profile updated!');
                fetchProfile();
            } else {
                const err = await res.json();
                alert('Failed to update profile: ' + JSON.stringify(err));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Chart Data
    const pieData = {
        labels: ['Shortlisted', 'Applied', 'Rejected'],
        datasets: [{
            data: [
                stats?.recent_applications?.filter((a: any) => a.status === 'Shortlisted').length || 0,
                stats?.recent_applications?.filter((a: any) => a.status === 'Applied').length || 0,
                stats?.recent_applications?.filter((a: any) => a.status === 'Rejected').length || 0
            ],
            backgroundColor: ['#10b981', '#6366f1', '#f43f5e'],
            borderColor: 'rgba(255,255,255,0.1)',
        }]
    };

    const barData = {
        labels: ['Python', 'React', 'NodeJS', 'Django', 'AWS'],
        datasets: [{
            label: 'Applicant Skill Trend',
            data: [12, 19, 3, 5, 2],
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'var(--primary)',
            borderWidth: 1,
        }]
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Recruiter Data...</div>;

    const cards = [
        { title: 'Total Candidates', value: stats?.total_candidates || 0, icon: <Users size={24} color="var(--primary)" />, trend: '+12% this month' },
        { title: 'Active Jobs', value: stats?.total_jobs || 0, icon: <Briefcase size={24} color="var(--secondary)" />, trend: '3 new today' },
        { title: 'Avg Match Score', value: `${stats?.avg_score || 0}%`, icon: <BarChart3 size={24} color="var(--accent)" />, trend: 'Top 10% talent' },
        { title: 'Screening Rate', value: '94%', icon: <TrendingUp size={24} color="#f59e0b" />, trend: 'AI productivity peak' },
    ];

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                            {profile?.logo && <img src={profile.logo.startsWith('http') ? profile.logo : `http://localhost:8000${profile.logo}`} alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />}
                            <h1 style={{ fontSize: '32px' }}>Recruiter <span style={{ color: 'var(--primary)' }}>Insight</span></h1>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage your workspace: {profile?.company_name || 'Set Company Name'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href="/recruiter/candidates" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <Users size={18} /> Candidates Pool
                        </Link>
                        <Link href="/recruiter/jobs" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <Search size={18} /> Manage Jobs
                        </Link>
                        <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isEditingProfile ? 'Cancel' : 'Profile Settings'}
                        </button>
                        <Link href="/recruiter/jobs/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <Plus size={18} /> Create New Job
                        </Link>
                    </div>

                </header>

                {isEditingProfile && (
                    <motion.div
                        className="glass-card"
                        style={{ padding: '40px', marginBottom: '48px' }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        <h3 style={{ marginBottom: '24px' }}>Company Profile Management</h3>
                        <form onSubmit={handleProfileSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Company Name</label>
                                <input
                                    value={profile?.company_name || ''}
                                    onChange={e => setProfile({ ...profile, company_name: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Industry</label>
                                <input
                                    value={profile?.industry || ''}
                                    onChange={e => setProfile({ ...profile, industry: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Company Logo</label>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <input type="file" onChange={e => setLogoFile(e.target.files?.[0] || null)} style={{ border: 'none', padding: 0 }} />
                                    {profile?.logo && <span style={{ fontSize: '12px', color: 'var(--primary)' }}>Already Uploaded</span>}
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <button type="submit" className="btn-primary" style={{ width: '200px' }}>Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            className="glass-card"
                            style={{ padding: '32px' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {card.icon}
                                </div>
                                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{card.trend}</span>
                            </div>
                            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '8px' }}>{card.title}</h4>
                            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{card.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    <motion.div
                        className="glass-card"
                        style={{ padding: '40px' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h3 style={{ marginBottom: '32px' }}>Recent Applications</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        <th style={{ paddingBottom: '20px' }}>Candidate</th>
                                        <th style={{ paddingBottom: '20px' }}>Job Role</th>
                                        <th style={{ paddingBottom: '20px' }}>Match %</th>
                                        <th style={{ paddingBottom: '20px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recent_applications?.map((app: any, i: number) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 0' }}>
                                                <Link href={`/recruiter/applications/${app.id}`} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {app.candidate_name || 'Anonymous'} <ChevronRight size={14} color="var(--primary)" />
                                                </Link>
                                            </td>
                                            <td style={{ padding: '16px 0', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{app.job_details.title}</td>
                                            <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(app.match_score?.score || 0)}%</td>
                                            <td style={{ padding: '16px 0', display: 'flex', gap: '8px' }}>
                                                {app.status === 'Applied' ? (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(app.id, 'Shortlisted')} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 8px', fontSize: '12px', border: 'none', borderRadius: '4px' }}>Shortlist</button>
                                                        <button onClick={() => handleStatusUpdate(app.id, 'Rejected')} style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '4px 8px', fontSize: '12px', border: 'none', borderRadius: '4px' }}>Reject</button>
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: '12px', color: app.status === 'Shortlisted' ? '#10b981' : '#f43f5e' }}>{app.status}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <motion.div className="glass-card" style={{ padding: '32px' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Application Flow</h3>
                            <div style={{ height: '300px' }}>
                                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </motion.div>
                        <motion.div className="glass-card" style={{ padding: '32px' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Skill Distribution</h3>
                            <div style={{ height: '200px' }}>
                                <Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } } } }} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
