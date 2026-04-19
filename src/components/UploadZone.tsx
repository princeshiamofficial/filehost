'use client';

import React, { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  onUploadSuccess: (blob: any) => void;
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    
    setStatus('uploading');
    setProgress(0);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: (p) => setProgress(p.percentage),
      });

      onUploadSuccess(newBlob);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div 
      className={`upload-card ${dragActive ? 'active' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
      onClick={() => status === 'idle' && fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef} 
        type="file" 
        style={{ display: 'none' }} 
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
      />

      <div className="upload-orb">
        <AnimatePresence mode="wait">
          {status === 'idle' && <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><UploadCloud size={44} strokeWidth={1.5} /></motion.div>}
          {status === 'uploading' && <motion.div key="u" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Loader2 size={44} className="animate-spin" /></motion.div>}
          {status === 'success' && <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><CheckCircle2 size={44} color="#4ade80" /></motion.div>}
        </AnimatePresence>
      </div>

      <div className="upload-info">
        <h3>{status === 'uploading' ? `Uploading... ${progress}%` : status === 'success' ? 'Vault Secured.' : 'Drop files to Secure'}</h3>
        <p>{status === 'idle' ? 'Encrypted cloud storage at the edge.' : 'Processing your assets across the global network.'}</p>
      </div>

      {status === 'uploading' && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${progress}%`, height: '4px', background: 'var(--accent-primary)', transition: 'width 0.2s' }} />
      )}
    </div>
  );
}
