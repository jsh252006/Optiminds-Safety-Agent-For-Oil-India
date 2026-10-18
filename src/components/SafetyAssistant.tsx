import { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, ShieldCheck, Info, FileText, Bot, ShieldAlert, CheckCircle2, Mic, MicOff, Volume2, VolumeX, Activity, CheckSquare } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { audio } from '../lib/audio';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import OilyAILogo from './OilyAILogo';

interface SafetyAssistantProps {
  key?: string;
  mode?: 'general' | 'emergency' | 'inspector';
  isFloating?: boolean;
}

export default function SafetyAssistant({ mode = 'general', isFloating = false }: SafetyAssistantProps) {
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [wasVoiceInput, setWasVoiceInput] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { languageName, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  
    
  useEffect(() => {
    const fetchQueries = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/queries', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        if (res.ok) {
          const data = await res.json();
          setRecentQueries(data);
        }
      } catch (err) {
        console.error("Failed to fetch queries:", err);
      }
    };
    fetchQueries();
  }, [user]);

  const getWelcomeMessage = () => {
    if (mode === 'emergency') {
      return languageName === 'Hindi' 
        ? 'आपातकालीन सहायता मोड। मैं आपातकालीन प्रक्रियाओं, निकासी और प्राथमिक चिकित्सा प्रोटोकॉल के लिए स्टैंडबाय पर हूँ। आपकी स्थिति क्या है?'
        : 'Oily AI Emergency Mode. I am on standby for immediate evacuation procedures, first aid protocols, and crisis response. What is your situation?';
    }
    
    if (mode === 'inspector') {
      return languageName === 'Hindi'
        ? 'सुरक्षा निरीक्षक एआई। मैं कार्यस्थल के खतरों की पहचान करने और अनुपालन जांच में मदद कर सकता हूँ। आप किस क्षेत्र का निरीक्षण कर रहे हैं?'
        : 'Safety Inspector AI. I can assist with identifying workplace hazards, checklist generation, and compliance checking. What area are you inspecting?';
    }
    
    return languageName === 'Hindi' 
        ? 'नमस्ते! मैं ऑयली एआई सुरक्षा सहायक हूँ। OIL और OISD दिशानिर्देशों के आधार पर मुझसे नियम, पीपीई, या सर्वोत्तम प्रथाओं के बारे में कुछ भी पूछें।'
        : 'Hello! I am Oily, the OPTIMINDS Safety AI Assistant. Ask me anything about safety rules, PPE, or best practices based on OIL and OISD guidelines.';
  };;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMessage(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
       console.error("SpeechSynthesis not supported.");
       return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      // Strip markdown
      const cleanText = text.replace(/[*#_`]/g, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      
      const langCode = languageName === 'Hindi' ? 'hi-IN' : 'en-IN';
      utterance.lang = langCode;
      
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        let voiceToUse = voices.find(v => v.lang.includes(langCode));
        if (!voiceToUse && languageName === 'Hindi') voiceToUse = voices.find(v => v.lang.includes('hi'));
        if (!voiceToUse) voiceToUse = voices.find(v => v.lang.includes('en'));
        
        if (voiceToUse) {
          utterance.voice = voiceToUse;
        }
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
utterance.onerror = (e: any) => {
         if (e.error !== 'interrupted' && e.error !== 'canceled') {
            // Silently handle expected browser synthesis interruptions
            console.log("SpeechSynthesis stopped or interrupted.");
         }
         setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }
    
    const recognition = new SpeechRecognition();
    const langCode = languageName === 'Hindi' ? 'hi-IN' : 'en-US';
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join();
      
      setWasVoiceInput(true);
      setQuery(transcript);
    };
    
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        console.warn('Microphone access was denied or not allowed in this context.');
      } else {
        console.warn('Speech recognition error:', event.error);
      }
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("Could not start speech recognition:", e);
      setIsListening(false);
    }
  };

  const handleSend = async () => {
    if (!(query || '').trim()) return;

    const lowerQuery = query.toLowerCase();
    let themeChanged = false;
    let newTheme: 'light' | 'dark' | 'system' = 'light';

    if (lowerQuery.includes('dark mode') || lowerQuery.includes('dark theme') || lowerQuery.includes('change theme to dark') || lowerQuery.includes('darken')) {
      setTheme('dark');
      themeChanged = true;
      newTheme = 'dark';
    } else if (lowerQuery.includes('light mode') || lowerQuery.includes('light theme') || lowerQuery.includes('change theme to light') || lowerQuery.includes('lighten')) {
      setTheme('light');
      themeChanged = true;
      newTheme = 'light';
    } else if (lowerQuery.includes('system mode') || lowerQuery.includes('system theme') || lowerQuery.includes('change theme to system')) {
      setTheme('system');
      themeChanged = true;
      newTheme = 'system';
    }

    
    
    
    const currentQuery = query.trim();
    if (currentQuery) {
      const updated = [currentQuery, ...recentQueries.filter(q => q !== currentQuery)].slice(0, 15);
      setRecentQueries(updated);
      
      if (user) {
        user.getIdToken().then(token => {
          fetch('/api/queries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ queryText: currentQuery })
          }).catch(err => console.error("Failed to save query:", err));
        });
      }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query
    };
    const newMessages = [...messages, userMessage];

    // Basic Task & Greeting Fast-Path (Reduces Server Load & Makes it Faster)
    const basicGreetings = ['hi', 'hello', 'hey', 'hi oily', 'hello oily'];
    const basicIdentity = ['who are you', 'what are you', 'who are you?', 'what is your name?'];
    
    if (basicGreetings.includes(lowerQuery.trim())) {
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setQuery('');
      
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: languageName === 'Hindi' ? 'नमस्ते! मैं ऑयली हूँ, ऑयल इंडिया लिमिटेड का सुरक्षा सहायक। मैं आपकी क्या मदद कर सकता हूँ?' : 'Hello! I am Oily, the OPTIMINDS Safety AI Assistant for Oil India Limited. How can I help you with safety protocols today?',
          confidence: 'HIGH'
        };
        setMessages(prev => [...prev, aiResponse]);
        audio.playNotification();
        if (autoSpeak || wasVoiceInput) speakText(aiResponse.content);
        setWasVoiceInput(false);
      }, 400);
      return;
    }
    
    if (basicIdentity.includes(lowerQuery.trim())) {
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setQuery('');
      
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: languageName === 'Hindi' ? 'मैं ऑयली हूँ, ऑयल इंडिया लिमिटेड के लिए बनाया गया एक विशेष एआई सुरक्षा सहायक। मेरा काम ओआईएसडी मानकों के आधार पर आपको सुरक्षित रखना है।' : 'I am Oily, a specialized AI Safety Assistant built exclusively for Oil India Limited. My job is to keep you safe based on OISD standards.',
          confidence: 'HIGH'
        };
        setMessages(prev => [...prev, aiResponse]);
        audio.playNotification();
        if (autoSpeak || wasVoiceInput) speakText(aiResponse.content);
        setWasVoiceInput(false);
      }, 400);
      return;
    }
    

    if (themeChanged) {
      setMessages(newMessages);
      setQuery('');

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I have updated the website theme to ${newTheme} mode for you.`
      };
      setMessages(prev => [...prev, aiResponse]);
      audio.playNotification();
      
      if (autoSpeak || wasVoiceInput) {
        speakText(`I have updated the website theme to ${newTheme} mode for you.`);
      }
      setWasVoiceInput(false);
      return;
    }

    
// Unlock speech synthesis on user interaction
    if ('speechSynthesis' in window) {
      const unlockUtterance = new SpeechSynthesisUtterance('');
      unlockUtterance.volume = 0;
      unlockUtterance.onerror = () => {}; // Ignore errors on silent unlock
      window.speechSynthesis.speak(unlockUtterance);
    }


    setIsTyping(true);
    setMessages(newMessages);
    setQuery('');

    try {

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          messages: newMessages,
          language: languageName
        })
      });

      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        let errorMsg = 'Failed to fetch response';
        try {
          if (contentType && contentType.includes('application/json')) {
            const errData = await res.json();
            errorMsg = errData.error || errorMsg;
          } else {
            errorMsg = `Server returned HTTP ${res.status} (${res.statusText})`;
          }
        } catch(e) {}
        throw new Error(errorMsg);
      }
      
      if (!contentType || !contentType.includes('application/json')) {
         throw new Error('The server is currently unavailable or experiencing high demand. Please try again later.');
      }
      
      const data = await res.json();
      
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (idToken) {
          await fetch('/api/queries', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ queryText: userMessage.content })
          });
        }
      } catch (err) {
        console.error("Failed to save query to db:", err);
      }
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        structuredResponse: data.structuredResponse,
        confidence: data.confidence,
        isEmergency: data.content?.toLowerCase().includes('emergency') || data.structuredResponse?.important?.toLowerCase().includes('emergency')
      };

      setMessages(prev => [...prev, aiResponse]);
      audio.playNotification();

      if (autoSpeak || wasVoiceInput) {
        const textToSpeak = data.content || (data.structuredResponse ? data.structuredResponse.answer : '');
        if (textToSpeak) {
          speakText(textToSpeak);
        }
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message?.includes('503') || error.message?.includes('500') || error.message?.includes('unavailable') || error.message?.includes('high demand') 
        ? "The AI safety model is currently experiencing high demand. Please try asking your question again in a few moments."
        : error.message || "I'm having trouble connecting to the server. Please ensure the GEMINI_API_KEY is configured correctly.";
        
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage
      };
      setMessages(prev => [...prev, errorResponse]);
      audio.playNotification();

      if (autoSpeak || wasVoiceInput) {
        speakText(errorMessage);
      }
    } finally {
      setIsTyping(false);
      setWasVoiceInput(false);
    }
  };

  return (
    <div className="flex h-full absolute inset-0 bg-slate-50 dark:bg-slate-900 overflow-hidden z-0">
      {!isFloating && (
        <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-col hidden md:flex shrink-0 h-full">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Recent Q&A
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {recentQueries.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 p-2 text-center mt-4">No recent queries.</p>
            ) : (
              recentQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(q)}
                  className="w-full text-left text-sm p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors truncate"
                  title={q}
                >
                  {q}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scroll-smooth">
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-10">
          
          {/* Header Introduction (Only visible at top) */}
          {messages.length <= 1 && (
            <div className="text-center py-10">
              <div className="mx-auto mb-6 flex justify-center">
                <OilyAILogo size="xl" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
                {mode === 'emergency' ? 'Oily AI' : mode === 'inspector' ? 'Safety Inspector' : 'Ask Oily AI'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                {mode === 'emergency' 
                  ? 'Immediate response for emergency protocols, evacuations, and first aid.'
                  : mode === 'inspector'
                  ? 'AI assistant for workplace hazard identification and compliance checking.'
                  : 'Your intelligent safety companion. Ask questions about procedures, PPE, or regulatory compliance, grounded entirely in the OIL India official knowledge base.'}
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              
              {/* Avatar for Assistant */}
              {msg.role === 'assistant' && (
                <OilyAILogo size="sm" className="mr-4 mt-1" />
              )}

              <div className={cn(
                "max-w-3xl rounded-xl p-6 shadow-sm",
                msg.role === 'user' 
                  ? "bg-slate-700 text-white rounded-tr-sm" 
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-md"
              )}>
                {msg.role === 'user' ? (
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="space-y-6">
                    {msg.isEmergency && (
                      <div className="bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 p-4 rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-900/50">
                        <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                        <div>
                          <h4 className="font-bold uppercase tracking-widest text-[11px] mb-1">Immediate Action Required</h4>
                          <p className="text-sm font-medium leading-relaxed">{msg.structuredResponse?.important}</p>
                        </div>
                      </div>
                    )}

                    {msg.content && !msg.structuredResponse && (
                      <p className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">{msg.content}</p>
                    )}

                    {msg.structuredResponse && (
                      <div className="space-y-6 text-slate-800 dark:text-slate-200">
                        {msg.confidence && (
                          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confidence Score</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border",
                              msg.confidence === 'HIGH' ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300" :
                              msg.confidence === 'MEDIUM' ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300" :
                              "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300"
                            )}>
                              {msg.confidence}
                            </span>
                          </div>
                        )}

                        <div>
                          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Directive</h3>
                          <p className="font-bold text-xl text-slate-900 dark:text-slate-100 leading-tight">{msg.structuredResponse.answer}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rationale</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">{msg.structuredResponse.why}</p>
                        </div>
                        
                        <div className="bg-red-50/50 dark:bg-red-950/30 border border-red-100/50 dark:border-red-900/40 p-4 rounded-xl">
                          <h3 className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-2">Official Requirement</h3>
                          <p className="text-red-900 dark:text-red-200 font-semibold leading-relaxed">{msg.structuredResponse.requirement}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Required Precautions</h3>
                          <ul className="space-y-2">
                            {msg.structuredResponse.precautions.map((precaution, idx) => (
                              <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 items-start">
                                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{precaution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mt-6">
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Source Document Citation</h3>
                          </div>
                          <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                            <div className="text-slate-500 dark:text-slate-400 font-medium">Document</div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{msg.structuredResponse.source.document}</div>
                            
                            <div className="text-slate-500 dark:text-slate-400 font-medium">Standard No</div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{msg.structuredResponse.source.standardNumber}</div>
                            
                            <div className="text-slate-500 dark:text-slate-400 font-medium">Section</div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{msg.structuredResponse.source.section}</div>
                            
                            {msg.structuredResponse.source.version && (
                              <>
                                <div className="text-slate-500 dark:text-slate-400 font-medium">Version</div>
                                <div className="font-semibold text-slate-800 dark:text-slate-200">{msg.structuredResponse.source.version}</div>
                              </>
                            )}
                          </div>
                        </div>

                        {!msg.isEmergency && msg.structuredResponse.important && (
                          <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl mt-4 border border-slate-200 dark:border-slate-700">
                            <Info className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                            <p className="leading-relaxed font-medium">{msg.structuredResponse.important}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100/80 mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        {isSpeaking ? (
                          <button 
                            onClick={stopSpeaking}
                            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-full transition-colors uppercase tracking-widest"
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                            Stop Reading
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              const textToSpeak = msg.content || (msg.structuredResponse ? msg.structuredResponse.answer : '');
                              if (textToSpeak) speakText(textToSpeak);
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-full transition-colors uppercase tracking-widest"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            {t('assistant.read_aloud') || 'Read Aloud'}
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-400 italic">
                          AI-generated content. Please verify important safety information against official OIL India guidelines.
                        </p>
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3" />
                          FOR INFORMATIONAL PURPOSES ONLY. IN AN EMERGENCY, FOLLOW SITE PROCEDURES IMMEDIATELY.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start items-end gap-4">
              <OilyAILogo size="sm" />
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-xl rounded-tl-sm p-5 shadow-sm flex items-center gap-2 h-[52px]">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-10 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-2 px-1">
          <button 
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={cn(
              "flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors border",
              autoSpeak 
                ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-100" 
                : "bg-slate-100 dark:bg-slate-800/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 dark:text-slate-400 border-slate-200 dark:border-slate-700 dark:border-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700"
            )}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {autoSpeak ? t('assistant.voice_on') || "Voice Output On" : t('assistant.voice_off') || "Voice Output Off"}
          </button>
        </div>
        <div className="max-w-4xl mx-auto relative flex gap-2">
          <button
            onClick={toggleListen}
            className={cn(
              "shrink-0 p-4 rounded-xl border transition-all shadow-sm flex items-center justify-center",
              isListening 
                ? "bg-red-100 border-red-300 text-red-600 animate-pulse" 
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:border-slate-700 text-slate-600 dark:text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-900 dark:bg-slate-900/50"
            )}
            title={isListening ? (t('assistant.listening_stop') || "Stop listening") : (t('assistant.listening_start') || "Start speaking")}
          >
            {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
          
          <div className="relative flex-1">
            <input 
              type="text" 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setWasVoiceInput(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? (t('assistant.listening') || "Listening...") : t('assistant.placeholder')}
              className="w-full pl-4 pr-12 md:pl-5 md:pr-14 py-3 md:py-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-800/50 focus:border-red-800 bg-white dark:bg-slate-800 shadow-sm transition-all text-[15px]"
            />
            <button 
              id="ai-send-btn"
              onClick={handleSend}
              disabled={!(query || '').trim() || isTyping}
              className="absolute right-2 md:right-2.5 top-1.5 md:top-2.5 p-1.5 md:p-2 bg-red-800 text-amber-400 rounded-xl hover:bg-red-900 disabled:opacity-50 disabled:hover:bg-red-800 transition-colors shadow-sm hover:shadow"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="text-center mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex flex-col items-center gap-1">
          <span>Answers are strictly retrieved from the indexed OIL/OISD Safety Knowledge Base.</span>
          <span className="text-amber-600 dark:text-amber-500">AI acts as a decision-support tool and does not replace qualified HSE professionals or issue final emergency commands.</span>
        </div>

      </div>
    </div>
    </div>
  );
}
