"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, CheckCircle2, RefreshCw, MessageSquareQuote } from 'lucide-react';

function InterviewContent() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('job_id');
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<string[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');

    useEffect(() => {
        if (jobId) fetchQuestions();
    }, [jobId]);

    const fetchQuestions = async () => {
        try {
            const res = await api.post('/jobs/interview-prep/', { job_id: jobId });
            if (res.ok) {
                const data = await res.json();
                setQuestions(data.questions);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentAnswer.trim() === '') return;
        const newAnswers = [...answers];
        newAnswers[currentIdx] = currentAnswer;
        setAnswers(newAnswers);

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setCurrentAnswer(newAnswers[currentIdx + 1] || '');
        } else {
            setCurrentIdx(questions.length); // Completed state
        }
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Generating AI Questions...</div>;

    return (
        <div style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px' }}><span style={{ color: 'var(--primary)' }}>Interview</span> Coach</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Personalized practice for your upcoming role.</p>
            </header>

            <AnimatePresence mode="wait">
                {currentIdx < questions.length ? (
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card"
                        style={{ padding: '40px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.1em' }}>QUESTION {currentIdx + 1} OF {questions.length}</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {questions.map((_, i) => (
                                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i <= currentIdx ? 'var(--primary)' : 'var(--border)' }}></div>
                                ))}
                            </div>
                        </div>

                        <h2 style={{ fontSize: '24px', lineHeight: '1.4', marginBottom: '32px' }}>
                            {questions[currentIdx]}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Your Response</label>
                            <textarea
                                rows={8}
                                placeholder="Type your answer here..."
                                value={currentAnswer}
                                onChange={e => setCurrentAnswer(e.target.value)}
                                style={{ width: '100%', resize: 'none' }}
                            />
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleNext}
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                disabled={!currentAnswer.trim()}
                            >
                                {currentIdx === questions.length - 1 ? 'Finish Interview' : 'Next Question'} <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card"
                        style={{ padding: '60px', textAlign: 'center' }}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto 32px'
                        }}>
                            <CheckCircle2 color="var(--secondary)" size={48} />
                        </div>
                        <h2 style={{ marginBottom: '16px' }}>Session Completed!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '40px' }}>
                            Great job practicing. Consistent practice is the key to landing your dream job.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button
                                className="btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                Practice Again
                            </button>
                            <button className="btn-outline" onClick={() => window.location.href = '/jobs'}>
                                Back to Jobs
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function InterviewPrep() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}>
                <InterviewContent />
            </Suspense>
        </>
    );
}
