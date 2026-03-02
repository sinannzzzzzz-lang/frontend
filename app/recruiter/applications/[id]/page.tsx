"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Briefcase, GraduationCap, Code, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function CandidateDeepDive() {
    const { id } = useParams();
    const router = useRouter();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const fetchApplication = async () => {
        try {
            const res = await api.get(`/recruiter/applications/${id}/`);
            if (res.ok) setApplication(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        try {
            const res = await api.post(`/recruiter/applications/${id}/status/`, { status });
            if (res.ok) {
                alert(`Candidate ${status}ed successfully!`);
                fetchApplication();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Analysis...</div>;
    if (!application) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Application not found.</div>;

    const candidate = application.candidate_details || {};
    const match = application.match_score || { score: 0, missing_skills: [], explanation: '' };

    // Prepare Radar Chart Data
    const requiredSkills = application.job_details.required_skills.map((s: any) => s.name);
    const candidateSkills = (candidate.skills || []).map((s: any) => s.name);

    const chartData = {
        labels: requiredSkills.length > 0 ? requiredSkills : ['No requirements set'],
        datasets: [
            {
                label: 'Candidate Skills',
                data: requiredSkills.map((rs: string) => candidateSkills.includes(rs) ? 100 : 20),
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
            },
            {
                label: 'Job Requirement',
                data: requiredSkills.map(() => 100),
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.5)',
                borderWidth: 1,
                borderDash: [5, 5],
            },
        ],
    };

    const chartOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: 'rgba(255,255,255,0.5)', font: { size: 12 } },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: { display: false }
            }
        },
        plugins: {
            legend: {
                labels: { color: 'rgba(255,255,255,0.7)' }
            }
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                <Link href="/recruiter" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '32px' }}>
                    <ArrowLeft size={16} /> Back to Candidates
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                    {/* Left Column: Basic Info & Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <motion.div
                            className="glass-card"
                            style={{ padding: '40px', textAlign: 'center' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{
                                width: '120px',
                                height: '120px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '0 auto 24px',
                                border: '4px solid var(--secondary)',
                                fontSize: '40px',
                                fontWeight: 'bold',
                                color: 'var(--secondary)'
                            }}>
                                {Math.round(match.score)}%
                            </div>
                            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{candidate.full_name || 'Anonymous Candidate'}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>{application.job_details.title}</p>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                {application.status === 'Applied' ? (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate('Shortlisted')}
                                            className="btn-primary"
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <CheckCircle size={18} /> Shortlist
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate('Rejected')}
                                            className="btn-outline"
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#f43f5e', borderColor: '#f43f5e' }}
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ flex: 1, padding: '12px', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold', border: `1px solid ${application.status === 'Shortlisted' ? '#10b981' : '#f43f5e'}`, color: application.status === 'Shortlisted' ? '#10b981' : '#f43f5e', background: application.status === 'Shortlisted' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)' }}>
                                        {application.status === 'Shortlisted' ? <><CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Shortlisted</> : <><XCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Rejected</>}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass-card"
                            style={{ padding: '32px' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                        >
                            <h3 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertCircle size={18} color="var(--primary)" /> Why this score?
                            </h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                                {match.explanation || "AI is analyzing the alignment between the candidate's skills and your job requirements."}
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column: Deep Analysis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <motion.div
                                className="glass-card"
                                style={{ padding: '32px' }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>AI Strengths Summary</h3>
                                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
                                    {candidate.summary?.substring(0, 150)}...
                                </p>
                                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--secondary)' }}>
                                    <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--secondary)' }}>
                                        "Candidate shows high proficiency in core technical stack with relevant project experience."
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="glass-card"
                                style={{ padding: '32px' }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
                            >
                                <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Skill Radar</h3>
                                <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                                    <Radar data={chartData} options={chartOptions} />
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="glass-card"
                            style={{ padding: '40px' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                        >
                            <h3 style={{ fontSize: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Briefcase color="var(--primary)" /> Professional Journey
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {candidate.experience?.map((exp: any, i: number) => (
                                    <div key={i} style={{ paddingLeft: '24px', borderLeft: '2px solid var(--border)', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <h4 style={{ fontSize: '17px' }}>{exp.title}</h4>
                                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{exp.duration}</span>
                                        </div>
                                        <p style={{ color: 'var(--primary)', fontSize: '14px', marginBottom: '12px' }}>{exp.company}</p>
                                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass-card"
                            style={{ padding: '40px' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                        >
                            <h3 style={{ fontSize: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <GraduationCap color="var(--secondary)" /> Education
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {candidate.education?.map((edu: any, i: number) => (
                                    <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{edu.degree}</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '8px' }}>{edu.institution}</p>
                                        <span style={{ fontSize: '13px', color: 'var(--secondary)', fontWeight: '600' }}>{edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
