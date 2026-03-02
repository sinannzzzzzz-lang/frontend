"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, MapPin, Star, AlertTriangle, ChevronRight, X, CheckCircle2, Clock } from 'lucide-react';

export default function JobMarket() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchingId, setMatchingId] = useState<number | null>(null);
    const [applyingId, setApplyingId] = useState<number | null>(null);
    const [matchResult, setMatchResult] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/jobs/'),
                api.get('/recruiter/applications/') // This serves as user applications if current user is job seeker
            ]);

            if (jobsRes.ok) setJobs(await jobsRes.json());
            // Filter applications for current user if needed, but the backend already does this based on auth token
            if (appsRes.ok) setApplications(await appsRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMatch = async (jobId: number) => {
        setMatchingId(jobId);
        setMatchResult(null);
        try {
            const res = await api.get(`/jobs/match/?job_id=${jobId}`);
            if (res.ok) {
                const data = await res.json();
                setMatchResult(data);
                // Refresh applications to show "Applied" status if match-making created one
                fetchData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setMatchingId(null);
        }
    };

    const handleApply = async (jobId: number) => {
        setApplyingId(jobId);
        try {
            const res = await api.post('/jobs/apply/', { job_id: jobId });
            if (res.ok) {
                alert('Application submitted successfully!');
                fetchData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setApplyingId(null);
        }
    };

    const isApplied = (jobId: number) => {
        return applications.some(app => app.job === jobId);
    };

    const getApplicationStatus = (jobId: number) => {
        return applications.find(app => app.job === jobId)?.status || 'Apply';
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Scanning the Market...</div>;

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{ marginBottom: '64px', textAlign: 'center' }}>
                    <motion.h1
                        style={{ fontSize: '56px', fontWeight: '800', marginBottom: '20px' }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Find Your <span style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Next Frontier</span>
                    </motion.h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                        Connect your skills with the industry's most innovative roles through our AI matching engine.
                    </p>
                </header>

                <div className="glass-card" style={{ padding: '24px', marginBottom: '48px', display: 'flex', gap: '20px', alignItems: 'center', maxWidth: '800px', margin: '0 auto 64px' }}>
                    <Search size={20} color="var(--primary)" />
                    <input
                        placeholder="Search roles or companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'none', border: 'none', width: '100%', fontSize: '18px', outline: 'none' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
                    {filteredJobs.map((job, i) => (
                        <motion.div
                            key={job.id}
                            className="glass-card"
                            style={{ padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.05 } }}
                            whileHover={{ y: -10, borderColor: 'var(--primary)' }}
                        >
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '12px 24px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '12px', fontWeight: 'bold', borderBottomLeftRadius: '20px' }}>
                                LIVE
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Briefcase color="var(--primary)" size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>{job.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} /> {job.company} • Remote
                                    </p>
                                </div>
                            </div>

                            <div style={{ flex: 1, marginBottom: '32px' }}>
                                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
                                    {job.description.length > 140 ? job.description.substring(0, 140) + '...' : job.description}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                                {job.required_skills?.slice(0, 3).map((skill: any) => (
                                    <span key={skill.id} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                        {skill.name}
                                    </span>
                                ))}
                                {job.required_skills?.length > 3 && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>+{job.required_skills.length - 3} more</span>}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => handleMatch(job.id)}
                                    className="btn-outline"
                                    style={{ flex: 1, padding: '12px', fontSize: '14px' }}
                                    disabled={matchingId === job.id}
                                >
                                    {matchingId === job.id ? 'Analyzing...' : 'View Match %'}
                                </button>

                                {isApplied(job.id) ? (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                                        <CheckCircle2 size={16} /> {getApplicationStatus(job.id)}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleApply(job.id)}
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '12px', fontSize: '14px' }}
                                        disabled={applyingId === job.id}
                                    >
                                        {applyingId === job.id ? 'Applying...' : 'Quick Apply'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Match Result Modal */}
                <AnimatePresence>
                    {matchResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
                        >
                            <motion.div
                                className="glass-card"
                                style={{ width: '100%', maxWidth: '650px', padding: '64px', position: 'relative' }}
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                            >
                                <button
                                    onClick={() => setMatchResult(null)}
                                    style={{ position: 'absolute', top: '32px', right: '32px', background: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                                >
                                    <X size={28} />
                                </button>

                                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        border: '5px solid var(--primary)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: '0 auto 24px',
                                        fontSize: '40px',
                                        fontWeight: '800',
                                        color: 'var(--primary)',
                                        background: 'rgba(99, 102, 241, 0.05)'
                                    }}>
                                        {Math.round(matchResult.match_score.score)}%
                                    </div>
                                    <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Compatibility Analysis</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>How well you align with this role</p>
                                </div>

                                <div style={{ marginBottom: '40px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                    <h4 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Star size={18} /> AI Logic
                                    </h4>
                                    <p style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>{matchResult.match_score.explanation}</p>
                                </div>

                                {matchResult.match_score.missing_skills?.length > 0 && (
                                    <div style={{ marginBottom: '48px' }}>
                                        <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            <AlertTriangle size={18} /> Skill Development Needed
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                            {matchResult.match_score.missing_skills.map((skill: string) => (
                                                <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(244, 63, 94, 0.05)', color: 'var(--accent)', padding: '8px 20px', borderRadius: '30px', fontSize: '14px', border: '1px solid rgba(244, 63, 94, 0.2)', fontWeight: '600' }}>
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 2, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                        onClick={() => {
                                            window.location.href = `/jobs/interview-prep?job_id=${matchResult.job}`;
                                        }}
                                    >
                                        <Clock size={20} /> Launch Interview Prep
                                    </button>
                                    <button className="btn-outline" style={{ flex: 1, padding: '16px' }} onClick={() => setMatchResult(null)}>
                                        Dismiss
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
