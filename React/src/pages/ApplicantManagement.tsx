import React, { useState } from 'react';
import { Users, UserPlus, Search, ChevronDown, ChevronUp, FileText, CheckCircle, Clock, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { EntryType, AdmissionMode, QuotaName, DocStatus } from '../context/AppContext';

const ApplicantManagement: React.FC = () => {
    const { applicants, programs, addApplicant, updateDocumentStatus } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState({
        name: '', email: '', phone: '', dob: '', gender: 'Male',
        address: '', category: 'GM', entryType: 'Regular' as EntryType,
        quotaType: 'KCET' as QuotaName, qualifyingExam: '', marks: 0,
        allotmentNumber: '', programId: '', admissionMode: 'Government' as AdmissionMode,
    });

    const filteredApplicants = applicants.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = () => {
        if (!form.name || !form.programId) return;
        addApplicant(form);
        setForm({
            name: '', email: '', phone: '', dob: '', gender: 'Male',
            address: '', category: 'GM', entryType: 'Regular',
            quotaType: 'KCET', qualifyingExam: '', marks: 0,
            allotmentNumber: '', programId: '', admissionMode: 'Government',
        });
        setShowModal(false);
    };

    const nextDocStatus = (status: DocStatus): DocStatus => {
        if (status === 'Pending') return 'Submitted';
        if (status === 'Submitted') return 'Verified';
        return 'Verified';
    };

    const docBadge = (status: DocStatus) => {
        const cls = status === 'Verified' ? 'badge-success' : status === 'Submitted' ? 'badge-warning' : 'badge-neutral';
        const Icon = status === 'Verified' ? CheckCircle : Clock;
        return <span className={`badge ${cls}`}><Icon size={10} /> {status}</span>;
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
        padding: '0.85rem 1.25rem',
        fontSize: '0.875rem',
        borderBottom: '1px solid var(--border-color)',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.65rem 0.8rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        fontSize: '0.85rem',
        backgroundColor: '#fafbfc',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        display: 'block',
        marginBottom: '0.3rem',
    };

    const allVerified = (id: string) => {
        const app = applicants.find(a => a.id === id);
        return app?.documents.every(d => d.status === 'Verified');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={22} color="var(--primary)" /> Applicant Management
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Register applicants, manage documents, and track verification status.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '0.7rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 8px rgba(40, 167, 69, 0.25)',
                    }}
                >
                    <UserPlus size={18} /> Add New Applicant
                </button>
            </div>

            {/* Stats bar */}
            <div style={{
                display: 'flex',
                gap: '2rem',
                padding: '0.85rem 1.25rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem',
                fontSize: '0.825rem',
                fontWeight: 600,
            }}>
                <span>Total: <strong>{applicants.length}</strong></span>
                <span style={{ color: 'var(--success)' }}>Docs Verified: <strong>{applicants.filter(a => a.documents.every(d => d.status === 'Verified')).length}</strong></span>
                <span style={{ color: '#d97706' }}>Pending Docs: <strong>{applicants.filter(a => a.documents.some(d => d.status !== 'Verified')).length}</strong></span>
                <span style={{ color: '#2563eb' }}>Allocated: <strong>{applicants.filter(a => a.allocatedProgramId).length}</strong></span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search by name, category, or email..."
                    style={{ ...inputStyle, paddingLeft: '2.25rem', width: '350px' }}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <div style={cardStyle} className="card-animate">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Applicant</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Entry / Quota</th>
                            <th style={thStyle}>Program</th>
                            <th style={thStyle}>Marks</th>
                            <th style={thStyle}>Documents</th>
                            <th style={thStyle}>Status</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplicants.length === 0 ? (
                            <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                {applicants.length === 0 ? 'No applicants registered yet. Click "Add New Applicant" to get started.' : 'No matching applicants found.'}
                            </td></tr>
                        ) : (
                            filteredApplicants.map(applicant => {
                                const prog = programs.find(p => p.id === applicant.programId);
                                const isExpanded = expandedId === applicant.id;
                                return (
                                    <React.Fragment key={applicant.id}>
                                        <tr className="table-row-hover" style={{ cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : applicant.id)}>
                                            <td style={{ ...tdStyle, fontWeight: 600 }}>
                                                <div>{applicant.name}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{applicant.email}</div>
                                            </td>
                                            <td style={tdStyle}><span className="badge badge-info">{applicant.category}</span></td>
                                            <td style={tdStyle}>
                                                <div style={{ fontSize: '0.82rem' }}>{applicant.entryType}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{applicant.quotaType}</div>
                                            </td>
                                            <td style={tdStyle}>{prog?.name || '—'}</td>
                                            <td style={tdStyle}><strong>{applicant.marks}%</strong></td>
                                            <td style={tdStyle}>
                                                {allVerified(applicant.id) ? (
                                                    <span className="badge badge-success"><CheckCircle size={10} /> All Verified</span>
                                                ) : (
                                                    <span className="badge badge-warning"><Clock size={10} /> Incomplete</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                {applicant.allocatedProgramId ? (
                                                    <span className="badge badge-success">Allocated</span>
                                                ) : (
                                                    <span className="badge badge-neutral">Pending</span>
                                                )}
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                                            </td>
                                        </tr>
                                        {/* Document Checklist Expand */}
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={8} style={{ padding: '0', backgroundColor: '#fafcfe' }}>
                                                    <div style={{ padding: '1.25rem 1.5rem', animation: 'fadeInUp 0.25s ease-out' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <FileText size={16} color="var(--primary)" /> Document Checklist
                                                            </h4>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                Phone: {applicant.phone} | DOB: {applicant.dob} | Gender: {applicant.gender}
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                                            {applicant.documents.map(doc => (
                                                                <div
                                                                    key={doc.name}
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        padding: '0.6rem 0.85rem',
                                                                        borderRadius: 'var(--radius-sm)',
                                                                        border: '1px solid var(--border-color)',
                                                                        backgroundColor: 'white',
                                                                        cursor: doc.status !== 'Verified' ? 'pointer' : 'default',
                                                                    }}
                                                                    onClick={() => {
                                                                        if (doc.status !== 'Verified') {
                                                                            updateDocumentStatus(applicant.id, doc.name, nextDocStatus(doc.status));
                                                                        }
                                                                    }}
                                                                >
                                                                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{doc.name}</span>
                                                                    {docBadge(doc.status)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                                            Click a document to advance its status: Pending → Submitted → Verified
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Applicant Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1100, animation: 'fadeIn 0.2s ease-out',
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: 'var(--radius-lg)',
                        width: '680px', maxHeight: '90vh', overflow: 'auto',
                        boxShadow: 'var(--shadow-lg)', animation: 'fadeInUp 0.3s ease-out',
                    }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UserPlus size={20} color="var(--primary)" /> Register New Applicant
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)', padding: '4px' }}><X size={20} /></button>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <div><label style={labelStyle}>Phone</label><input style={inputStyle} placeholder="10-digit phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                            <div><label style={labelStyle}>Date of Birth</label><input style={inputStyle} type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
                            <div><label style={labelStyle}>Gender</label>
                                <select style={inputStyle} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                            <div><label style={labelStyle}>Category</label>
                                <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    <option value="GM">GM (General Merit)</option><option value="SC">SC</option><option value="ST">ST</option><option value="OBC">OBC</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Address</label><input style={inputStyle} placeholder="Full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                            <div><label style={labelStyle}>Entry Type</label>
                                <select style={inputStyle} value={form.entryType} onChange={e => setForm({ ...form, entryType: e.target.value as EntryType })}>
                                    <option value="Regular">Regular</option><option value="Lateral">Lateral</option>
                                </select>
                            </div>
                            <div><label style={labelStyle}>Quota Type</label>
                                <select style={inputStyle} value={form.quotaType} onChange={e => setForm({ ...form, quotaType: e.target.value as QuotaName })}>
                                    <option value="KCET">KCET</option><option value="COMEDK">COMEDK</option><option value="Management">Management</option>
                                </select>
                            </div>
                            <div><label style={labelStyle}>Qualifying Exam</label><input style={inputStyle} placeholder="e.g. KCET 2026" value={form.qualifyingExam} onChange={e => setForm({ ...form, qualifyingExam: e.target.value })} /></div>
                            <div><label style={labelStyle}>Marks (%)</label><input style={inputStyle} type="number" placeholder="e.g. 85" value={form.marks || ''} onChange={e => setForm({ ...form, marks: parseInt(e.target.value) || 0 })} /></div>
                            <div><label style={labelStyle}>Allotment Number</label><input style={inputStyle} placeholder="Government allotment #" value={form.allotmentNumber} onChange={e => setForm({ ...form, allotmentNumber: e.target.value })} /></div>
                            <div><label style={labelStyle}>Program *</label>
                                <select style={inputStyle} value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value })}>
                                    <option value="">Select Program</option>
                                    {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div><label style={labelStyle}>Admission Mode</label>
                                <select style={inputStyle} value={form.admissionMode} onChange={e => setForm({ ...form, admissionMode: e.target.value as AdmissionMode })}>
                                    <option value="Government">Government</option><option value="Management">Management</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(40, 167, 69, 0.25)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><UserPlus size={16} /> Register Applicant</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantManagement;
