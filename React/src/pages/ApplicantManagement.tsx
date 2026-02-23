import React, { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ApplicantManagement: React.FC = () => {
    const { applicants, addApplicant } = useAppContext();
    const [showModal, setShowModal] = useState(false);

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
        marginTop: '1.5rem'
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const badgeStyle = (status: string): React.CSSProperties => ({
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: status === 'Verified' ? '#e7f5ea' : status === 'Submitted' ? '#fff4e5' : '#f1f3f5',
        color: status === 'Verified' ? 'var(--success)' : status === 'Submitted' ? '#b45309' : 'var(--text-muted)'
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users className="text-primary" /> Applicant Management
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Register and track student applications and document verification.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <UserPlus size={18} /> Add New Applicant
                </button>
            </div>

            <div style={cardStyle}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '2rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Total: {applicants.length}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>Verified: {applicants.filter(a => a.status === 'Verified').length}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309' }}>Pending: {applicants.filter(a => a.status !== 'Verified').length}</div>
                </div>

                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Applicant Name</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Category</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Entry Type</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No applicants registered yet. Click "Add New Applicant" to get started.
                                </td>
                            </tr>
                        ) : (
                            applicants.map(applicant => (
                                <tr key={applicant.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{applicant.name}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{applicant.category}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{applicant.entryType}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={badgeStyle(applicant.status)}>{applicant.status}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <button style={{ color: 'var(--primary)', marginRight: '1rem', fontSize: '0.875rem' }}>Verify Docs</button>
                                        <button style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '500px', boxShadow: 'var(--shadow-md)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Register New Applicant</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Name</label>
                                <input type="text" id="newName" style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Category</label>
                                <select id="newCategory" style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem' }}>
                                    <option>General</option>
                                    <option>SC</option>
                                    <option>ST</option>
                                    <option>Management</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>Cancel</button>
                                <button
                                    onClick={() => {
                                        const name = (document.getElementById('newName') as HTMLInputElement).value;
                                        const category = (document.getElementById('newCategory') as HTMLSelectElement).value;
                                        if (name) {
                                            addApplicant({
                                                id: Math.random().toString(36).substr(2, 9),
                                                name,
                                                category,
                                                entryType: 'Regular',
                                                marks: 85,
                                                status: 'Pending',
                                                documents: [],
                                                isFeePaid: false
                                            });
                                            setShowModal(false);
                                        }
                                    }}
                                    style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantManagement;
