'use client';

import React from 'react';
import { File, ExternalLink, Copy, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface FileListProps {
  files: BlobFile[];
}

export default function FileList({ files }: FileListProps) {
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', opacity: 0.6 }}>
        <Clock size={16} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Vault Assets</span>
      </div>
      
      <div className="vault-list">
        <AnimatePresence initial={false}>
          {files.length === 0 ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.4, fontSize: '0.9rem' }}>
              Your vault is empty.
            </div>
          ) : (
            files.map((file, i) => (
              <motion.div
                key={file.url}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="file-row"
              >
                <div style={{ color: 'var(--accent-primary)' }}>
                    <File size={20} />
                </div>
                <div className="file-details-row">
                  <h4>{file.pathname}</h4>
                  <p>{formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div className="file-actions-row">
                  <div className="small-btn" onClick={() => copy(file.url)}>
                    {copiedUrl === file.url ? <Check size={12} /> : <Copy size={12} />}
                  </div>
                  <a href={file.url} target="_blank" rel="noreferrer" className="small-btn">
                    <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
