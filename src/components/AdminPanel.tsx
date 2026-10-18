import React, { useState } from 'react';
import { Settings, Upload, CheckCircle2, Shield, AlertTriangle, MessageSquare, Trash2, Plus, Info, Loader2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { SafetyDocument, DocumentStatus } from '../types';

export default function AdminPanel() {
  const { documents, broadcasts, addDocument, deleteDocument, addBroadcast, deleteBroadcast } = useData();
  const [showDocModal, setShowDocModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // New Doc Form
  const [docName, setDocName] = useState('');
  const [docStandard, setDocStandard] = useState('');
  const [docOrganization, setDocOrganization] = useState('OIL');
  const [docVersion, setDocVersion] = useState('');
  const [docStatus, setDocStatus] = useState<DocumentStatus>('CURRENT');
  const [docArea, setDocArea] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  // New Broadcast Form
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState<'important' | 'emergency'>('important');

  const currentCount = documents.filter(d => d.status === 'CURRENT').length;
  const supersededCount = documents.filter(d => d.status === 'SUPERSEDED').length;

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalyzeError('');
    
    let aiAnalysis = undefined;
    
    if (docFile) {
      try {
        const formData = new FormData();
        formData.append('document', docFile);
        
        const res = await fetch('/api/analyze-document', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to analyze document');
          } else {
            throw new Error(`Failed to analyze document (Status: ${res.status}).`);
          }
        }
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned an invalid HTML response instead of JSON. This usually means the API route was not found (404). If you deployed to a static host like Netlify or Firebase Hosting, the Node.js backend API is missing. You must deploy to a platform that supports Node.js (e.g. Render, Railway, or Google Cloud Run).');
        }
        
        aiAnalysis = await res.json();
      } catch (err: any) {
        console.error("Analysis Error:", err);
        setAnalyzeError(err.message || 'Error running AI analysis. Please try again.');
        setIsAnalyzing(false);
        return; // Don't proceed if it errors, let them see the error
      }
    }

    await addDocument({
      name: docName,
      type: 'Standard',
      organization: docOrganization,
      standardNumber: docStandard,
      version: docVersion,
      publicationDate: new Date().toISOString().split('T')[0],
      status: docStatus,
      applicableArea: docArea.split(',').map(a => a.trim()).filter(Boolean),
      ...(aiAnalysis ? { aiAnalysis } : {}),
    });
    setShowDocModal(false);
    setIsAnalyzing(false);
    // Reset
    setDocName(''); setDocStandard(''); setDocVersion(''); setDocArea(''); setDocFile(null);
  };

  const handleAddBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBroadcast(broadcastMsg, broadcastType);
    setShowBroadcastModal(false);
    setBroadcastMsg('');
  };

  return (
    <div className="h-full bg-transparent p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-800 dark:text-slate-200" />
            Safety Knowledge Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage official safety documents, RAG indices, and global broadcasts.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-900/40">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Docs</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{documents.length}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100/50 dark:border-emerald-900/40">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Current</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{currentCount}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-amber-100/50 dark:border-amber-900/40">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Superseded</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{supersededCount}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-900/40">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Broadcasts</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{broadcasts.length}</div>
            </div>
          </div>
        </div>

        {/* Global Broadcasts */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Global Broadcasts</h2>
            <button 
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Broadcast
            </button>
          </div>
          <div className="p-6">
            {broadcasts.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">No active broadcasts.</div>
            ) : (
              <div className="space-y-4">
                {broadcasts.map(b => (
                  <div key={b.id} className="flex items-start justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                      {b.type === 'emergency' ? (
                        <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                      ) : (
                        <Info className="w-6 h-6 text-blue-600 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{b.message}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">{b.type} Message</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteBroadcast(b.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 p-2 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documents Management */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Knowledge Base Documents</h2>
            <button 
              onClick={() => setShowDocModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Areas</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-750/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{doc.standardNumber}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{doc.name}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{doc.organization} • {doc.version}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        doc.status === 'CURRENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                        doc.status === 'SUPERSEDED' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.applicableArea.map((area, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {doc.id.startsWith('doc-') ? (
                        <span className="text-xs text-slate-400 italic">Mock Data</span>
                      ) : (
                        <button 
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 p-2 rounded-lg transition-colors inline-block"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modals */}
      {showDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Upload Safety Document</h3>
            <form onSubmit={handleAddDoc} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Name</label>
                <input required type="text" value={docName} onChange={e => setDocName(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Number (e.g. OISD-STD-XXX)</label>
                <input required type="text" value={docStandard} onChange={e => setDocStandard(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization</label>
                  <select value={docOrganization} onChange={e => setDocOrganization(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="OIL">OIL</option>
                    <option value="OISD">OISD</option>
                    <option value="Statutory">Statutory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Version/Rev</label>
                  <input required type="text" value={docVersion} onChange={e => setDocVersion(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select value={docStatus} onChange={e => setDocStatus(e.target.value as DocumentStatus)} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="CURRENT">CURRENT</option>
                  <option value="SUPERSEDED">SUPERSEDED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                  <option value="PENDING VERIFICATION">PENDING VERIFICATION</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Applicable Areas (comma separated)</label>
                <input required type="text" value={docArea} onChange={e => setDocArea(e.target.value)} placeholder="PPE, Fire Safety, Hot Work" className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Upload Document for AI Analysis (Optional)</label>
                <input type="file" accept=".txt,.pdf,.md,.csv" onChange={e => setDocFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-950/60 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">If uploaded, AI will analyze hazards & precautions.</p>
              </div>

              {analyzeError && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 p-2 rounded border border-red-100 dark:border-red-900/40">
                  {analyzeError}
                </div>
              )}

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowDocModal(false)} className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isAnalyzing} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isAnalyzing ? 'Analyzing with AI...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBroadcastModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">New Broadcast</h3>
            <form onSubmit={handleAddBroadcast} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea required rows={3} value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Site shutdown for national holiday..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors ${broadcastType === 'important' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                    <input type="radio" name="type" value="important" checked={broadcastType === 'important'} onChange={() => setBroadcastType('important')} className="hidden" />
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">Important</span>
                  </label>
                  <label className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors ${broadcastType === 'emergency' ? 'border-red-600 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                    <input type="radio" name="type" value="emergency" checked={broadcastType === 'emergency'} onChange={() => setBroadcastType('emergency')} className="hidden" />
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-medium">Emergency</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowBroadcastModal(false)} className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">Send Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
