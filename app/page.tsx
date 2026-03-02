"use client";
import { useState, useRef } from 'react';
import { Upload, CheckCircle, Loader2, AlertCircle, Sparkles, Code, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRef(useRouter()); // Stable router reference

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const endpoint = token ? '/resume/upload/' : '/resume/guest-upload/';

      const res = await api.upload(endpoint, formData);
      if (res.ok) {
        const data = await res.json();

        if (!token) {
          // Guest mode: show result preview
          setAnalysisResult(data);
        } else {
          // Logged in: redirect to full profile
          setTimeout(() => router.current.push('/profile'), 1500);
        }
      } else {
        // Try to parse error as JSON, fallback to status text
        let errorMsg = 'Upload failed. Please try again.';
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {
          errorMsg = `Server Error (${res.status}): The backend encountered an issue.`;
        }
        setError(errorMsg);
      }
    } catch {
      setError('Network error. Is the backend server running?');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px 20px',
        position: 'relative',
        zIndex: 10
      }}>
        <AnimatePresence mode="wait">
          {!analysisResult ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
            >
              <div className="hero-3d-object" aria-hidden="true">
                <span className="hero-plane plane-a" />
                <span className="hero-plane plane-b" />
                <span className="hero-plane plane-c" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: 'rgba(60, 168, 255, 0.12)',
                  color: 'var(--primary)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '24px',
                  display: 'inline-block',
                  border: '1px solid rgba(60, 168, 255, 0.3)'
                }}
              >
                Powered by Gemini 1.5 Flash
              </motion.div>
              <h1 style={{ fontSize: '72px', marginBottom: '16px', lineHeight: 1.1 }}>
                Smart AI Resume <br />
                <span style={{
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Screening</span>
              </h1>
              <p style={{ fontSize: '20px', color: 'var(--muted)', maxWidth: '650px', margin: '0 auto 60px' }}>
                Upload your resume and let our AI handle the matching, polishing, and interview preparation. 100% automated, 100% efficient.
              </p>

              <motion.div
                className="glass-card upload-stage"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  padding: '60px 40px',
                  position: 'relative',
                  border: `2px dashed ${isDragging ? 'var(--primary)' : 'rgba(170, 203, 236, 0.26)'}`,
                  background: isDragging ? 'rgba(60, 168, 255, 0.08)' : 'var(--surface-elevated)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
              >
                <AnimatePresence mode="wait">
                  {!isUploading && (
                    <motion.div
                      key="upload-prompt"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '24px',
                        border: '1px solid var(--border)'
                      }}>
                        <Upload color={isDragging ? 'var(--primary)' : 'white'} size={32} />
                      </div>
                      <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>
                        {isDragging ? 'Drop it here' : 'Select Resume PDF'}
                      </h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.4)', marginBottom: '32px', fontSize: '15px' }}>
                        Drag and drop your file or click to browse
                      </p>

                      {error && (
                        <div style={{
                          color: 'var(--accent)',
                          fontSize: '14px',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(244, 63, 94, 0.1)',
                          padding: '10px 20px',
                          borderRadius: '10px'
                        }}>
                          <AlertCircle size={16} /> {error}
                        </div>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                    </motion.div>
                  )}

                  {isUploading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <div style={{ position: 'relative', marginBottom: '32px' }}>
                        <Loader2 size={64} color="var(--primary)" className="animate-spin" />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px' }}>AI</div>
                      </div>
                      <h3 style={{ fontSize: '22px' }}>Deep Extraction in Progress...</h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.4)', marginTop: '12px', fontSize: '14px' }}>
                        Our AI is mapping your skills and experience.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--secondary)',
                  borderRadius: '30px',
                  marginBottom: '24px'
                }}>
                  <CheckCircle size={20} /> Analysis Successful
                </div>
                <h1>Behold Your <span style={{ color: 'var(--primary)' }}>AI Profile</span></h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '12px' }}>This is a guest preview. Create an account to save this and unlock matching.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '40px' }}>
                  <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Sparkles color="var(--primary)" /> {analysisResult.full_name || 'Candidate Name'}
                  </h2>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                    <span>{analysisResult.email}</span>
                    <span>|</span>
                    <span>{analysisResult.phone}</span>
                  </div>

                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary)' }}>Professional Summary</h3>
                    <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>{analysisResult.summary}</p>
                  </div>

                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Briefcase size={18} color="var(--secondary)" /> Experience
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {analysisResult.experience?.slice(0, 2).map((exp: any, i: number) => (
                        <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                          <div style={{ fontWeight: 'bold' }}>{exp.title}</div>
                          <div style={{ color: 'var(--secondary)', fontSize: '13px' }}>{exp.company} | {exp.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary" style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={() => router.current.push('/register')}>
                    Save Profile to Get Started <ArrowRight size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Code size={20} color="var(--primary)" /> Skills Found
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {analysisResult.skills?.map((skill: string) => (
                        <span key={skill} style={{ padding: '6px 14px', background: 'rgba(60, 168, 255, 0.12)', color: 'var(--primary)', borderRadius: '10px', fontSize: '13px' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <GraduationCap size={20} color="var(--secondary)" /> Education
                    </h3>
                    {analysisResult.education?.map((edu: any, i: number) => (
                      <div key={i} style={{ marginBottom: '12px' }}>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{edu.degree}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{edu.institution}, {edu.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!analysisResult && (
          <div style={{ marginTop: '80px', display: 'flex', gap: '40px', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
            <span>Secure & Private</span>
            <span>|</span>
            <span>Instant AI Analysis</span>
            <span>|</span>
            <span>Gemini 1.5 Powered</span>
          </div>
        )}
      </div>
    </>
  );
}
