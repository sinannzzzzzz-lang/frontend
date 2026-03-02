"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, FileText, PlusCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateJob() {
    const [formData, setFormData] = useState({ title: '', description: '', company: 'Local Corp', required_skill_names: [] as string[] });
    const [isGenerating, setIsGenerating] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const router = useRouter();

    const addSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newSkill.trim() && !formData.required_skill_names.includes(newSkill.trim().toLowerCase())) {
                setFormData({ ...formData, required_skill_names: [...formData.required_skill_names, newSkill.trim().toLowerCase()] });
                setNewSkill('');
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({ ...formData, required_skill_names: formData.required_skill_names.filter(s => s !== skillToRemove) });
    };

    const handleGenerateAI = async () => {
        if (!formData.title) return alert('Please enter a Job Title first');
        setIsGenerating(true);
        try {
            const res = await api.post('/recruiter/generate-jd/', { title: formData.title });
            const data = await res.json();
            if (res.ok) {
                setFormData({
                    ...formData,
                    description: data.description
                });
            } else {
                alert(data.error || 'Failed to generate JD');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to connect to AI service');
        } finally {
            setIsGenerating(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/jobs/', formData);
            if (res.ok) router.push('/recruiter');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto' }}>
                <Link href="/recruiter" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '14px' }}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <motion.div
                    className="glass-card"
                    style={{ padding: '48px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Briefcase color="var(--primary)" /> Post New Position
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Job Title</label>
                            <input
                                placeholder="e.g. Senior Frontend Engineer"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Job Description</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    style={{
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: 'var(--secondary)',
                                        padding: '6px 14px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    {isGenerating ? 'Generating...' : <><Sparkles size={14} /> AI Generate JD</>}
                                </button>
                            </div>
                            <textarea
                                rows={12}
                                placeholder="Describe the role and requirements..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Required Skills (Press Enter to add)</label>
                            <input
                                placeholder="e.g. React"
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                onKeyDown={addSkill}
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                {formData.required_skill_names.map((skill, index) => (
                                    <span key={index} style={{
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: 'var(--secondary)',
                                        padding: '6px 14px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: '600'
                                    }}>
                                        {skill}
                                        <span style={{ cursor: 'pointer', color: 'rgba(16, 185, 129, 0.5)' }} onClick={() => removeSkill(skill)}>×</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <PlusCircle size={20} /> Publish Job Posting
                        </button>
                    </form>
                </motion.div>
            </div>
        </>
    );
}
