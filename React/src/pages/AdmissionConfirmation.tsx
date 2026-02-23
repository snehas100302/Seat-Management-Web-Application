import { CheckCircle2, CreditCard, FileCheck, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AdmissionConfirmation: React.FC = () => {
    const { applicants, programs, confirmAdmission } = useAppContext();
    const allocatedApplicants = applicants.filter(a => a.allocatedProgramId);

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
        marginTop: '1.5rem'
    };

    const getProgramName = (id?: string) => programs.find(p => p.id === id)?.name || 'Unknown';

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 className="text-primary" /> Admission Confirmation & Fees
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Finalize admissions by confirming fee payment and generating admission numbers.</p>
            </div>

            <div style={cardStyle}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Allocated Students</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{allocatedApplicants.length} Pending Confirmation</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Student Name</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Program</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Fee Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Admission #</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocatedApplicants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No students have been allocated seats yet.
                                    </td>
                                </tr>
                            ) : (
                                allocatedApplicants.map(applicant => (
                                    <tr key={applicant.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600 }}>{applicant.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{applicant.category}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>
                                            {getProgramName(applicant.allocatedProgramId)}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            {applicant.isFeePaid ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                                                    <CreditCard size={14} /> Paid
                                                </span>
                                            ) : (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#b45309', fontSize: '0.85rem', fontWeight: 600 }}>
                                                    <Clock size={14} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            {applicant.admissionNumber ? (
                                                <code style={{ backgroundColor: '#e7f5ea', color: 'var(--success)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                    {applicant.admissionNumber}
                                                </code>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Not Generated</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            {!applicant.isFeePaid ? (
                                                <button
                                                    onClick={() => confirmAdmission(applicant.id)}
                                                    style={{
                                                        backgroundColor: 'var(--primary)',
                                                        color: 'white',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    <FileCheck size={16} /> Confirm & Generate ID
                                                </button>
                                            ) : (
                                                <button style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>Print Receipt</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdmissionConfirmation;
