'use client';

import React, { useState, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import FileList from '@/components/FileList';
import { motion } from 'framer-motion';

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);

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
    }
  };

  const handleUploadSuccess = (newBlob: any) => {
    setFiles((prev) => [newBlob, ...prev]);
  };

  return (
    <>
      <nav className="navbar animate-in">
        <div className="logo">VAULT.</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Secure. Distributed. Private.</div>
      </nav>

      <main className="app-container">
        <div className="hero-upload animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="hero-content">
            <h1>Storage for the <span>Next Century.</span></h1>
            <p className="sub-text">
                Experience high-durability decentralized asset hosting. 
                Move your data to the edge with Vault's encrypted environment.
            </p>
          </div>

          <UploadZone onUploadSuccess={handleUploadSuccess} />
        </div>

        <aside className="sidebar-vault animate-in" style={{ animationDelay: '0.4s' }}>
            <FileList files={files} />
        </aside>
      </main>
    </>
  );
}
