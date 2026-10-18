import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, FileText, Search, ChevronDown, ChevronUp, ShieldAlert, Activity, FileCheck, CircleDashed, History, Plus, Mic, Download, Globe , ShieldCheck, Info, ShieldX, Cpu} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ReportAnalysisResult, PreventiveAction } from '../types';
import { cn, safeFormatDate } from '../lib/utils';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';

// Voice recognition declaration
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ReportAnalyzer() {
  const { t, languageName } = useLanguage();

  const highlightKeywords = (text: string, findings: any[]) => {
    if (!text || !findings || findings.length === 0) return text;
    
    // Extract phrases to highlight
    let allPhrases = [];
    findings.forEach(f => {
      // Create a few mock keywords based on the finding category/description
      if(f.category) allPhrases.push({ word: f.category, severity: f.severity });
      // Add standard hazard words if present
      const commonWords = ['leak', 'spill', 'fire', 'pressure', 'broken', 'compromised', 'failure', 'violation', 'hazard', 'risk', 'injury', 'routine', 'normal'];
      commonWords.forEach(w => {
         if (text.toLowerCase().includes(w)) {
           let sev = 'LOW';
           if (['leak', 'fire', 'compromised', 'failure', 'violation'].includes(w)) sev = 'HIGH';
           else if (['spill', 'pressure', 'hazard', 'broken'].includes(w)) sev = 'MEDIUM';
           allPhrases.push({ word: w, severity: sev });
         }
      });
    });
    
    // Deduplicate
    const uniquePhrases = Array.from(new Set(allPhrases.map(p => p.word.toLowerCase())))
      .map(w => allPhrases.find(p => p.word.toLowerCase() === w));

    if (uniquePhrases.length === 0) return text;

    // We'll just highlight the first matching occurrences for simplicity in UI
    const parts = text.split(new RegExp(`(${uniquePhrases.map(p => p.word).join('|')})`, 'gi'));
    
    return parts.map((part, i) => {
      const match = uniquePhrases.find(p => p?.word.toLowerCase() === part.toLowerCase());
      if (match) {
        const colorClass = 
          match.severity === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 px-1 py-0.5 rounded' :
          match.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-1 py-0.5 rounded' :
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-1 py-0.5 rounded';
        return <span key={i} className={`${colorClass} cursor-help transition-all hover:-translate-y-0.5 inline-block`} title={`Detected Hazard: ${match.word.toUpperCase()} (${match.severity})`}>{part}</span>;
      }
      return part;
    });
  };

  const { incidentReports, addIncidentReport, updateIncidentReport } = useData();
  const { user, userProfile } = useAuth();
  const [view, setView] = useState<'new' | 'history'>('new');
  
  const [reportTitle, setReportTitle] = useState('');
  const [field, setField] = useState('');
  const [customField, setCustomField] = useState('');
  const [site, setSite] = useState('');
  const [customSite, setCustomSite] = useState('');
  const [asset, setAsset] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [userConfirmedCategory, setUserConfirmedCategory] = useState('');
  const [activity, setActivity] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [reportType, setReportType] = useState('');
  const [contractor, setContractor] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('');
  const [sourceOfReport, setSourceOfReport] = useState('');
  const [reportText, setReportText] = useState('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<ReportAnalysisResult | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({});

  const [newActionText, setNewActionText] = useState('');
  const [isSifExpanded, setIsSifExpanded] = useState(false);

  const toggleFinding = (id: string) => {
    setExpandedFindings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageName === 'Hindi' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setReportText(prev => prev + (prev ? ' ' : '') + finalTranscript);
      }
    };
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        console.warn('Microphone access was denied or not allowed in this context.');
      } else {
        console.warn('Speech recognition error:', event.error);
      }
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("Could not start speech recognition:", e);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleAnalyze = async () => {
    if (!reportTitle.trim() || (!reportText.trim() && !reportFile)) {
      alert("Please provide a Title and Report (text or file).");
      return;
    }
    if (!field || !site) {
      alert("Please select a Field and Site before analyzing.");
      return;
    }
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      if (reportText) formData.append('reportText', reportText);
      if (reportFile) formData.append('reportFile', reportFile);
      formData.append('language', languageName);
      if (field) {
        formData.append('location', field === 'Other' ? customField : field);
      }
      if (site) {
        formData.append('site', site === 'Other' ? customSite : site);
      }
      if (eventCategory) formData.append('eventCategory', eventCategory);
      if (activity) formData.append('activity', activity);

      
      const res = await fetch('/api/analyze-incident', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to analyze incident');
        } else {
          throw new Error(`Failed to analyze incident (Status: ${res.status}).`);
        }
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid HTML response instead of JSON. This usually means the API route was not found (404). If you deployed to a static host like Netlify or Firebase Hosting, the Node.js backend API is missing. You must deploy to a platform that supports Node.js (e.g. Render, Railway, or Google Cloud Run).');
      }
      
      const analysis: ReportAnalysisResult = await res.json();
      
      let fileData: string | undefined = undefined;
      let fileName: string | undefined = undefined;
      if (reportFile) {
        fileName = reportFile.name;
        fileData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(reportFile);
        });
      }
      
      // Save report with user ownership and operational metadata
      const authorName = user?.displayName || (userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : user?.email?.split('@')[0]) || 'Field Engineer';
      const newReportId = await addIncidentReport({
        title: reportTitle || 'Incident Report',
        description: reportText || reportFile?.name || 'Uploaded File',
        analysis,
        preventiveActions: [],
        attachedFileName: fileName,
        attachedFileData: fileData,
        userId: user?.uid,
        userEmail: user?.email || undefined,
        userName: authorName,
        location: field === 'Other' ? customField || 'Unknown Field' : field || 'Main Processing Facility',
        site: site === 'Other' ? customSite || 'Unknown Site' : site || 'Main Processing Facility',
        asset: asset || 'Primary Station',
        eventCategory: userConfirmedCategory || eventCategory || analysis?.trendCategory || 'Process Safety',
        activity: activity || 'Field Operation',
        date: reportDate || new Date().toISOString(),
        reportType: reportType || 'Incident',
        contractor: contractor || undefined,
        incidentSeverity: incidentSeverity || (analysis?.riskScore >= 75 ? 'Critical' : analysis?.riskScore >= 40 ? 'Moderate' : 'Low'),
        sourceOfReport: sourceOfReport || 'Direct Upload',
      });
      
      setActiveReportId(newReportId);
      setActiveAnalysis(analysis);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze the report. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startNew = () => {
    setReportTitle('');
    setReportText('');
    setReportFile(null);
    setActiveAnalysis(null);
    setActiveReportId(null);
    setView('new');
  };

  const viewHistorical = (report: any) => {
    setReportTitle(report.title);
    setReportText(report.description);
    setActiveAnalysis(report.analysis);
    setActiveReportId(report.id);
    setView('new'); 
  };

  const handleAddAction = async () => {
    if (!newActionText.trim() || !activeReportId) return;
    
    const report = incidentReports.find(r => r.id === activeReportId);
    if (report) {
      const newAction: PreventiveAction = {
        id: Math.random().toString(36).substring(7),
        text: newActionText,
        status: 'PENDING'
      };
      const updatedActions = [...(report.preventiveActions || []), newAction];
      
      await updateIncidentReport(activeReportId, { preventiveActions: updatedActions });
      setNewActionText('');
    }
  };

  const toggleActionStatus = async (actionId: string) => {
    if (!activeReportId) return;
    const report = incidentReports.find(r => r.id === activeReportId);
    if (report && report.preventiveActions) {
      const updatedActions = report.preventiveActions.map(act => {
        if (act.id === actionId) {
          return {
            ...act,
            status: act.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
            dateCompleted: act.status === 'PENDING' ? new Date().toISOString() : undefined
          } as PreventiveAction;
        }
        return act;
      });
      await updateIncidentReport(activeReportId, { preventiveActions: updatedActions });
    }
  };

  const handleExport = () => {
    if (!activeAnalysis) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - margin * 2;
    
    let y = margin;
    
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxLineWidth);
      
      lines.forEach((line: string) => {
        if (y > 280) { // page height is ~297
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += fontSize * 0.4; // roughly line height
      });
      y += 4; // paragraph spacing
    };

    addText(`SAFETY ANALYSIS REPORT`, 16, true);
    addText(`Title: ${reportTitle || 'Incident Report'}`, 12, true);
    addText(`Date: ${new Date().toLocaleDateString()}`);
    addText(`Risk Score: ${activeAnalysis.riskScore} / 100`);
    addText(`Trend Category: ${activeAnalysis.trendCategory}`);
    y += 5;
    
    addText(`DETAILED SAFETY FINDINGS`, 14, true);
    activeAnalysis.findings.forEach((f, index) => {
      addText(`Finding ${index + 1}: ${f.finding}`, 12, true);
      addText(`Severity: ${f.severity} | Confidence: ${f.confidenceLevel || 'N/A'}`);
      addText(`Requirement: ${f.requirement}`);
      addText(`Recommended Action: ${f.recommendedAction}`);
      addText(`Source Evidence: "${f.evidence}"`);
      y += 5;
    });
    
    if (activeAnalysis.ruleBasedPrecautions && activeAnalysis.ruleBasedPrecautions.length > 0) {
      y += 5;
      addText(`RECOMMENDED PRECAUTIONS`, 14, true);
      activeAnalysis.ruleBasedPrecautions.forEach((p) => {
        addText(`Hazard: ${p.hazard}`, 12, true);
        p.precautions.forEach((prec) => {
          addText(`- ${prec}`);
        });
        addText(`Source: ${p.source}`);
        y += 5;
      });
    }
    
    doc.save(`safety_report_${reportTitle.replace(/\s+/g, '_') || 'export'}.pdf`);
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 75) return "text-red-600 border-red-600";
    if (score >= 40) return "text-amber-500 border-amber-500";
    return "text-emerald-500 border-emerald-500";
  };

  // Get current active report actions
  const activeActions = incidentReports.find(r => r.id === activeReportId)?.preventiveActions || [];

  return (
    <div className="h-full overflow-y-auto bg-transparent p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[11px] font-bold tracking-widest uppercase mb-3">
              AI-Powered Safety Intelligence
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {t('analyzer.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-3xl">
              {t('analyzer.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={startNew}
              className={cn("px-4 py-2 font-semibold rounded-lg flex items-center gap-2 transition-colors", view === 'new' ? "bg-slate-900 dark:bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750")}
            >
              <Plus className="w-4 h-4" /> New Analysis
            </button>
            <button 
              onClick={() => setView('history')}
              className={cn("px-4 py-2 font-semibold rounded-lg flex items-center gap-2 transition-colors", view === 'history' ? "bg-slate-900 dark:bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750")}
            >
              <History className="w-4 h-4" /> History
            </button>
          </div>
        </div>

        {view === 'history' ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Report Title</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Risk Score</th>
                  <th className="px-6 py-4">Issues Found</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {incidentReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No historical reports found.</td>
                  </tr>
                ) : (
                  incidentReports.map(report => (
                    <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{report.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {safeFormatDate(report.createdAt || report.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded font-bold text-xs border",
                          getRiskScoreColor(report.analysis?.riskScore || 0).replace('text-', 'bg-').replace('600', '50').replace('500', '50') + " " + getRiskScoreColor(report.analysis?.riskScore || 0)
                        )}>
                          {report.analysis?.riskScore || 0} / 100
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <span className="px-2 py-1 rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">
                            {report.analysis?.highPriorityIssues || 0} High
                          </span>
                          <span className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                            {report.analysis?.potentialIssues || 0} Total
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => viewHistorical(report)}
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {/* Dashboard KPIs */}
            {activeAnalysis && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 col-span-2 md:col-span-1 flex-col justify-center">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center mb-2">Overall Risk Score</div>
                  <div className={cn("w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-inner", getRiskScoreColor(activeAnalysis.riskScore))}>
                    <span className={cn("text-2xl font-bold", getRiskScoreColor(activeAnalysis.riskScore).split(' ')[0])}>
                      {activeAnalysis.riskScore || 0}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Rules Checked</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeAnalysis.rulesChecked || 0}</div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Potential Issues</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeAnalysis.potentialIssues || 0}</div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-bl-full -z-0"></div>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shrink-0 z-10">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="z-10">
                    <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">High Priority</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeAnalysis.highPriorityIssues || 0}</div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Trend Category</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{activeAnalysis.trendCategory || 'General'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: Input Area */}
              <div className="lg:col-span-4 space-y-6 sticky top-0">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Report Details</h3>
                  </div>
                  
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Incident Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Minor spill during refuelling" 
                      value={reportTitle}
                      onChange={e => setReportTitle(e.target.value)}
                      disabled={!!activeAnalysis || isAnalyzing}
                      className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
                    />
                  </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Field <span className="text-red-500">*</span></label>
                        <select
                          value={field}
                          onChange={(e) => setField(e.target.value)}
                          disabled={!!activeAnalysis || isAnalyzing}
                          className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
                        >
                          <option value="">Select Field</option>
                          <option value="Duliajan Field">Duliajan Field</option>
                          <option value="Moran Field">Moran Field</option>
                          <option value="Naharkatiya Field">Naharkatiya Field</option>
                          <option value="Digboi Field">Digboi Field</option>
                          <option value="Baghjan Field">Baghjan Field</option>
                          <option value="Kumchai Field">Kumchai Field</option>
                          <option value="Pipeline Network">Pipeline Network</option>
                          <option value="Pump Station">Pump Station</option>
                          <option value="Offshore / Other">Offshore / Other</option>
                          <option value="Other">Add New Field...</option>
                        </select>
                        {field === 'Other' && (
                          <input 
                            type="text" 
                            placeholder="Enter new field..."
                            value={customField}
                            onChange={(e) => setCustomField(e.target.value)}
                            disabled={!!activeAnalysis || isAnalyzing}
                            className="mt-2 w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Site <span className="text-red-500">*</span></label>
                        <select
                          value={site}
                          onChange={(e) => setSite(e.target.value)}
                          disabled={!!activeAnalysis || isAnalyzing}
                          className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
                        >
                          <option value="">Select Site</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="Other">Add New Site...</option>
                        </select>
                        {site === 'Other' && (
                          <input 
                            type="text" 
                            placeholder="Enter new site..."
                            value={customSite}
                            onChange={(e) => setCustomSite(e.target.value)}
                            disabled={!!activeAnalysis || isAnalyzing}
                            className="mt-2 w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Category <span className="text-red-500">*</span></label>
                      <select
                        value={eventCategory}
                        onChange={(e) => {
                          setEventCategory(e.target.value);
                          setUserConfirmedCategory(e.target.value);
                        }}
                        disabled={!!activeAnalysis || isAnalyzing}
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
                      >
                        <option value="">Auto-Detect via AI</option>
                        <option value="Near Miss">Near Miss</option>
                        <option value="Unsafe Act / Condition">Unsafe Act / Condition</option>
                        <option value="Blowout">Blowout</option>
                        <option value="Well Kick">Well Kick</option>
                        <option value="Pipeline Leak / Burst">Pipeline Leak / Burst</option>
                        <option value="Rig / Hoist Incident">Rig / Hoist Incident</option>
                        <option value="H2S Release">H2S Release</option>
                        <option value="Gas Leak">Gas Leak</option>
                        <option value="Oil Spill / Loss of Containment">Oil Spill / Loss of Containment</option>
                        <option value="Fire / Explosion">Fire / Explosion</option>
                        <option value="Process Safety Event">Process Safety Event</option>
                        <option value="Vehicle / Transportation">Vehicle / Transportation</option>
                        <option value="Chemical Exposure">Chemical Exposure</option>
                        <option value="Work at Height">Work at Height</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description / Observations</label>
                      {!activeAnalysis && !isAnalyzing && !reportFile && (
                        <button 
                          onClick={isRecording ? stopRecording : startRecording}
                          className={cn("text-xs font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors", isRecording ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600")}
                        >
                          <Mic className="w-3 h-3" />
                          {isRecording ? "Recording..." : "Dictate"}
                        </button>
                      )}
                    </div>
                    <textarea 
                      rows={6}
                      placeholder="Paste incident description here or dictate..." 
                      value={reportText}
                      onChange={e => setReportText(e.target.value)}
                      disabled={!!activeAnalysis || isAnalyzing || !!reportFile}
                      className={cn("w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-sm leading-relaxed transition-colors", isRecording ? "border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]" : "border-slate-300 dark:border-slate-600")}
                    ></textarea>
                  </div>

                  {!activeAnalysis && !isAnalyzing && (
                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                      <input 
                        type="file" 
                        accept=".pdf,.txt"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setReportFile(e.target.files[0]);
                            setReportText('');
                          }
                        }}
                      />
                      <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {reportFile ? reportFile.name : 'Upload PDF or Text File'}
                      </p>
                      {!reportFile && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">or drag and drop here</p>
                      )}
                      {reportFile && (
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setReportFile(null);
                          }}
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 mt-2 font-semibold relative z-10"
                        >
                          Remove file
                        </button>
                      )}
                    </div>
                  )}

                  {!activeAnalysis && (
                    <button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !reportTitle.trim() || (!reportText.trim() && !reportFile)}
                      className={cn(
                        "w-full py-3 px-4 rounded-xl font-semibold transition-all flex justify-center items-center gap-2",
                        isAnalyzing 
                          ? "bg-blue-600 text-white cursor-wait" 
                          : "bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white shadow-md hover:shadow-lg disabled:opacity-50"
                      )}
                    >
                      {isAnalyzing ? (
                        <>
                          <CircleDashed className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Run AI Analysis'
                      )}
                    </button>
                  )}

                  {/* Quick Actions after analysis */}
                  {activeAnalysis && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2">
                      <button 
                        onClick={handleExport}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download PDF Report
                      </button>
                      
                      {incidentReports.find(r => r.id === activeReportId)?.attachedFileData && (
                        <a 
                          href={incidentReports.find(r => r.id === activeReportId)?.attachedFileData}
                          download={incidentReports.find(r => r.id === activeReportId)?.attachedFileName || "original_upload"}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" /> Download Original PDF
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Analysis Results & Tracking */}
              <div className="lg:col-span-8 space-y-6">
                {!activeAnalysis && !isAnalyzing ? (
                  <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800/50">
                    <FileText className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-sm font-medium">Enter a report and analyze to view AI insights.</p>
                  </div>
                ) : isAnalyzing ? (
                  <div className="h-full min-h-[400px] border-2 border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800/50">
                    <Activity className="w-12 h-12 mb-4 animate-pulse" />
                    <p className="text-sm font-bold animate-pulse">AI is analyzing the report against safety standards...</p>
                  </div>
                ) : activeAnalysis && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* HSE Analytics Disclaimer */}
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-3 text-slate-600 dark:text-slate-300 text-xs shadow-sm">
                      <Info className="w-5 h-5 shrink-0 text-slate-400 dark:text-slate-500" />
                      <p>
                        <strong>AI Analysis Disclaimer:</strong> This platform provides AI-assisted safety analysis for decision support. AI-generated findings, precursor identification, SIF classification, risk rankings and recommendations must be reviewed and validated by qualified HSE personnel before operational or safety-critical decisions are made. The system does not replace official incident investigation, risk assessment, regulatory requirements, engineering judgement, or OIL/OISD procedures.
                      </p>
                    </div>

                    {/* Executive Summary & Event Classification */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-6">
                        {activeAnalysis.executiveSummary && (
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Executive Summary</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                              {activeAnalysis.executiveSummary}
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Event Classification</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Site / Location</p>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{incidentReports.find(r => r.id === activeReportId)?.site || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Activity</p>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{incidentReports.find(r => r.id === activeReportId)?.activity || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Event Category</p>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{incidentReports.find(r => r.id === activeReportId)?.eventCategory || activeAnalysis.aiSuggestedCategory || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Risk Level</p>
                              <p className={`font-bold ${activeAnalysis.riskScore >= 75 ? 'text-red-600 dark:text-red-400' : activeAnalysis.riskScore >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {activeAnalysis.riskScore >= 75 ? 'HIGH' : activeAnalysis.riskScore >= 40 ? 'MEDIUM' : 'LOW'} ({activeAnalysis.riskScore}/100)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-1">
                        {/* SIF Potential Card */}
                        <div className={`p-6 rounded-xl shadow-sm border h-full ${activeAnalysis.sifClassification?.includes('Potential SIF') ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/40' : activeAnalysis.sifClassification?.includes('Review') ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40' : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'}`}>
                          <div className="flex items-center gap-3 mb-2">
                            {activeAnalysis.sifClassification?.includes('Potential SIF') ? <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" /> : <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">Serious Injury / Fatality (SIF) Potential</h3>
                          </div>
                          
                          <div className="mt-4 space-y-4">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">SIF Potential</p>
                              <p className={`text-2xl font-black ${activeAnalysis.sifPotential === 'High' ? 'text-red-600 dark:text-red-400' : activeAnalysis.sifPotential === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {activeAnalysis.sifPotential || 'Uncertain'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Classification</p>
                              <p className="font-bold text-slate-700 dark:text-slate-200">{activeAnalysis.sifClassification || 'Requires Review'}</p>
                            </div>
                            {activeAnalysis.sifConfidence && (
                              <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Confidence</p>
                                <p className="font-semibold text-slate-700 dark:text-slate-300">{activeAnalysis.sifConfidence}%</p>
                              </div>
                            )}
                            
                            {activeAnalysis.sifExplanation && (
                              <div className="mt-4 border-t border-slate-200 dark:border-slate-700/60 pt-3">
                                <button
                                  onClick={() => setIsSifExpanded(!isSifExpanded)}
                                  className="w-full flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                >
                                  <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Analysis Reasoning
                                  </span>
                                  {isSifExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                
                                {isSifExpanded && (
                                  <div className="mt-3 space-y-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="bg-white/70 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700">
                                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {activeAnalysis.sifExplanation.reasoning}
                                      </p>
                                    </div>
                                    
                                    {activeAnalysis.sifExplanation.evidence && activeAnalysis.sifExplanation.evidence.length > 0 && (
                                      <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-2">Supporting Evidence</p>
                                        <ul className="space-y-2">
                                          {activeAnalysis.sifExplanation.evidence.map((quote: string, i: number) => (
                                            <li key={i} className="flex gap-2">
                                              <span className="text-blue-500 mt-0.5 flex-shrink-0">&quot;</span>
                                              <span className="text-slate-600 dark:text-slate-300 italic text-xs leading-relaxed">{quote}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {activeAnalysis.humanReviewRequired && (
                              <div className="mt-4 bg-white/70 dark:bg-slate-800/70 p-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <AlertTriangle className="w-4 h-4 text-amber-500 inline mr-1 -mt-0.5" />
                                Requires human HSE validation
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Precursors and Barriers */}
                    {(activeAnalysis.precursors || activeAnalysis.barrierConcerns) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeAnalysis.precursors && activeAnalysis.precursors.length > 0 && (
                          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                              <Activity className="w-4 h-4 text-blue-500" /> Detected Precursors
                            </h3>
                            <div className="space-y-4">
                              {activeAnalysis.precursors.map((p: any, i: number) => (
                                <div key={i} className="border-l-2 border-blue-500 pl-3">
                                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{p.category}</p>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{p.signal}</p>
                                  <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-800">
                                    " {p.evidence} "
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {activeAnalysis.barrierConcerns && activeAnalysis.barrierConcerns.length > 0 && (
                          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                              <ShieldX className="w-4 h-4 text-red-500" /> Barrier Concerns
                            </h3>
                            <div className="space-y-4">
                              {activeAnalysis.barrierConcerns.map((b: any, i: number) => (
                                <div key={i} className={`border-l-2 ${b.riskLevel === 'HIGH' ? 'border-red-500' : 'border-amber-500'} pl-3`}>
                                  <div className="flex justify-between items-start mb-1">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">{b.barrier}</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${b.riskLevel === 'HIGH' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>{b.riskLevel}</span>
                                  </div>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{b.concern}</p>
                                  <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-800">
                                    " {b.evidence} "
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Findings List */}
                    {activeAnalysis.findings && activeAnalysis.findings.length > 0 && (
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                          Detailed Safety Findings
                        </h2>
                        <div className="space-y-4">
                          {activeAnalysis.findings.map((finding: any, i: number) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                              <div className={cn(
                                "h-1.5 w-full",
                                finding.severity === 'HIGH' ? "bg-red-500" :
                                finding.severity === 'MEDIUM' ? "bg-amber-500" : "bg-emerald-500"
                              )} />
                              
                              <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex gap-3 items-center">
                                    <span className={cn(
                                      "px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider",
                                      finding.severity === 'HIGH' ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800" :
                                      finding.severity === 'MEDIUM' ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800" :
                                      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                    )}>
                                      {finding.severity} SEVERITY
                                    </span>
                                    {finding.confidenceLevel && (
                                      <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider",
                                        finding.confidenceLevel === 'HIGH' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" :
                                        finding.confidenceLevel === 'MEDIUM' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800" :
                                        "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                      )}>
                                        {finding.confidenceLevel} CONFIDENCE
                                      </span>
                                    )}
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                      <FileText className="w-3 h-3" />
                                      {finding.source}
                                    </span>
                                  </div>
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug mb-3">
                                  {finding.finding}
                                </h3>
                                
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-4">
                                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Requirement:</p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{finding.requirement}</p>
                                </div>

                                <button 
                                  onClick={() => toggleFinding(finding.id || String(i))}
                                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors w-full"
                                >
                                  {expandedFindings[finding.id || String(i)] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  {expandedFindings[finding.id || String(i)] ? "Hide AI Reasoning & Evidence" : "View AI Reasoning & Evidence"}
                                </button>
                                
                                {/* AI Evidence Panel */}
                                {expandedFindings[finding.id || String(i)] && (
                                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4 animate-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                          <Search className="w-3 h-3" /> Extracted Text (Evidence)
                                        </p>
                                        <p className="text-sm text-amber-900 dark:text-amber-200 italic font-medium">"{finding.evidence || finding.reportEvidence}"</p>
                                      </div>
                                      <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200 dark:border-blue-900/40">
                                        <p className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" /> Recommended Action
                                        </p>
                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">{finding.recommendedAction}</p>
                                      </div>
                                    </div>
                                    {(finding.explainableMatch || finding.matchedConcepts) && (
                                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Standard Reference Concepts</p>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                          {(finding.matchedConcepts || finding.explainableMatch?.matchedConcepts || []).map((concept: string, cIdx: number) => (
                                            <span key={cIdx} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded">
                                              {concept}
                                            </span>
                                          ))}
                                        </div>
                                        <div className="text-[11px] font-semibold text-slate-400">
                                          Mapped Topic: <span className="text-slate-600 dark:text-slate-300">{finding.applicableTopic || finding.explainableMatch?.applicableTopic || 'N/A'}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Preventive Action Tracker */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mt-8">
                      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Preventive Action Tracker</h2>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4 mb-6">
                          {activeActions.length === 0 ? (
                            <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                              No corrective actions logged yet. Add one below.
                            </div>
                          ) : (
                            activeActions.map((action, idx) => (
                              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                <button 
                                  onClick={() => toggleActionStatus(action.id)}
                                  className={cn("mt-0.5 shrink-0 transition-colors", action.status === 'COMPLETED' ? "text-emerald-500" : "text-slate-300 dark:text-slate-600 hover:text-emerald-400")}
                                >
                                  <CheckCircle className="w-6 h-6" />
                                </button>
                                <div className="flex-1">
                                  <p className={cn("text-sm font-semibold", action.status === 'COMPLETED' ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-800 dark:text-slate-200")}>
                                    {action.text}
                                  </p>
                                  {action.dateCompleted && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Completed on {format(new Date(action.dateCompleted), 'PPp')}</p>
                                  )}
                                </div>
                                <div className="shrink-0">
                                  <span className={cn(
                                    "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                                    action.status === 'COMPLETED' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                  )}>
                                    {action.status}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Log a corrective action (e.g., Replace valve, Conduct LOTO check)..."
                            value={newActionText}
                            onChange={(e) => setNewActionText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                            className="flex-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                          />
                          <button 
                            onClick={handleAddAction}
                            disabled={!newActionText.trim()}
                            className="px-4 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            Add Log
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
