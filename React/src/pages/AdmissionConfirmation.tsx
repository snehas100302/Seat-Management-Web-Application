import React, { useState } from 'react';
import { CheckCircle2, CreditCard, FileCheck, Clock, AlertTriangle, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AdmissionConfirmation: React.FC = () => {
    const { applicants, programs, quotas, markFeePaid, confirmAdmission } = useAppContext();
    const allocatedApplicants = applicants.filter(a => a.allocatedProgramId);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const getProgramName = (id?: number) => programs.find(p => p.id === id)?.name || '—';
    const getQuotaName = (id?: number) => quotas.find(q => q.id === id)?.name || '—';

    const handleConfirm = (applicantId: number) => {
        const res = confirmAdmission(applicantId);
        res.then(r => {
            setResult(r);
            setTimeout(() => setResult(null), 4000);
        });
    };

    const allDocsVerified = (applicantId: number) => {
        const app = applicants.find(a => a.id === applicantId);
        return app?.documents.every(d => d.status === 'VERIFIED') ?? false;
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
    };

    const thStyle: React.CSSProperties = {
        padding: '0.85rem 1.25rem',
        textAlign: 'left',
        fontSize: '0.72rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-muted)',
        backgroundColor: '#f8f9fb',
        borderBottom: '1px solid var(--border-color)',
    };

    const tdStyle: React.CSSProperties = {
        padding: '1rem 1.25rem',
        fontSize: '0.875rem',
        borderBottom: '1px solid var(--border-color)',
    };

    // Summary counts
    const feePending = allocatedApplicants.filter(a => a.feeStatus === 'PENDING').length;
    const feePaid = allocatedApplicants.filter(a => a.feeStatus === 'PAID').length;
    const confirmed = allocatedApplicants.filter(a => a.admissionNumber).length;

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={22} color="var(--primary)" /> Admission Confirmation & Fees
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Confirm fee payments and generate admission numbers. Admission is confirmed only after fee is paid and documents are verified.
                </p>
            </div>

            {/* Result Banner */}
            {result && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.85rem 1.25rem', marginBottom: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: result.success ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${result.success ? '#a7f3d0' : '#fecaca'}`,
                    color: result.success ? '#065f46' : '#991b1b',
                    fontSize: '0.875rem', fontWeight: 500,
                    animation: 'fadeInUp 0.3s ease-out',
                }}>
                    {result.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    {result.message}
                    <button onClick={() => setResult(null)} style={{ marginLeft: 'auto', padding: '2px', color: 'inherit', opacity: 0.6 }}>✕</button>
                </div>
            )}

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Fee Pending', value: feePending, color: '#d97706', bg: '#fffbeb' },
                    { label: 'Fee Paid', value: feePaid, color: '#059669', bg: '#ecfdf5' },
                    { label: 'Admissions Confirmed', value: confirmed, color: '#2563eb', bg: '#eff6ff' },
                ].map(s => (
                    <div key={s.label} style={{
                        ...cardStyle, padding: '1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }} className="card-animate">
                        <div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color, marginTop: '0.15rem' }}>{s.value}</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {s.label === 'Fee Pending' ? <Clock size={20} color={s.color} /> : s.label === 'Fee Paid' ? <CreditCard size={20} color={s.color} /> : <Shield size={20} color={s.color} />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={cardStyle} className="card-animate">
                <div style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Allocated Students</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{allocatedApplicants.length} students</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Student</th>
                                <th style={thStyle}>Program</th>
                                <th style={thStyle}>Quota</th>
                                <th style={thStyle}>Documents</th>
                                <th style={thStyle}>Fee Status</th>
                                <th style={thStyle}>Admission #</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocatedApplicants.length === 0 ? (
                                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No students have been allocated seats yet. Go to Allocation to assign seats.
                                </td></tr>
                            ) : (
                                allocatedApplicants.map(applicant => {
                                    const docsOk = allDocsVerified(applicant.id);
                                    const canConfirm = applicant.feeStatus === 'PAID' && docsOk && !applicant.admissionNumber;
                                    return (
                                        <tr key={applicant.id} className="table-row-hover">
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: 600 }}>{applicant.name}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{applicant.category} • {applicant.entryType}</div>
                                            </td>
                                            <td style={tdStyle}>{getProgramName(applicant.allocatedProgramId)}</td>
                                            <td style={tdStyle}>
                                                <span className="badge badge-info">{getQuotaName(applicant.allocatedQuotaId)}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                {docsOk ? (
                                                    <span className="badge badge-success"><CheckCircle2 size={10} /> Verified</span>
                                                ) : (
                                                    <span className="badge badge-warning"><Clock size={10} /> Incomplete</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                {applicant.feeStatus === 'PAID' ? (
                                                    <span className="badge badge-success"><CreditCard size={10} /> Paid</span>
                                                ) : (
                                                    <span className="badge badge-warning"><Clock size={10} /> Pending</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                {applicant.admissionNumber ? (
                                                    <code style={{
                                                        backgroundColor: '#ecfdf5', color: '#059669',
                                                        padding: '3px 8px', borderRadius: '4px', fontSize: '0.76rem',
                                                        fontWeight: 600, letterSpacing: '0.01em',
                                                    }}>
                                                        {applicant.admissionNumber}
                                                    </code>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Not Generated</span>
                                                )}
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    {applicant.feeStatus === 'PENDING' && (
                                                        <button
                                                            onClick={() => markFeePaid(applicant.id)}
                                                            style={{
                                                                backgroundColor: '#f59e0b', color: 'white',
                                                                padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)',
                                                                fontSize: '0.78rem', fontWeight: 600,
                                                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                            }}
                                                        >
                                                            <CreditCard size={13} /> Mark Paid
                                                        </button>
                                                    )}
                                                    {canConfirm && (
                                                        <button
                                                            onClick={() => handleConfirm(applicant.id)}
                                                            style={{
                                                                backgroundColor: 'var(--primary)', color: 'white',
                                                                padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)',
                                                                fontSize: '0.78rem', fontWeight: 600,
                                                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                                boxShadow: '0 2px 8px rgba(40, 167, 69, 0.25)',
                                                            }}
                                                        >
                                                            <FileCheck size={13} /> Confirm & Generate ID
                                                        </button>
                                                    )}
                                                    {applicant.admissionNumber && (
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <CheckCircle2 size={13} /> Confirmed
                                                        </span>
                                                    )}
                                                    {applicant.feeStatus === 'PAID' && !docsOk && !applicant.admissionNumber && (
                                                        <span style={{ fontSize: '0.72rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <AlertTriangle size={12} /> Verify docs first
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdmissionConfirmation;
