"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Save, User as UserIcon, Mail, Phone, Code, Briefcase, GraduationCap, Plus, Trash2, X, Star, FileText, ChevronRight, ExternalLink } from 'lucide-react';

import Link from 'next/link';

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [polishing, setPolishing] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile/');
            if (res.ok) {
                const data = await res.json();
                if (!data.full_name && data.user?.username) data.full_name = data.user.username;
                if (!data.email && data.user?.email) data.email = data.user.email;
                setProfile(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await api.put('/profile/', {
                ...profile,
                skill_names: profile.skills.map((s: any) => s.name)
            });
            if (res.ok) alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
        }
    };

    const handlePolish = async () => {
        if (!profile.summary) return alert('Please enter a summary first');
        setPolishing(true);
        try {
            const res = await api.post('/profile/polish/', { summary: profile.summary });
            if (res.ok) {
                const data = await res.json();
                setProfile({ ...profile, summary: data.polished });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPolishing(false);
        }
    };

    const addSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            if (!profile.skills.find((s: any) => s.name.toLowerCase() === newSkill.toLowerCase())) {
                setProfile({ ...profile, skills: [...profile.skills, { name: newSkill.toLowerCase() }] });
            }
            setNewSkill('');
        }
    };

    const removeSkill = (name: string) => {
        setProfile({ ...profile, skills: profile.skills.filter((s: any) => s.name !== name) });
    };

    const addExperience = () => {
        const newExp = { title: '', company: '', duration: '', description: '' };
        setProfile({ ...profile, experience: [newExp, ...(profile.experience || [])] });
    };

    const updateExperience = (index: number, field: string, value: string) => {
        const updated = [...profile.experience];
        updated[index] = { ...updated[index], [field]: value };
        setProfile({ ...profile, experience: updated });
    };

    const removeExperience = (index: number) => {
        setProfile({ ...profile, experience: profile.experience.filter((_: any, i: number) => i !== index) });
    };

    const addEducation = () => {
        const newEdu = { degree: '', institution: '', year: '' };
        setProfile({ ...profile, education: [newEdu, ...(profile.education || [])] });
    };

    const updateEducation = (index: number, field: string, value: string) => {
        const updated = [...profile.education];
        updated[index] = { ...updated[index], [field]: value };
        setProfile({ ...profile, education: updated });
    };

    const removeEducation = (index: number) => {
        setProfile({ ...profile, education: profile.education.filter((_: any, i: number) => i !== index) });
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Refining Your Profile...</div>;
    if (!profile) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Session Expired. Please Login.</div>;

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 20px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
                    {/* Main Content Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <motion.div
                            className="glass-card"
                            style={{ padding: '48px', position: 'relative', overflow: 'hidden' }}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                                <div>
                                    <h2 style={{ fontSize: '32px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                        <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px' }}><UserIcon color="var(--primary)" size={28} /></div>
                                        Personal Narrative
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>Your AI-enhanced professional identity.</p>
                                </div>
                                <button onClick={handleUpdate} className="btn-primary" style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                                    <Save size={20} /> Deploy Changes
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity</label>
                                    <input value={profile.full_name || ''} onChange={e => setProfile({ ...profile, full_name: e.target.value })} placeholder="Your Full Name" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Communication</label>
                                    <input value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} placeholder="Email Address" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Line</label>
                                    <input value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone Number" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Executive Summary</label>
                                    <button
                                        onClick={handlePolish}
                                        disabled={polishing}
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            color: 'var(--primary)',
                                            padding: '8px 16px',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(99, 102, 241, 0.2)',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {polishing ? 'Optimizing...' : <><Sparkles size={16} /> AI Professional Lite</>}
                                    </button>
                                </div>
                                <textarea
                                    rows={6}
                                    value={profile.summary || ''}
                                    onChange={e => setProfile({ ...profile, summary: e.target.value })}
                                    style={{ width: '100%', fontSize: '16px', lineHeight: '1.7', padding: '20px', borderRadius: '16px' }}
                                    placeholder="Tell us about your professional journey..."
                                />
                            </div>
                        </motion.div>

                        {/* Experience Section */}
                        <motion.div
                            className="glass-card"
                            style={{ padding: '48px' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}><Briefcase size={24} color="var(--secondary)" /></div>
                                    Career Milestones
                                </h3>
                                <button onClick={addExperience} className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={16} /> Add Milestone
                                </button>
                            </div>

                            <div style={{ display: 'grid', gap: '24px' }}>
                                {profile.experience?.map((exp: any, i: number) => (
                                    <div key={i} style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border)', position: 'relative' }}>
                                        <button onClick={() => removeExperience(i)} style={{ position: 'absolute', top: '24px', right: '24px', color: 'rgba(244, 63, 94, 0.4)', background: 'none' }}><Trash2 size={18} /></button>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Role Title</label>
                                                <input value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} placeholder="e.g. Lead Developer" />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Timeline</label>
                                                <input value={exp.duration} onChange={e => updateExperience(i, 'duration', e.target.value)} placeholder="e.g. 2021 - Present" />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Organization</label>
                                            <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Company Name" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Accomplishments</label>
                                            <textarea value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} rows={3} placeholder="Describe your impact..." />
                                        </div>
                                    </div>
                                ))}
                                {(!profile.experience || profile.experience.length === 0) && (
                                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px', border: '1px dashed var(--border)', borderRadius: '24px' }}>No milestones added yet.</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Education Section */}
                        <motion.div
                            className="glass-card"
                            style={{ padding: '48px' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}><GraduationCap size={24} color="#f59e0b" /></div>
                                    Educational Background
                                </h3>
                                <button onClick={addEducation} className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={16} /> Add Education
                                </button>
                            </div>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {profile.education?.map((edu: any, i: number) => (
                                    <div key={i} className="glass-card" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 100px auto', gap: '16px', alignItems: 'end', background: 'rgba(255,255,255,0.01)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Degree / Certificate</label>
                                            <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="e.g. BS Computer Science" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Institution</label>
                                            <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="University Name" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Year</label>
                                            <input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} placeholder="2020" />
                                        </div>
                                        <button onClick={() => removeEducation(i)} style={{ paddingBottom: '12px', color: 'rgba(244, 63, 94, 0.4)', background: 'none' }}><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <motion.div
                            className="glass-card"
                            style={{ padding: '32px' }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Code size={20} color="var(--secondary)" /> Skills Matrix
                            </h3>
                            <div style={{ position: 'relative', marginBottom: '20px' }}>
                                <input
                                    placeholder="Add a skill (Hit Enter)"
                                    value={newSkill}
                                    onChange={e => setNewSkill(e.target.value)}
                                    onKeyDown={addSkill}
                                    style={{ fontSize: '14px' }}
                                />
                                <Plus size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {profile.skills?.map((skill: any, i: number) => (
                                    <span key={i} style={{
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: 'var(--secondary)',
                                        padding: '6px 14px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        cursor: 'default'
                                    }}>
                                        {skill.name}
                                        <X size={12} style={{ cursor: 'pointer', color: 'rgba(16, 185, 129, 0.5)' }} onClick={() => removeSkill(skill.name)} />
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass-card"
                            style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)' }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                        >
                            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Star size={20} color="#f59e0b" /> Career Readiness
                            </h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', marginBottom: '24px' }}>
                                Your profile is {Math.min(100, (profile.skills?.length || 0) * 10 + (profile.experience?.length || 0) * 15)}% complete. Strong profiles get 3x more recruiters attention.
                            </p>
                            <Link href="/jobs" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '14px' }}>
                                Find Compatible Roles <ChevronRight size={18} />
                            </Link>
                        </motion.div>

                        <motion.div
                            className="glass-card"
                            style={{ padding: '32px', textAlign: 'center' }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                        >
                            <FileText size={40} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Resume Source</h3>
                            <button className="btn-outline" style={{ fontSize: '13px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => window.location.href = '/'}>
                                <ExternalLink size={14} /> Refresh from PDF
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
