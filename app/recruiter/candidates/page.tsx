"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Briefcase, ChevronRight, Filter, Download, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function RecruiterCandidates() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/recruiter/applications/');
            if (res.ok) {
                setApplications(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = (app.candidate_details?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.job_details?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading Talent Pool...</div>;

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Talent <span style={{ color: 'var(--primary)' }}>Pool</span></h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage and track all candidates across your active job postings.</p>
                    </div>
                </header>

                <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            placeholder="Search by candidate name or job title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '48px', width: '100%' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Filter size={18} color="var(--primary)" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                    {filteredApplications.map((app, i) => (
                        <motion.div
                            key={app.id}
                            className="glass-card"
                            style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                            whileHover={{ scale: 1.01, borderColor: 'var(--primary)' }}
                        >
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid rgba(99, 102, 241, 0.2)'
                                }}>
                                    <User color="var(--primary)" size={32} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{app.candidate_details?.full_name || 'Anonymous candidate'}</h3>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14} /> {app.job_details.title}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {app.candidate_details.email || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Match Score</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)' }}>{app.match_score?.score || 0}%</div>
                                </div>

                                <div style={{
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    background: app.status === 'Shortlisted' ? 'rgba(16, 185, 129, 0.1)' : app.status === 'Rejected' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                    color: app.status === 'Shortlisted' ? '#10b981' : app.status === 'Rejected' ? '#f43f5e' : 'var(--primary)',
                                    border: `1px solid ${app.status === 'Shortlisted' ? 'rgba(16, 185, 129, 0.2)' : app.status === 'Rejected' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
                                }}>
                                    {app.status}
                                </div>

                                <Link
                                    href={`/recruiter/applications/${app.id}`}
                                    className="btn-primary"
                                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '14px' }}
                                >
                                    View Detail <ChevronRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}

                    {filteredApplications.length === 0 && (
                        <div style={{ padding: '80px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                            <User size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                            <p>No candidates found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
