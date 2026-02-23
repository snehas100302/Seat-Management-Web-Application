import React, { useState } from 'react';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AdmissionAllocation: React.FC = () => {
    const { applicants, programs, allocateSeat } = useAppContext();
    const [selectedApplicantId, setSelectedApplicantId] = useState('');
    const [selectedProgramId, setSelectedProgramId] = useState('');

    const eligibleApplicants = applicants.filter(a => a.status === 'Verified' && !a.allocatedProgramId);
    const selectedApplicant = applicants.find(a => a.id === selectedApplicantId);
    const selectedProgram = programs.find(p => p.id === selectedProgramId);

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)'
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserPlus className="text-primary" /> Admission Allocation
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Match verified applicants with available seats based on quota.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 350px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={cardStyle}>
                        <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 600 }}>1. Select Applicant</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <select
                                    value={selectedApplicantId}
                                    onChange={(e) => setSelectedApplicantId(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                >
                                    <option value="">Choose a verified applicant...</option>
                                    {eligibleApplicants.map(a => (
                                        <option key={a.id} value={a.id}>{a.name} ({a.category}) - {a.marks}%</option>
                                    ))}
                                </select>
                                {eligibleApplicants.length === 0 && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.5rem' }}>
                                        No verified applicants available for allocation.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ ...cardStyle, opacity: selectedApplicantId ? 1 : 0.5, pointerEvents: selectedApplicantId ? 'auto' : 'none' }}>
                        <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 600 }}>2. Choose Program & Quota</h3>
                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <select
                                value={selectedProgramId}
                                onChange={(e) => setSelectedProgramId(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            >
                                <option value="">Select Department/Program...</option>
                                {programs.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>

                            {selectedProgram && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                    {selectedProgram.quotas.map(quota => {
                                        const isEligible = selectedApplicant?.category === quota.name || quota.name === 'General';
                                        return (
                                            <div
                                                key={quota.id}
                                                onClick={() => isEligible && allocateSeat(selectedApplicantId, selectedProgramId, quota.id)}
                                                style={{
                                                    padding: '1rem',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-md)',
                                                    cursor: isEligible ? 'pointer' : 'not-allowed',
                                                    backgroundColor: isEligible ? '#fff' : '#f8f9fa',
                                                    opacity: isEligible ? 1 : 0.6
                                                }}
                                            >
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{quota.name} Quota</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isEligible ? 'var(--primary)' : 'inherit' }}>{quota.seats} Seats</div>
                                                {!isEligible && <div style={{ fontSize: '0.65rem', color: 'var(--danger)', marginTop: '0.25rem' }}>Ineligible for this category</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ ...cardStyle, backgroundColor: '#f0f4ff', borderColor: '#d0e0ff' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <ShieldCheck size={18} color="#2563eb" /> Allocation Logic
                        </h3>
                        <ul style={{ fontSize: '0.8rem', color: '#1e40af', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li>• System automatically suggests "General" or "Category Specific" quotas.</li>
                            <li>• Real-time availability check happens before allocation.</li>
                            <li>• Allocation locks the seat for 24 hours until fee payment.</li>
                        </ul>
                    </div>

                    {selectedApplicant && (
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Selection Preview</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                                    <span style={{ fontWeight: 600 }}>{selectedApplicant.name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Marks:</span>
                                    <span style={{ fontWeight: 600 }}>{selectedApplicant.marks}%</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Category:</span>
                                    <span style={{ fontWeight: 600 }}>{selectedApplicant.category}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdmissionAllocation;
