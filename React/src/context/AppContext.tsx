import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

// ─── Types (Aligned with Backend) ──────────────────────────────────────────────

export type CourseType = 'UG' | 'PG';
export type EntryType = 'REGULAR' | 'LATERAL';
export type AdmissionMode = 'GOVERNMENT' | 'MANAGEMENT';
export type QuotaName = 'KCET' | 'COMEDK' | 'MANAGEMENT';
export type DocStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED';
export type FeeStatus = 'PENDING' | 'PAID';
export type Category = 'GM' | 'SC' | 'ST' | 'OBC' | 'EWS';

export interface Institution {
    id: number;
    name: string;
    code: string;
    address: string;
}

export interface Campus {
    id: number;
    name: string;
    institutionId: number;
    location: string;
}

export interface Department {
    id: number;
    name: string;
    campusId: number;
    hod: string;
}

export interface AcademicYear {
    id: number;
    year: string;
    isActive: boolean;
}

export interface Program {
    id: number;
    name: string;
    departmentId: number;
    courseType: CourseType;
    entryType: EntryType;
    admissionMode: AdmissionMode;
    totalIntake: number;
}

export interface Quota {
    id: number;
    programId: number;
    name: QuotaName;
    totalSeats: number;
    filledSeats: number;
}

export interface DocItem {
    id?: number;
    name: string;
    status: DocStatus;
}

export interface Applicant {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    category: Category;
    entryType: EntryType;
    quotaType: QuotaName;
    qualifyingExam: string;
    marks: number;
    allotmentNumber?: string;
    programId?: number;
    admissionMode?: AdmissionMode;
    documents: DocItem[];
    allocatedProgramId?: number;
    allocatedQuotaId?: number;
    feeStatus: FeeStatus;
    admissionNumber?: string;
    createdAt: string;
}

// ─── Context Type ───────────────────────────────────────

interface AppContextType {
    institutions: Institution[];
    campuses: Campus[];
    departments: Department[];
    programs: Program[];
    academicYears: AcademicYear[];
    quotas: Quota[];
    applicants: Applicant[];
    isLoadingData: boolean;

    addInstitution: (data: any) => Promise<Institution | undefined>;
    addCampus: (data: any) => Promise<Campus | undefined>;
    addDepartment: (data: any) => Promise<Department | undefined>;
    addProgram: (data: any) => Promise<void>;
    addAcademicYear: (data: any) => Promise<void>;

    addQuota: (programId: number, data: any) => Promise<void>;
    updateQuota: (id: number, data: any) => Promise<void>;

    addApplicant: (data: any) => Promise<void>;
    updateDocumentStatus: (applicantId: number, docName: string, status: DocStatus) => Promise<void>;

    allocateSeat: (applicantId: number, programId: number, quotaType: string) => Promise<{ success: boolean; message: string }>;
    markFeePaid: (applicantId: number) => Promise<void>;
    confirmAdmission: (applicantId: number) => Promise<{ success: boolean; message: string }>;

    deleteInstitution: (id: number) => Promise<void>;
    deleteCampus: (id: number) => Promise<void>;
    deleteDepartment: (id: number) => Promise<void>;
    deleteProgram: (id: number) => Promise<void>;
    deleteAcademicYear: (id: number) => Promise<void>;

