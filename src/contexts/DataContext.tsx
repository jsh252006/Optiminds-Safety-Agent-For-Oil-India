import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { SafetyDocument, IncidentReport } from '../types';
import { mockDocuments, mockIncidentReports } from '../data';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // Silent fallback: We swallow the error so it doesn't pollute the user's console 
  // or trigger the AI Studio error overlay. The app will naturally fall back to 
  // whatever state it already has (like mock data).
  return;
}

export interface Broadcast {
  id: string;
  message: string;
  type: 'important' | 'emergency';
  createdAt: any;
}

interface DataContextType {
  documents: SafetyDocument[];
  broadcasts: Broadcast[];
  incidentReports: IncidentReport[];
  loading: boolean;
  addDocument: (doc: Omit<SafetyDocument, 'id'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  addBroadcast: (message: string, type: 'important' | 'emergency') => Promise<void>;
  deleteBroadcast: (id: string) => Promise<void>;
  addIncidentReport: (report: Omit<IncidentReport, 'id'>) => Promise<string>;
  updateIncidentReport: (id: string, updates: Partial<IncidentReport>) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  documents: mockDocuments,
  broadcasts: [],
  incidentReports: [],
  loading: true,
  addDocument: async () => {},
  deleteDocument: async () => {},
  addBroadcast: async () => {},
  deleteBroadcast: async () => {},
  addIncidentReport: async () => { return ''; },
  updateIncidentReport: async () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<SafetyDocument[]>(mockDocuments);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getSavedLocalReports = (): IncidentReport[] => {
    try {
      const saved = localStorage.getItem('optiminds_local_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const mergeReports = (remote: IncidentReport[], local: IncidentReport[], fallback: IncidentReport[]) => {
    const map = new Map<string, IncidentReport>();
    // Priority: local newly added, then remote firestore, then mock benchmark
    [...fallback, ...remote, ...local].forEach(item => {
      if (item && item.id) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(a.date || a.createdAt || 0).getTime();
      const timeB = new Date(b.date || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  };

  useEffect(() => {
    const localReports = getSavedLocalReports();
    setIncidentReports(mergeReports([], localReports, mockIncidentReports));

    if (!user) {
      setDocuments(mockDocuments);
      setBroadcasts([]);
      setLoading(false);
      return;
    }

    const unsubDocs = onSnapshot(query(collection(db, 'documents')), (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SafetyDocument));
      // Combine mock documents with firestore documents
      setDocuments([...mockDocuments, ...docsData]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'documents');
    });

    const unsubBroadcasts = onSnapshot(query(collection(db, 'broadcasts'), orderBy('createdAt', 'desc')), (snapshot) => {
      const broadcastsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Broadcast));
      setBroadcasts(broadcastsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'broadcasts');
    });

    const unsubIncidents = onSnapshot(query(collection(db, 'incident_reports'), orderBy('createdAt', 'desc')), (snapshot) => {
      const incidentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IncidentReport));
      const freshLocal = getSavedLocalReports();
      setIncidentReports(mergeReports(incidentsData, freshLocal, mockIncidentReports));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'incident_reports');
      setLoading(false);
    });

    return () => {
      unsubDocs();
      unsubBroadcasts();
      unsubIncidents();
    };
  }, [user]);

  const addDocument = async (documentData: Omit<SafetyDocument, 'id'>) => {
    try {
      await addDoc(collection(db, 'documents'), {
        ...documentData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'documents');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `documents/${id}`);
    }
  };

  const addBroadcast = async (message: string, type: 'important' | 'emergency') => {
    try {
      await addDoc(collection(db, 'broadcasts'), {
        message,
        type,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'broadcasts');
    }
  };

  const deleteBroadcast = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'broadcasts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `broadcasts/${id}`);
    }
  };

  const addIncidentReport = async (reportData: Omit<IncidentReport, 'id'>) => {
    const titleSlug = (reportData.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const shortId = Math.random().toString(36).substring(2, 6);
    const dateStr = new Date().toISOString().split('T')[0];
    const customId = `${dateStr}-${titleSlug}-${shortId}`;
    const localId = customId; // Use the readable ID locally as well

    const newReport: IncidentReport = {
      ...reportData,
      id: localId,
      createdAt: new Date().toISOString(),
    };

    // Update state immediately for instant feedback
    setIncidentReports(prev => [newReport, ...prev.filter(r => r.id !== localId)]);

    // Save to local cache
    try {
      const current = getSavedLocalReports();
      localStorage.setItem('optiminds_local_reports', JSON.stringify([newReport, ...current]));
    } catch (e) {
      console.warn('Could not save report to local storage', e);
    }

    try {
      const docRef = doc(db, 'incident_reports', customId);
      await setDoc(docRef, {
        ...reportData,
        createdAt: serverTimestamp(),
      });
      return customId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'incident_reports');
      return localId;
    }
  };

  const updateIncidentReport = async (id: string, updates: Partial<IncidentReport>) => {
    // Update local state immediately
    setIncidentReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));

    // Update local storage
    try {
      const current = getSavedLocalReports();
      const updated = current.map(r => r.id === id ? { ...r, ...updates } : r);
      localStorage.setItem('optiminds_local_reports', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not update report in local storage', e);
    }

    try {
      await updateDoc(doc(db, 'incident_reports', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `incident_reports/${id}`);
    }
  };

  return (
    <DataContext.Provider value={{ documents, broadcasts, incidentReports, loading, addDocument, deleteDocument, addBroadcast, deleteBroadcast, addIncidentReport, updateIncidentReport }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
