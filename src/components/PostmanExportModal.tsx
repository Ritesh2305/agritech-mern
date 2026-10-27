import React, { useState } from 'react';
import { X, Download, Code2, Copy, Check } from 'lucide-react';
import { getPostmanCollection } from '../../shared/postmanCollection.ts';

interface PostmanExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostmanExportModal: React.FC<PostmanExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const collection = getPostmanCollection('http://localhost:3000/api/v1');
  const jsonString = JSON.stringify(collection, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AgriTech_Postman_Collection.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-3xl p-6 shadow-xl relative animate-in fade-in duration-200 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>REST API Documentation</span>
            <span aria-hidden="true">·</span>
            <span>Postman Collection v2.1.0</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-600" />
            AgriTech RESTful API Specification
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Pre-configured requests for Authentication, Farm CRUD, Crop Monitoring, Soil Diagnostics, Weather, Orders, and Consultations.
          </p>
        </div>

        {/* JSON Preview */}
        <div className="flex-1 overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-950 p-4 mb-4">
          <pre className="text-xs text-emerald-400 font-mono h-72 overflow-y-auto scrollbar-thin">
            {jsonString}
          </pre>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="text-xs text-stone-500">
            Base Endpoint: <span className="font-mono text-stone-800 dark:text-stone-200">http://localhost:3000/api/v1</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Postman JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
