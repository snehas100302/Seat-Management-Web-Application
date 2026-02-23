import React, { createContext, useContext, useState } from 'react';

// --- Types ---

export interface Institution {
    id: string;
    name: string;
}

export interface Quota {
    id: string;
    name: string;
    seats: number;
}

export interface Program {
    id: string;
    name: string;
    department: string;
    totalIntake: number;
    quotas: Quota[];
}

export interface Applicant {
    id: string;
    name: string;
    category: string;
    entryType: 'Regular' | 'Lateral';
    marks: number;
    status: 'Pending' | 'Submitted' | 'Verified';
    documents: { name: string; status: 'Pending' | 'Submitted' | 'Verified' }[];
    allocatedProgramId?: string;
    isFeePaid: boolean;
    admissionNumber?: string;
}

interface AppContextType {
    programs: Program[];
    applicants: Applicant[];
    addApplicant: (applicant: Applicant) => void;
    updateApplicant: (id: string, updates: Partial<Applicant>) => void;
    allocateSeat: (applicantId: string, programId: string, quotaId: string) => void;
    confirmAdmission: (applicantId: string) => void;
}

// --- Context ---

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Provider ---

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [programs] = useState<Program[]>([
        {
            id: '1',
            name: 'Computer Science & Engineering',
            department: 'Engineering',
            totalIntake: 60,
            quotas: [
                { id: 'q1', name: 'General', seats: 30 },
                { id: 'q2', name: 'SC', seats: 10 },
                { id: 'q3', name: 'ST', seats: 5 },
                { id: 'q4', name: 'Management', seats: 15 },
            ]
        },
        {
            id: '2',
            name: 'Electronics & Communication',
            department: 'Engineering',
            totalIntake: 60,
            quotas: [
                { id: 'e1', name: 'General', seats: 30 },
                { id: 'e2', name: 'SC', seats: 10 },
                { id: 'e3', name: 'ST', seats: 5 },
                { id: 'e4', name: 'Management', seats: 15 },
            ]
        }
    ]);

    const [applicants, setApplicants] = useState<Applicant[]>([]);

    const addApplicant = (applicant: Applicant) => {
        setApplicants(prev => [...prev, applicant]);
    };

    const updateApplicant = (id: string, updates: Partial<Applicant>) => {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const allocateSeat = (applicantId: string, programId: string, _quotaId: string) => {
        // In a real app, check availability here
        updateApplicant(applicantId, { allocatedProgramId: programId });
    };

    const generateAdmissionNumber = (applicant: Applicant, program: Program) => {
        const year = new Date().getFullYear();
        const mode = applicant.category === 'Management' ? 'MGMT' : 'GOVT';
        const num = Math.floor(1000 + Math.random() * 9000);
        return `INST/${year}/UG/${program.name.substring(0, 3).toUpperCase()}/${mode}/${num}`;
    };

    const confirmAdmission = (applicantId: string) => {
        const applicant = applicants.find(a => a.id === applicantId);
        if (applicant && applicant.allocatedProgramId) {
            const program = programs.find(p => p.id === applicant.allocatedProgramId);
            if (program) {
                updateApplicant(applicantId, {
                    isFeePaid: true,
                    admissionNumber: generateAdmissionNumber(applicant, program)
                });
            }
        }
    };

    return (
        <AppContext.Provider value={{
            programs,
            applicants,
            addApplicant,
            updateApplicant,
            allocateSeat,
            confirmAdmission
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
