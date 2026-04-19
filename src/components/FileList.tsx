'use client';

import React from 'react';
import { File, Download, ExternalLink, Trash2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface FileListProps {
  files: BlobFile[];
  onDelete?: (url: string) => void;
}

export default function FileList({ files, onDelete }: FileListProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="file-list-container">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Recent Uploads</h2>
      
      <div className="file-list">
        <AnimatePresence initial={false}>
          {files.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: '20px' }}
            >
              <File size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No files uploaded yet. Start by dropping one above!</p>
            </motion.div>
          ) : (
            files.map((file, index) => (
              <motion.div
                key={file.url}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="file-item"
              >
                <div className="file-info">
                  <div className="file-icon">
                    <File size={20} />
                  </div>
                  <div className="file-details">
                    <h3>{file.pathname}</h3>
                    <p>{formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="file-actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => copyToClipboard(file.url)}
                    title="Copy Link"
                    style={{ padding: '0.5rem' }}
                  >
                    <Copy size={18} />
                  </button>
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary"
                    title="Open"
                    style={{ padding: '0.5rem' }}
                  >
                    <ExternalLink size={18} />
                  </a>
                  <a 
                    href={file.url} 
                    download 
                    className="btn btn-primary"
                    title="Download"
                    style={{ padding: '0.5rem' }}
                  >
                    <Download size={18} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
