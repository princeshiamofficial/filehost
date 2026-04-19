'use client';

import React, { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  onUploadSuccess: (blob: any) => void;
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: (progressEvent) => {
          setProgress(progressEvent.percentage);
        },
      });

      onUploadSuccess(newBlob);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-card animate-slide-up">
      <div 
        className={`upload-zone ${dragActive ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden-input"
          style={{ display: 'none' }}
          onChange={handleChange}
          disabled={uploading}
        />

        <AnimatePresence mode="wait">
          {!uploading ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="upload-content"
            >
              <div className="upload-icon">
                <Upload size={48} />
              </div>
              <div className="upload-text">
                <h3>Drag & Drop your files</h3>
                <p>or click to browse from computer</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="upload-content"
            >
              <div className="progress-container">
                <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem' }}></div>
                <h3>Uploading... {progress}%</h3>
                <div className="progress-bar-bg" style={{ width: '200px', height: '4px', background: 'var(--border)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
                    <motion.div 
                        className="progress-bar-fill" 
                        style={{ height: '100%', background: 'var(--accent)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message"
          style={{ color: 'var(--error)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
        >
          <AlertCircle size={18} />
          {error}
        </motion.div>
      )}
    </div>
  );
}
