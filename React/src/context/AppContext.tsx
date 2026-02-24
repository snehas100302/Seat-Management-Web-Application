import React, { createContext, useContext, useState, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────

export interface Institution {
    id: string;
    name: string;
    code: string;
    address: string;
}

export interface Campus {
    id: string;
    name: string;
    institutionId: string;
    location: string;
}

export interface Department {
    id: string;
    name: string;
    campusId: string;
    hod: string;
}

export type CourseType = 'UG' | 'PG';
export type EntryType = 'Regular' | 'Lateral';
export type AdmissionMode = 'Government' | 'Management';
export type QuotaName = 'KCET' | 'COMEDK' | 'Management';
export type DocStatus = 'Pending' | 'Submitted' | 'Verified';
export type FeeStatus = 'Pending' | 'Paid';

export interface AcademicYear {
    id: string;
    year: string;
    isActive: boolean;
}

export interface Program {
    id: string;
    name: string;
    departmentId: string;
    courseType: CourseType;
    entryType: EntryType;
    admissionMode: AdmissionMode;
    totalIntake: number;
}

export interface Quota {
    id: string;
    programId: string;
    name: QuotaName;
    totalSeats: number;
    filledSeats: number;
}

export interface DocItem {
    name: string;
    status: DocStatus;
}

export interface Applicant {
    id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    category: string;
    entryType: EntryType;
    quotaType: QuotaName;
    qualifyingExam: string;
    marks: number;
    allotmentNumber: string;
    programId: string;
    admissionMode: AdmissionMode;
    documents: DocItem[];
    allocatedProgramId?: string;
    allocatedQuotaId?: string;
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

    addInstitution: (data: Omit<Institution, 'id'>) => void;
    addCampus: (data: Omit<Campus, 'id'>) => void;
    addDepartment: (data: Omit<Department, 'id'>) => void;
    addProgram: (data: Omit<Program, 'id'>) => void;
    addAcademicYear: (data: Omit<AcademicYear, 'id'>) => void;
    addQuota: (data: Omit<Quota, 'id'>) => void;
    updateQuota: (id: string, updates: Partial<Quota>) => void;

    addApplicant: (data: Omit<Applicant, 'id' | 'documents' | 'feeStatus' | 'createdAt'>) => void;
    updateApplicant: (id: string, updates: Partial<Applicant>) => void;
    updateDocumentStatus: (applicantId: string, docName: string, status: DocStatus) => void;

    allocateSeat: (applicantId: string, programId: string, quotaId: string) => { success: boolean; message: string };
    markFeePaid: (applicantId: string) => void;
    confirmAdmission: (applicantId: string) => { success: boolean; message: string };

    deleteInstitution: (id: string) => void;
    deleteCampus: (id: string) => void;
    deleteDepartment: (id: string) => void;
    deleteProgram: (id: string) => void;
    deleteAcademicYear: (id: string) => void;
}

// ─── Helpers ────────────────────────────────────────────

const uid = () => Math.random().toString(36).substring(2, 11);

// ─── Default Data ───────────────────────────────────────

const defaultInstitution: Institution = { id: 'inst1', name: 'ABC Institute of Technology', code: 'ABCIT', address: 'Bangalore, Karnataka' };
const defaultCampus: Campus = { id: 'camp1', name: 'Main Campus', institutionId: 'inst1', location: 'Bangalore' };
const defaultDepartment: Department = { id: 'dept1', name: 'Computer Science', campusId: 'camp1', hod: 'Dr. Raghav' };
const defaultDepartment2: Department = { id: 'dept2', name: 'Electronics & Communication', campusId: 'camp1', hod: 'Dr. Meera' };

const defaultPrograms: Program[] = [
    { id: 'prog1', name: 'Computer Science & Engineering', departmentId: 'dept1', courseType: 'UG', entryType: 'Regular', admissionMode: 'Government', totalIntake: 60 },
    { id: 'prog2', name: 'Electronics & Communication', departmentId: 'dept2', courseType: 'UG', entryType: 'Regular', admissionMode: 'Government', totalIntake: 60 },
];

const defaultQuotas: Quota[] = [
    { id: 'q1', programId: 'prog1', name: 'KCET', totalSeats: 30, filledSeats: 0 },
    { id: 'q2', programId: 'prog1', name: 'COMEDK', totalSeats: 15, filledSeats: 0 },
    { id: 'q3', programId: 'prog1', name: 'Management', totalSeats: 15, filledSeats: 0 },
    { id: 'q4', programId: 'prog2', name: 'KCET', totalSeats: 30, filledSeats: 0 },
    { id: 'q5', programId: 'prog2', name: 'COMEDK', totalSeats: 15, filledSeats: 0 },
    { id: 'q6', programId: 'prog2', name: 'Management', totalSeats: 15, filledSeats: 0 },
];

const defaultAcademicYears: AcademicYear[] = [
    { id: 'ay1', year: '2025-2026', isActive: false },
    { id: 'ay2', year: '2026-2027', isActive: true },
];

const DEFAULT_DOCS: DocItem[] = [
    { name: '10th Marksheet', status: 'Pending' },
    { name: '12th Marksheet', status: 'Pending' },
    { name: 'Transfer Certificate', status: 'Pending' },
    { name: 'Migration Certificate', status: 'Pending' },
    { name: 'Category Certificate', status: 'Pending' },
];

// ─── Provider ───────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [institutions, setInstitutions] = useState<Institution[]>([defaultInstitution]);
    const [campuses, setCampuses] = useState<Campus[]>([defaultCampus]);
    const [departments, setDepartments] = useState<Department[]>([defaultDepartment, defaultDepartment2]);
    const [programs, setPrograms] = useState<Program[]>(defaultPrograms);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>(defaultAcademicYears);
    const [quotas, setQuotas] = useState<Quota[]>(defaultQuotas);
    const [applicants, setApplicants] = useState<Applicant[]>([]);

    // ── Master CRUD ──

    const addInstitution = useCallback((data: Omit<Institution, 'id'>) => {
        setInstitutions(prev => [...prev, { ...data, id: uid() }]);
    }, []);

    const addCampus = useCallback((data: Omit<Campus, 'id'>) => {
        setCampuses(prev => [...prev, { ...data, id: uid() }]);
    }, []);

    const addDepartment = useCallback((data: Omit<Department, 'id'>) => {
        setDepartments(prev => [...prev, { ...data, id: uid() }]);
    }, []);

    const addProgram = useCallback((data: Omit<Program, 'id'>) => {
        setPrograms(prev => [...prev, { ...data, id: uid() }]);
    }, []);

    const addAcademicYear = useCallback((data: Omit<AcademicYear, 'id'>) => {
        setAcademicYears(prev => [...prev, { ...data, id: uid() }]);
    }, []);

    const addQuota = useCallback((data: Omit<Quota, 'id'>) => {
        setQuotas(prev => [...prev, { ...data, id: uid() }]);
    }, []);

    const updateQuota = useCallback((id: string, updates: Partial<Quota>) => {
        setQuotas(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    }, []);

    const deleteInstitution = useCallback((id: string) => setInstitutions(p => p.filter(i => i.id !== id)), []);
    const deleteCampus = useCallback((id: string) => setCampuses(p => p.filter(i => i.id !== id)), []);
    const deleteDepartment = useCallback((id: string) => setDepartments(p => p.filter(i => i.id !== id)), []);
    const deleteProgram = useCallback((id: string) => setPrograms(p => p.filter(i => i.id !== id)), []);
    const deleteAcademicYear = useCallback((id: string) => setAcademicYears(p => p.filter(i => i.id !== id)), []);

    // ── Applicant ──

    const addApplicant = useCallback((data: Omit<Applicant, 'id' | 'documents' | 'feeStatus' | 'createdAt'>) => {
        const newApplicant: Applicant = {
            ...data,
            id: uid(),
            documents: DEFAULT_DOCS.map(d => ({ ...d })),
            feeStatus: 'Pending',
            createdAt: new Date().toISOString(),
        };
        setApplicants(prev => [...prev, newApplicant]);
    }, []);

    const updateApplicant = useCallback((id: string, updates: Partial<Applicant>) => {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }, []);

    const updateDocumentStatus = useCallback((applicantId: string, docName: string, status: DocStatus) => {
        setApplicants(prev => prev.map(a => {
            if (a.id !== applicantId) return a;
            return {
                ...a,
                documents: a.documents.map(d => d.name === docName ? { ...d, status } : d)
            };
        }));
    }, []);

    // ── Seat Allocation ──

    const allocateSeat = useCallback((applicantId: string, programId: string, quotaId: string): { success: boolean; message: string } => {
        const quota = quotas.find(q => q.id === quotaId);
        if (!quota) return { success: false, message: 'Quota not found.' };
        if (quota.filledSeats >= quota.totalSeats) return { success: false, message: `${quota.name} quota is full. No seats available.` };

        const applicant = applicants.find(a => a.id === applicantId);
        if (!applicant) return { success: false, message: 'Applicant not found.' };
        if (applicant.allocatedProgramId) return { success: false, message: 'Applicant already has a seat allocated.' };

        // Increment filled seats
        setQuotas(prev => prev.map(q => q.id === quotaId ? { ...q, filledSeats: q.filledSeats + 1 } : q));
        // Update applicant
        setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, allocatedProgramId: programId, allocatedQuotaId: quotaId } : a));

        return { success: true, message: `Seat allocated successfully under ${quota.name} quota.` };
    }, [quotas, applicants]);

    // ── Fee & Confirmation ──

    const markFeePaid = useCallback((applicantId: string) => {
        setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, feeStatus: 'Paid' as FeeStatus } : a));
    }, []);

    const confirmAdmission = useCallback((applicantId: string): { success: boolean; message: string } => {
        const applicant = applicants.find(a => a.id === applicantId);
        if (!applicant) return { success: false, message: 'Applicant not found.' };
        if (applicant.admissionNumber) return { success: false, message: 'Admission number already generated.' };
        if (applicant.feeStatus !== 'Paid') return { success: false, message: 'Fee must be paid before confirming admission.' };

        const allVerified = applicant.documents.every(d => d.status === 'Verified');
        if (!allVerified) return { success: false, message: 'All documents must be verified before confirming.' };

        if (!applicant.allocatedProgramId) return { success: false, message: 'No seat allocated.' };

        const program = programs.find(p => p.id === applicant.allocatedProgramId);
        const quota = quotas.find(q => q.id === applicant.allocatedQuotaId);
        if (!program || !quota) return { success: false, message: 'Program/Quota not found.' };

        const year = new Date().getFullYear();
        const progCode = program.name.replace(/[^A-Z]/g, '').substring(0, 3) || 'PRG';
        const existingCount = applicants.filter(a => a.admissionNumber).length;
        const serial = String(existingCount + 1).padStart(4, '0');
        const admissionNumber = `INST/${year}/${program.courseType}/${progCode}/${quota.name}/${serial}`;

        setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, admissionNumber } : a));
        return { success: true, message: `Admission confirmed! Number: ${admissionNumber}` };
    }, [applicants, programs, quotas]);

    return (
        <AppContext.Provider value={{
            institutions, campuses, departments, programs, academicYears, quotas, applicants,
            addInstitution, addCampus, addDepartment, addProgram, addAcademicYear, addQuota, updateQuota,
            addApplicant, updateApplicant, updateDocumentStatus,
            allocateSeat, markFeePaid, confirmAdmission,
            deleteInstitution, deleteCampus, deleteDepartment, deleteProgram, deleteAcademicYear,
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
