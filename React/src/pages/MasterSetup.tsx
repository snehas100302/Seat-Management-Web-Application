import React, { useState } from 'react';
import {
    Settings, Building2, School, GraduationCap, BookOpen, Calendar,
    Plus, Trash2, ChevronRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { CourseType, EntryType, AdmissionMode } from '../context/AppContext';

type TabKey = 'institution' | 'campus' | 'department' | 'program' | 'academicYear';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'institution', label: 'Institution', icon: Building2 },
    { key: 'campus', label: 'Campus', icon: School },
    { key: 'department', label: 'Department', icon: GraduationCap },
    { key: 'program', label: 'Program / Branch', icon: BookOpen },
    { key: 'academicYear', label: 'Academic Year', icon: Calendar },
];

const MasterSetup: React.FC = () => {
    const {
        institutions, campuses, departments, programs, academicYears,
        addInstitution, addCampus, addDepartment, addProgram, addAcademicYear,
        deleteInstitution, deleteCampus, deleteDepartment, deleteProgram, deleteAcademicYear,
    } = useAppContext();

    const [activeTab, setActiveTab] = useState<TabKey>('institution');

    // Cascading filters
    const [filterInstId, setFilterInstId] = useState('');
    const [filterCampusId, setFilterCampusId] = useState('');

    // Derived filtered lists
    const filteredCampuses = filterInstId ? campuses.filter(c => c.institutionId === filterInstId) : campuses;
    const filteredDepartments = filterCampusId
        ? departments.filter(d => d.campusId === filterCampusId)
        : filterInstId
            ? departments.filter(d => filteredCampuses.some(c => c.id === d.campusId))
            : departments;
    const filteredPrograms = filterCampusId
        ? programs.filter(p => filteredDepartments.some(d => d.id === p.departmentId))
        : filterInstId
            ? programs.filter(p => filteredDepartments.some(d => d.id === p.departmentId))
            : programs;

    // Forms state
    const [instForm, setInstForm] = useState({ name: '', code: '', address: '' });
    const [campForm, setCampForm] = useState({ name: '', institutionId: '', location: '' });
    const [deptForm, setDeptForm] = useState({ name: '', campusId: '', hod: '' });
    const [progForm, setProgForm] = useState({ name: '', departmentId: '', courseType: 'UG' as CourseType, entryType: 'Regular' as EntryType, admissionMode: 'Government' as AdmissionMode, totalIntake: 60 });
    const [yearForm, setYearForm] = useState({ year: '', isActive: false });

    const filterBarStyle: React.CSSProperties = {
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.85rem 1.25rem', marginBottom: '1.25rem',
        backgroundColor: '#f8f9fb', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
    };

    const filterLabelStyle: React.CSSProperties = {
        fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.04em',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.7rem 0.85rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        fontSize: '0.875rem',
        backgroundColor: '#fafbfc',
        transition: 'border-color 0.2s',
    };

    const btnPrimary: React.CSSProperties = {
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '0.7rem 1.5rem',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
        fontSize: '0.85rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        transition: 'background-color 0.2s',
    };

    const thStyle: React.CSSProperties = {
        padding: '0.85rem 1.25rem',
        textAlign: 'left',
        fontSize: '0.72rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-muted)',
        backgroundColor: '#f8f9fb',
        borderBottom: '1px solid var(--border-color)',
    };

    const tdStyle: React.CSSProperties = {
        padding: '0.85rem 1.25rem',
        fontSize: '0.875rem',
        borderBottom: '1px solid var(--border-color)',
    };

    const renderInstitution = () => (
        <div className="card-animate">
            <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Add Institution</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Name</label>
                        <input style={inputStyle} placeholder="e.g. ABC Institute of Technology" value={instForm.name} onChange={e => setInstForm({ ...instForm, name: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Code</label>
                        <input style={inputStyle} placeholder="e.g. ABCIT" value={instForm.code} onChange={e => setInstForm({ ...instForm, code: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Address</label>
                        <input style={inputStyle} placeholder="e.g. Bangalore, Karnataka" value={instForm.address} onChange={e => setInstForm({ ...instForm, address: e.target.value })} />
                    </div>
                </div>
                <button style={{ ...btnPrimary, marginTop: '1.25rem' }} onClick={() => {
                    if (instForm.name && instForm.code) { addInstitution(instForm); setInstForm({ name: '', code: '', address: '' }); }
                }}><Plus size={16} /> Save Institution</button>
            </div>
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><th style={thStyle}>Name</th><th style={thStyle}>Code</th><th style={thStyle}>Address</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                        {institutions.map(inst => (
                            <tr key={inst.id} className="table-row-hover">
                                <td style={{ ...tdStyle, fontWeight: 600 }}>{inst.name}</td>
                                <td style={tdStyle}><code style={{ backgroundColor: '#f1f3f5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{inst.code}</code></td>
                                <td style={tdStyle}>{inst.address}</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}><button onClick={() => deleteInstitution(inst.id)} style={{ color: 'var(--danger)', padding: '4px' }}><Trash2 size={15} /></button></td>
                            </tr>
                        ))}
                        {institutions.length === 0 && <tr><td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)' }}>No institutions added yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCampus = () => (
        <div className="card-animate">
            {/* Institution filter */}
            <div style={filterBarStyle}>
                <span style={filterLabelStyle}>Filter by Institution:</span>
                <select style={{ ...inputStyle, width: '300px' }} value={filterInstId} onChange={e => { setFilterInstId(e.target.value); setFilterCampusId(''); }}>
                    <option value="">All Institutions</option>
                    {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
            </div>
            <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Add Campus</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Name</label>
                        <input style={inputStyle} placeholder="e.g. Main Campus" value={campForm.name} onChange={e => setCampForm({ ...campForm, name: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Institution</label>
                        <select style={inputStyle} value={campForm.institutionId} onChange={e => setCampForm({ ...campForm, institutionId: e.target.value })}>
                            <option value="">Select Institution</option>
                            {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Location</label>
                        <input style={inputStyle} placeholder="e.g. Bangalore" value={campForm.location} onChange={e => setCampForm({ ...campForm, location: e.target.value })} />
                    </div>
                </div>
                <button style={{ ...btnPrimary, marginTop: '1.25rem' }} onClick={() => {
                    if (campForm.name && campForm.institutionId) { addCampus(campForm); setCampForm({ name: '', institutionId: '', location: '' }); }
                }}><Plus size={16} /> Save Campus</button>
            </div>
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><th style={thStyle}>Name</th><th style={thStyle}>Institution</th><th style={thStyle}>Location</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                        {filteredCampuses.map(c => (
                            <tr key={c.id} className="table-row-hover">
                                <td style={{ ...tdStyle, fontWeight: 600 }}>{c.name}</td>
                                <td style={tdStyle}>{institutions.find(i => i.id === c.institutionId)?.name || '—'}</td>
                                <td style={tdStyle}>{c.location}</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}><button onClick={() => deleteCampus(c.id)} style={{ color: 'var(--danger)', padding: '4px' }}><Trash2 size={15} /></button></td>
                            </tr>
                        ))}
                        {filteredCampuses.length === 0 && <tr><td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)' }}>{filterInstId ? 'No campuses for this institution.' : 'No campuses added yet.'}</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDepartment = () => (
        <div className="card-animate">
            {/* Cascading filters: Institution → Campus */}
            <div style={filterBarStyle}>
                <span style={filterLabelStyle}>Filter:</span>
                <select style={{ ...inputStyle, width: '250px' }} value={filterInstId} onChange={e => { setFilterInstId(e.target.value); setFilterCampusId(''); }}>
                    <option value="">All Institutions</option>
                    {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <select style={{ ...inputStyle, width: '250px' }} value={filterCampusId} onChange={e => setFilterCampusId(e.target.value)}>
                    <option value="">All Campuses</option>
                    {(filterInstId ? campuses.filter(c => c.institutionId === filterInstId) : campuses).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Add Department</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Name</label>
                        <input style={inputStyle} placeholder="e.g. Computer Science" value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Campus</label>
                        <select style={inputStyle} value={deptForm.campusId} onChange={e => setDeptForm({ ...deptForm, campusId: e.target.value })}>
                            <option value="">Select Campus</option>
                            {(filterInstId ? campuses.filter(c => c.institutionId === filterInstId) : campuses).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>HOD</label>
                        <input style={inputStyle} placeholder="e.g. Dr. Raghav" value={deptForm.hod} onChange={e => setDeptForm({ ...deptForm, hod: e.target.value })} />
                    </div>
                </div>
                <button style={{ ...btnPrimary, marginTop: '1.25rem' }} onClick={() => {
                    if (deptForm.name && deptForm.campusId) { addDepartment(deptForm); setDeptForm({ name: '', campusId: '', hod: '' }); }
                }}><Plus size={16} /> Save Department</button>
            </div>
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><th style={thStyle}>Name</th><th style={thStyle}>Campus</th><th style={thStyle}>HOD</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                        {filteredDepartments.map(d => (
                            <tr key={d.id} className="table-row-hover">
                                <td style={{ ...tdStyle, fontWeight: 600 }}>{d.name}</td>
                                <td style={tdStyle}>{campuses.find(c => c.id === d.campusId)?.name || '—'}</td>
                                <td style={tdStyle}>{d.hod}</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}><button onClick={() => deleteDepartment(d.id)} style={{ color: 'var(--danger)', padding: '4px' }}><Trash2 size={15} /></button></td>
                            </tr>
                        ))}
                        {filteredDepartments.length === 0 && <tr><td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)' }}>{(filterInstId || filterCampusId) ? 'No departments match the selected filter.' : 'No departments added yet.'}</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderProgram = () => (
        <div className="card-animate">
            {/* Cascading filters: Institution → Campus */}
            <div style={filterBarStyle}>
                <span style={filterLabelStyle}>Filter:</span>
                <select style={{ ...inputStyle, width: '250px' }} value={filterInstId} onChange={e => { setFilterInstId(e.target.value); setFilterCampusId(''); }}>
                    <option value="">All Institutions</option>
                    {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <select style={{ ...inputStyle, width: '250px' }} value={filterCampusId} onChange={e => setFilterCampusId(e.target.value)}>
                    <option value="">All Campuses</option>
                    {(filterInstId ? campuses.filter(c => c.institutionId === filterInstId) : campuses).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Add Program / Branch</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Program Name</label>
                        <input style={inputStyle} placeholder="e.g. Mechanical Engineering" value={progForm.name} onChange={e => setProgForm({ ...progForm, name: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Department</label>
                        <select style={inputStyle} value={progForm.departmentId} onChange={e => setProgForm({ ...progForm, departmentId: e.target.value })}>
                            <option value="">Select Department</option>
                            {filteredDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Course Type</label>
                        <select style={inputStyle} value={progForm.courseType} onChange={e => setProgForm({ ...progForm, courseType: e.target.value as CourseType })}>
                            <option value="UG">UG (Undergraduate)</option>
                            <option value="PG">PG (Postgraduate)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Entry Type</label>
                        <select style={inputStyle} value={progForm.entryType} onChange={e => setProgForm({ ...progForm, entryType: e.target.value as EntryType })}>
                            <option value="Regular">Regular</option>
                            <option value="Lateral">Lateral</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Admission Mode</label>
                        <select style={inputStyle} value={progForm.admissionMode} onChange={e => setProgForm({ ...progForm, admissionMode: e.target.value as AdmissionMode })}>
                            <option value="Government">Government</option>
                            <option value="Management">Management</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Total Intake</label>
                        <input style={inputStyle} type="number" placeholder="e.g. 60" value={progForm.totalIntake} onChange={e => setProgForm({ ...progForm, totalIntake: parseInt(e.target.value) || 0 })} />
                    </div>
                </div>
                <button style={{ ...btnPrimary, marginTop: '1.25rem' }} onClick={() => {
                    if (progForm.name && progForm.departmentId) {
                        addProgram(progForm);
                        setProgForm({ name: '', departmentId: '', courseType: 'UG', entryType: 'Regular', admissionMode: 'Government', totalIntake: 60 });
                    }
                }}><Plus size={16} /> Save Program</button>
            </div>
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                        <th style={thStyle}>Program</th><th style={thStyle}>Department</th><th style={thStyle}>Type</th><th style={thStyle}>Entry</th><th style={thStyle}>Mode</th><th style={thStyle}>Intake</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                    </tr></thead>
                    <tbody>
                        {filteredPrograms.map(p => (
                            <tr key={p.id} className="table-row-hover">
                                <td style={{ ...tdStyle, fontWeight: 600 }}>{p.name}</td>
                                <td style={tdStyle}>{departments.find(d => d.id === p.departmentId)?.name || '—'}</td>
                                <td style={tdStyle}><span className="badge badge-info">{p.courseType}</span></td>
                                <td style={tdStyle}>{p.entryType}</td>
                                <td style={tdStyle}>{p.admissionMode}</td>
                                <td style={tdStyle}><strong>{p.totalIntake}</strong></td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}><button onClick={() => deleteProgram(p.id)} style={{ color: 'var(--danger)', padding: '4px' }}><Trash2 size={15} /></button></td>
                            </tr>
                        ))}
                        {filteredPrograms.length === 0 && <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)' }}>{(filterInstId || filterCampusId) ? 'No programs match the selected filter.' : 'No programs added yet.'}</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAcademicYear = () => (
        <div className="card-animate">
            <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem' }}>Add Academic Year</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Year</label>
                        <input style={inputStyle} placeholder="e.g. 2026-2027" value={yearForm.year} onChange={e => setYearForm({ ...yearForm, year: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={yearForm.isActive} onChange={e => setYearForm({ ...yearForm, isActive: e.target.checked })} />
                            Active Year
                        </label>
                    </div>
                </div>
                <button style={{ ...btnPrimary, marginTop: '1.25rem' }} onClick={() => {
                    if (yearForm.year) { addAcademicYear(yearForm); setYearForm({ year: '', isActive: false }); }
                }}><Plus size={16} /> Save Academic Year</button>
            </div>
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><th style={thStyle}>Year</th><th style={thStyle}>Status</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                        {academicYears.map(ay => (
                            <tr key={ay.id} className="table-row-hover">
                                <td style={{ ...tdStyle, fontWeight: 600 }}>{ay.year}</td>
                                <td style={tdStyle}>
                                    <span className={`badge ${ay.isActive ? 'badge-success' : 'badge-neutral'}`}>
                                        {ay.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}><button onClick={() => deleteAcademicYear(ay.id)} style={{ color: 'var(--danger)', padding: '4px' }}><Trash2 size={15} /></button></td>
                            </tr>
                        ))}
                        {academicYears.length === 0 && <tr><td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)' }}>No academic years added yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'institution': return renderInstitution();
            case 'campus': return renderCampus();
            case 'department': return renderDepartment();
            case 'program': return renderProgram();
            case 'academicYear': return renderAcademicYear();
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={22} color="var(--primary)" /> Master Setup
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configure your institution's foundational data — programs, quotas, and hierarchy.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                        {activeTab === tab.key && <ChevronRight size={12} style={{ opacity: 0.4 }} />}
                    </button>
                ))}
            </div>

            {renderContent()}
        </div>
    );
};

export default MasterSetup;
