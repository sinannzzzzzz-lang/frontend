"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, Edit2, Trash2, Plus, ArrowLeft, Search, X } from 'lucide-react';
import Link from 'next/link';

export default function ManageJobs() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingJob, setEditingJob] = useState<any>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs/');
            if (res.ok) setJobs(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this job posting?')) return;
        try {
            const res = await api.delete(`/jobs/${id}/`); // I need to make sure this view exists
            if (res.ok) {
                setJobs(jobs.filter(j => j.id !== id));
                alert('Job deleted');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.put(`/jobs/${editingJob.id}/`, {
                ...editingJob,
                required_skill_names: editingJob.required_skills.map((s: any) => s.name)
            });
            if (res.ok) {
                setEditingJob(null);
                fetchJobs();
                alert('Job updated successfully!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Jobs...</div>;

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                    <div>
                        <Link href="/recruiter" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '12px', fontSize: '14px' }}>
                            <ArrowLeft size={16} /> Dashboard
                        </Link>
                        <h1 style={{ fontSize: '32px' }}>Manage <span style={{ color: 'var(--primary)' }}>Job Postings</span></h1>
                    </div>
                    <Link href="/recruiter/jobs/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Plus size={18} /> Post New Job
                    </Link>
                </header>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            className="glass-card"
                            style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Briefcase color="var(--primary)" size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{job.title}</h3>
                                    <div style={{ display: 'flex', gap: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Created: {new Date(job.created_at).toLocaleDateString()}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Search size={14} /> {job.required_skills.length} Skills Required</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setEditingJob(job)}
                                    className="btn-outline"
                                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    className="btn-outline"
                                    style={{ padding: '10px 16px', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {jobs.length === 0 && (
                        <div style={{ padding: '80px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                            <Briefcase size={48} style={{ marginBottom: '20px', opacity: 0.2 }} />
                            <p>You haven't posted any jobs yet.</p>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                <AnimatePresence>
                    {editingJob && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
                        >
                            <motion.div
                                className="glass-card"
                                style={{ width: '100%', maxWidth: '700px', padding: '48px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                            >
                                <button onClick={() => setEditingJob(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', color: 'white' }}><X size={24} /></button>
                                <h2 style={{ marginBottom: '32px' }}>Edit Job Posting</h2>
                                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Job Title</label>
                                        <input
                                            value={editingJob.title}
                                            onChange={e => setEditingJob({ ...editingJob, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Description</label>
                                        <textarea
                                            rows={8}
                                            value={editingJob.description}
                                            onChange={e => setEditingJob({ ...editingJob, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Skills (Comma Separated)</label>
                                        <input
                                            value={editingJob.required_skills.map((s: any) => s.name).join(', ')}
                                            onChange={e => {
                                                const names = e.target.value.split(',').map(s => s.trim());
                                                setEditingJob({
                                                    ...editingJob,
                                                    required_skills: names.map(n => ({ name: n }))
                                                });
                                            }}
                                            placeholder="e.g. React, Nodejs, Python"
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ padding: '14px', marginTop: '12px' }}>Save Changes</button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