    updateInstitution: (id: number, updates: any) => Promise<void>;
    updateCampus: (id: number, updates: any) => Promise<void>;
    updateDepartment: (id: number, updates: any) => Promise<void>;
    updateProgram: (id: number, updates: any) => Promise<void>;
    updateAcademicYear: (id: number, updates: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [quotas, setQuotas] = useState<Quota[]>([]);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const loadData = useCallback(async () => {
        if (!user) return;
        setIsLoadingData(true);
        try {
            const [instRes, campRes, deptRes, progRes, yrRes, appRes, admRes] = await Promise.all([
                api.get<Institution[]>('/api/institutions'),
                api.get<Campus[]>('/api/campuses'),
                api.get<Department[]>('/api/departments'),
                api.get<Program[]>('/api/programs'),
                api.get<AcademicYear[]>('/api/academic-years'),
                api.get<Applicant[]>('/api/applicants'),
                api.get<any[]>('/api/admissions')
            ]);

            if (instRes.code === 200) setInstitutions(instRes.data);
            if (campRes.code === 200) setCampuses(campRes.data);
            if (deptRes.code === 200) setDepartments(deptRes.data);
            if (yrRes.code === 200) setAcademicYears(yrRes.data.map((y: any) => ({ ...y, year: y.label || `${y.startYear}-${y.endYear}` })));

            let allPrograms = [];
            if (progRes.code === 200) {
                allPrograms = progRes.data;
                const qs: Quota[] = [];
                progRes.data.forEach((p: any) => {
                    if (p.quotas) {
                        p.quotas.forEach((q: any) => {
                            qs.push({ ...q, name: q.quotaType });
                        });
                    }
                });
                setPrograms(allPrograms);
                setQuotas(qs);
            }

            if (appRes.code === 200) {
                const admissions = admRes.code === 200 ? admRes.data : [];
                const mappedApps = appRes.data.map((a: any) => {
                    const adm = admissions.find((ad: any) => ad.applicantId === a.id);
                    return {
                        ...a,
                        documents: a.documents ? a.documents.map((d: any) => ({
                            id: d.id,
                            name: d.documentName,
                            status: d.status
                        })) : [],
                        dob: a.dateOfBirth,
                        allocatedProgramId: adm ? a.programId : undefined,
                        feeStatus: adm?.feeStatus || 'PENDING',
                        admissionNumber: adm?.admissionNumber,
                        admissionId: adm?.id
                    };
                });
                setApplicants(mappedApps);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingData(false);
        }
    }, [user]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ── Auto-create current academic year if not exists ──
    useEffect(() => {
        const initializeAcademicYear = async () => {
            if (!user || academicYears.length === 0) return;
            
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const startYear = month < 6 ? year - 1 : year;
            const endYear = startYear + 1;
            
            const currentYearExists = academicYears.some(y => 
                y.year.includes(`${startYear}`) && y.year.includes(`${endYear}`)
            );
            
            if (!currentYearExists && academicYears.length > 0) {
                try {
                    await api.post('/api/academic-years', { 
                        startYear, 
                        endYear, 
                        isCurrent: true 
                    });
                    loadData();
                } catch (e) {
                    console.warn('Failed to auto-create academic year:', e);
                }
            }
        };
        
        if (academicYears.length > 0) {
            initializeAcademicYear();
        }
    }, [user]);


    // ── Master CRUD ──

    const addInstitution = async (data: any): Promise<Institution | undefined> => {
        try {
            const res = await api.post<Institution>('/api/institutions', data);
            if (res.code === 201) { setInstitutions(prev => [...prev, res.data]); return res.data; }
            throw new Error(res.message || 'Failed to create institution');
        } catch (e: any) {
            console.error('addInstitution error:', e);
            throw e;
        }
    };

    const addCampus = async (data: any): Promise<Campus | undefined> => {
        const res = await api.post<Campus>('/api/campuses', data);
        if (res.code === 201) { 
            setCampuses(prev => [...prev, res.data]); 
            loadData(); // Reload to update departments and programs
            return res.data; 
        }
        return undefined;
    };

    const addDepartment = async (data: any): Promise<Department | undefined> => {
        const res = await api.post<Department>('/api/departments', data);
        if (res.code === 201) { 
            setDepartments(prev => [...prev, res.data]); 
            loadData(); // Reload to update programs and other dependent data
            return res.data; 
        }
        return undefined;
    };

    const addProgram = async (data: any) => {
        const { quotas: quotaData, ...programData } = data;
        programData.academicYearId = academicYears.find(y => y.isActive)?.id || academicYears[0]?.id || 1;
        const res = await api.post<Program>('/api/programs', programData);
        if (res.code === 201) {
            const programId = res.data.id;
            // Create quotas if provided
            if (quotaData && Array.isArray(quotaData)) {
                for (const q of quotaData) {
                    if (q.totalSeats > 0) {
                        await api.post('/api/quotas', { programId, quotaType: q.quotaType, totalSeats: q.totalSeats });
                    }
                }
            }
            setPrograms(prev => [...prev, res.data]);
            loadData();
        }
    };

    const addAcademicYear = async (data: any) => {
        const parts = data.year.split('-');
        const req = { startYear: parseInt(parts[0]), endYear: parseInt(parts[1] || parts[0]), isCurrent: data.isActive };
        const res = await api.post('/api/academic-years', req);
        if (res.code === 201) loadData();
    };

    const deleteInstitution = async (id: number) => { await api.delete(`/api/institutions/${id}`); setInstitutions(p => p.filter(x => x.id !== id)); };
    const deleteCampus = async (id: number) => { await api.delete(`/api/campuses/${id}`); setCampuses(p => p.filter(x => x.id !== id)); };
    const deleteDepartment = async (id: number) => { await api.delete(`/api/departments/${id}`); setDepartments(p => p.filter(x => x.id !== id)); };
    const deleteProgram = async (id: number) => { await api.delete(`/api/programs/${id}`); setPrograms(p => p.filter(x => x.id !== id)); };
    const deleteAcademicYear = async (id: number) => { await api.delete(`/api/academic-years/${id}`); setAcademicYears(p => p.filter(x => x.id !== id)); };

    const updateInstitution = async (id: number, data: any) => { const res = await api.put<Institution>(`/api/institutions/${id}`, data); if (res.code === 200) setInstitutions(p => p.map(x => x.id === id ? res.data : x)); };
    const updateCampus = async (id: number, data: any) => { const res = await api.put<Campus>(`/api/campuses/${id}`, data); if (res.code === 200) setCampuses(p => p.map(x => x.id === id ? res.data : x)); };
    const updateDepartment = async (id: number, data: any) => { const res = await api.put<Department>(`/api/departments/${id}`, data); if (res.code === 200) setDepartments(p => p.map(x => x.id === id ? res.data : x)); };
    const updateProgram = async (id: number, data: any) => { const res = await api.put<Program>(`/api/programs/${id}`, data); if (res.code === 200) setPrograms(p => p.map(x => x.id === id ? res.data : x)); };
    const updateAcademicYear = async (id: number, data: any) => { const res = await api.put<AcademicYear>(`/api/academic-years/${id}`, data); if (res.code === 200) loadData(); };

    const addQuota = async (programId: number, data: any) => {
        data.programId = programId;
        const res = await api.post('/api/quotas', data);
        if (res.code === 201) loadData();
    };

    const updateQuota = async (id: number, data: any) => {
        const res = await api.put(`/api/quotas/${id}`, data);
        if (res.code === 200) loadData();
    };


    // ── Applicant ──

    const addApplicant = async (data: any) => {
        try {
            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                dateOfBirth: data.dob,
                category: data.category?.toUpperCase(),
                entryType: data.entryType?.toUpperCase(),
                quotaType: data.quotaType?.toUpperCase(),
                qualifyingExam: data.qualifyingExam,
                qualifyingMarks: data.marks,
            };
            const res = await api.post('/api/applicants', payload);
            if (res && res.code === 201) {
                await loadData();
            } else {
                console.error('Failed to save applicant:', res?.message || 'Unknown error');
            }
        } catch (err) {
            console.error('Error saving applicant:', err);
        }
    };

    const updateDocumentStatus = async (applicantId: number, docName: string, status: DocStatus) => {
        const app = applicants.find(a => a.id === applicantId);
        if (!app) return;
        const doc = app.documents.find(d => d.name === docName);
        if (doc && doc.id) {
            await api.patch(`/api/documents/${doc.id}/status?status=${status}`);
        } else {
            // Need to create it first
            await api.post('/api/documents', {
                documentName: docName,
                status: status,
                applicantId: applicantId
            });
        }
        loadData();
    };

    // ── Seat Allocation ──

    const allocateSeat = async (applicantId: number, programId: number, quotaType: string): Promise<{ success: boolean; message: string }> => {
        const req = {
            applicantId,
            programId,
            quotaType: quotaType.toUpperCase(),
            allotmentNumber: applicants.find(a => a.id === applicantId)?.allotmentNumber || 'MANUAL'
        };
        const res = await api.post('/api/admissions/allocate', req);
        if (res.code === 201) {
            loadData();
            return { success: true, message: 'Seat allocated successfully.' };
        }
        return { success: false, message: res.message || res.errorMsg || 'Failed to allocate' };
    };

    // ── Fee & Confirmation ──

    const markFeePaid = async (applicantId: number) => {
        const app = applicants.find(a => a.id === applicantId);
        const admId = (app as any)?.admissionId;
        if (admId) {
            await api.patch(`/api/admissions/${admId}/mark-fee-paid`);
            loadData();
        }
    };

    const confirmAdmission = async (applicantId: number): Promise<{ success: boolean; message: string }> => {
        const app = applicants.find(a => a.id === applicantId);
        const admId = (app as any)?.admissionId;
        if (!admId) return { success: false, message: 'No admission record found' };

        // Ensure docs verify call to backend just in case
        await api.patch(`/api/admissions/${admId}/verify-documents`);

        const res = await api.patch(`/api/admissions/${admId}/confirm`);
        if (res.code === 200) {
            loadData();
            return { success: true, message: `Admission confirmed! Number: ${(res.data as any).admissionNumber}` };
        }
        return { success: false, message: res.message || res.errorMsg || 'Failed to confirm' };
    };

    return (
        <AppContext.Provider value={{
            institutions, campuses, departments, programs, academicYears, quotas, applicants, isLoadingData,
            addInstitution, addCampus, addDepartment, addProgram, addAcademicYear,
            addQuota, updateQuota,
            addApplicant, updateDocumentStatus,
            allocateSeat, markFeePaid, confirmAdmission,
            deleteInstitution, deleteCampus, deleteDepartment, deleteProgram, deleteAcademicYear,
            updateInstitution, updateCampus, updateDepartment, updateProgram, updateAcademicYear,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
