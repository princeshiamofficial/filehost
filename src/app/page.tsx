'use client';

import React, { useState, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import FileList from '@/components/FileList';
import { Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      if (Array.isArray(data)) {
        setFiles(data);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newBlob: any) => {
    setFiles((prev) => [newBlob, ...prev]);
  };

  return (
    <main className="main-container">
      <header className="animate-slide-up">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}
        >
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'var(--accent)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}>V</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '1px' }}>VAULT</span>
        </motion.div>
        
        <h1>Secure. Local. Lightning Fast.</h1>
        <p className="subtitle">
            Upload your files to Vercel's global edge network. 
            Experience the future of decentralized asset hosting with Vault.
        </p>
      </header>

      <section className="features grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Shield className="feature-icon" style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Bank-grade Security</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your files are encrypted and stored across multiple global regions for maximum reliability.</p>
        </div>
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Zap className="feature-icon" style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Edge Performance</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Powered by Vercel Blob, serving your content from the location closest to your users.</p>
        </div>
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Globe className="feature-icon" style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Global Access</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Share links that work anywhere, anytime. High durability ensures your data is always online.</p>
        </div>
      </section>

      <UploadZone onUploadSuccess={handleUploadSuccess} />

      <FileList files={files} />

      <footer style={{ marginTop: 'auto', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>&copy; 2026 Vault Hosting. Built with Next.js and Vercel Blob.</p>
      </footer>
    </main>
  );
}
