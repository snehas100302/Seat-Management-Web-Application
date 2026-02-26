import React, { useState, useMemo } from 'react';
import { Grid3X3, Save, ChevronDown, ChevronRight, Building2, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const QUOTA_NAMES: ('KCET' | 'COMEDK' | 'MANAGEMENT')[] = ['KCET', 'COMEDK', 'MANAGEMENT'];

const QUOTA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    KCET:       { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    COMEDK:     { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    MANAGEMENT: { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
};

const SeatMatrix: React.FC = () => {
    const { institutions, campuses, departments, programs, quotas, updateQuota, addQuota } = useAppContext();

    const [selectedInstId, setSelectedInstId] = useState<number | null>(null);
    const [expandedCampus, setExpandedCampus] = useState<Record<number, boolean>>({});
    const [expandedDept, setExpandedDept] = useState<Record<number, boolean>>({});
    const [editState, setEditState] = useState<Record<number, number>>({});
    const [savedMsg, setSavedMsg] = useState<number | null>(null);
    const [superSeats, setSuperSeats] = useState<Record<number, number>>({});
    const [jkSeats, setJkSeats] = useState<Record<number, number>>({});
    const [specialSaved, setSpecialSaved] = useState<number | null>(null);

    // ── Derived data for selected institution ──
    const instCampuses = useMemo(
        () => campuses.filter(c => c.institutionId === selectedInstId),
        [campuses, selectedInstId]
    );

    const campusDepts = useMemo(
        () => (campusId: number) => departments.filter(d => d.campusId === campusId),
        [departments]
    );

    const deptPrograms = useMemo(
        () => (deptId: number) => programs.filter(p => p.departmentId === deptId),
        [programs]
    );

    const getQuotaByName = (programId: number, name: string) =>
        quotas.find(q => q.programId === programId && q.name === name);

    const getEditValue = (quotaId: number, original: number) =>
        editState[quotaId] !== undefined ? editState[quotaId] : original;

    const handleEdit = (quotaId: number, value: number) =>
        setEditState(prev => ({ ...prev, [quotaId]: value }));

    const handleSaveProgram = async (programId: number) => {
        const pQuotas = quotas.filter(q => q.programId === programId);
        for (const q of pQuotas) {
            if (editState[q.id] !== undefined) {
                await updateQuota(q.id, { totalSeats: editState[q.id] });
            }
        }
        for (const name of QUOTA_NAMES) {
            if (!getQuotaByName(programId, name)) {
                await addQuota(programId, { name, totalSeats: 0, filledSeats: 0 });
            }
        }
        setSavedMsg(programId);
        setTimeout(() => setSavedMsg(null), 2000);
    };

    const handleSelectInstitution = (id: number) => {
        if (selectedInstId === id) {
            setSelectedInstId(null);
        } else {
            setSelectedInstId(id);
            setExpandedCampus({});
            setExpandedDept({});
        }
    };

    // ── Styles ──
    const card: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
    };

    const inputNum: React.CSSProperties = {
        width: '64px',
        padding: '0.35rem 0.4rem',
        borderRadius: '6px',
        border: '1.5px solid #d1d5db',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: 700,
        backgroundColor: '#fff',
        color: '#1e293b',
    };

    return (
        <div style={{ padding: '0.25rem 0' }}>
            {/* ── Page Header */}
            <div style={{ marginBottom: '1.75rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Grid3X3 size={22} color="var(--primary)" />
                    Seat Matrix & Quota Configuration
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
                    Select an institution to view and configure its seat allocations.
                </p>
            </div>

            {/* ── Institution Selector Cards */}
            {institutions.length === 0 ? (
                <div style={{ ...card, padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No institutions found. Add institutions in Master Setup first.
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                    {institutions.map(inst => {
                        const isSelected = selectedInstId === inst.id;
                        return (
                            <button
                                key={inst.id}
                                onClick={() => handleSelectInstitution(inst.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.65rem 1.25rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: isSelected ? '2px solid #2563eb' : '2px solid var(--border-color)',
                                    backgroundColor: isSelected ? '#eff6ff' : 'var(--bg-card)',
                                    color: isSelected ? '#1d4ed8' : 'var(--text-primary)',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.15)' : 'none',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <Building2 size={17} />
                                {inst.name}
                                {inst.code && (
                                    <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.7 }}>({inst.code})</span>
                                )}
                                {isSelected && <ChevronDown size={16} />}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ── Institution Detail Panel */}
            {selectedInstId !== null && (() => {
                const inst = institutions.find(i => i.id === selectedInstId)!;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* No campuses */}
                        {instCampuses.length === 0 && (
                            <div style={{ ...card, padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No campuses found under <strong>{inst.name}</strong>. Add campuses in Master Setup.
                            </div>
                        )}

                        {/* ── Each Campus */}
                        {instCampuses.map(campus => {
                            const isCampusOpen = !!expandedCampus[campus.id];
                            const depts = campusDepts(campus.id);

                            return (
                                <div key={campus.id} style={card}>
                                    {/* Campus Header */}
                                    <div
                                        onClick={() => setExpandedCampus(prev => ({ ...prev, [campus.id]: !prev[campus.id] }))}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            padding: '1rem 1.25rem',
                                            cursor: 'pointer',
                                            backgroundColor: '#f0fdf4',
                                            borderBottom: isCampusOpen ? '1px solid #d1fae5' : 'none',
                                            userSelect: 'none',
                                        }}
                                    >
                                        {isCampusOpen ? <ChevronDown size={18} color="#15803d" /> : <ChevronRight size={18} color="#15803d" />}
                                        <MapPin size={16} color="#15803d" />
                                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#14532d' }}>
                                            {campus.name}
                                        </span>
                                        {campus.location && (
                                            <span style={{ fontSize: '0.8rem', color: '#4ade80', marginLeft: '0.25rem' }}>
                                                • {campus.location}
                                            </span>
                                        )}
                                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#16a34a', fontWeight: 500 }}>
                                            {depts.length} dept{depts.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {isCampusOpen && (
                                        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {depts.length === 0 ? (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No departments under this campus.</p>
                                            ) : depts.map(dept => {
                                                const isDeptOpen = !!expandedDept[dept.id];
                                                const progs = deptPrograms(dept.id);

                                                return (
                                                    <div key={dept.id} style={{ border: '1px solid #f3e8ff', borderRadius: '10px', overflow: 'hidden' }}>
                                                        {/* Department Header */}
                                                        <div
                                                            onClick={() => setExpandedDept(prev => ({ ...prev, [dept.id]: !prev[dept.id] }))}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                padding: '0.7rem 1rem',
                                                                cursor: 'pointer',
                                                                backgroundColor: '#fdf4ff',
                                                                borderBottom: isDeptOpen ? '1px solid #f3e8ff' : 'none',
                                                                userSelect: 'none',
                                                            }}
                                                        >
                                                            {isDeptOpen ? <ChevronDown size={16} color="#7e22ce" /> : <ChevronRight size={16} color="#7e22ce" />}
                                                            <BookOpen size={15} color="#7e22ce" />
                                                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#581c87' }}>{dept.name}</span>
                                                            {dept.hod && (
                                                                <span style={{ fontSize: '0.75rem', color: '#a855f7', marginLeft: '0.25rem' }}>• HOD: {dept.hod}</span>
                                                            )}
                                                            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#7e22ce', fontWeight: 500 }}>
                                                                {progs.length} program{progs.length !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>

                                                        {/* Programs Table */}
                                                        {isDeptOpen && (
                                                            <div>
                                                                {progs.length === 0 ? (
                                                                    <p style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No programs under this department.</p>
                                                                ) : (
                                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                                                        <thead>
                                                                            <tr style={{ backgroundColor: '#fafafa' }}>
                                                                                <th style={{ padding: '0.6rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb' }}>Program</th>
                                                                                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb' }}>Total</th>
                                                                                {QUOTA_NAMES.map(n => (
                                                                                    <th key={n} style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb', color: QUOTA_COLORS[n].text }}>
                                                                                        {n}
                                                                                    </th>
                                                                                ))}
                                                                                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                                                                                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb' }}>Save</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {progs.map(prog => {
                                                                                const totalQuotaSeats = QUOTA_NAMES.reduce((sum, name) => {
                                                                                    const q = getQuotaByName(prog.id, name);
                                                                                    return sum + (q ? getEditValue(q.id, q.totalSeats) : 0);
                                                                                }, 0);
                                                                                const isValid = totalQuotaSeats === prog.totalIntake;

                                                                                return (
                                                                                    <tr key={prog.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                                                        <td style={{ padding: '0.65rem 1rem' }}>
                                                                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prog.name}</div>
                                                                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>{prog.courseType} • {prog.entryType}</div>
                                                                                        </td>
                                                                                        <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                                                                                            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#2563eb' }}>{prog.totalIntake}</span>
                                                                                        </td>
                                                                                        {QUOTA_NAMES.map(name => {
                                                                                            const q = getQuotaByName(prog.id, name);
                                                                                            return (
                                                                                                <td key={name} style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                                                                                                    {q ? (
                                                                                                        <div>
                                                                                                            <input
                                                                                                                type="number"
                                                                                                                style={{ ...inputNum, borderColor: QUOTA_COLORS[name].border }}
                                                                                                                value={getEditValue(q.id, q.totalSeats)}
                                                                                                                onChange={e => handleEdit(q.id, parseInt(e.target.value) || 0)}
                                                                                                                min={0}
                                                                                                            />
                                                                                                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{q.filledSeats} filled</div>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>—</span>
                                                                                                    )}
                                                                                                </td>
                                                                                            );
                                                                                        })}
                                                                                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                                                                                            {isValid ? (
                                                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', backgroundColor: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '99px' }}>
                                                                                                    ✓ Valid
                                                                                                </span>
                                                                                            ) : (
                                                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: 600, color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.2rem 0.5rem', borderRadius: '99px' }}>
                                                                                                    <AlertCircle size={11} /> {totalQuotaSeats}/{prog.totalIntake}
                                                                                                </span>
                                                                                            )}
                                                                                        </td>
                                                                                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                                                                                            <button
                                                                                                onClick={() => handleSaveProgram(prog.id)}
                                                                                                style={{
                                                                                                    backgroundColor: savedMsg === prog.id ? '#16a34a' : '#2563eb',
                                                                                                    color: 'white',
                                                                                                    padding: '0.3rem 0.75rem',
                                                                                                    borderRadius: '6px',
                                                                                                    fontSize: '0.78rem',
                                                                                                    fontWeight: 600,
                                                                                                    border: 'none',
                                                                                                    cursor: 'pointer',
                                                                                                    display: 'inline-flex',
                                                                                                    alignItems: 'center',
                                                                                                    gap: '4px',
                                                                                                    transition: 'background 0.2s',
                                                                                                }}
                                                                                            >
                                                                                                <Save size={12} />
                                                                                                {savedMsg === prog.id ? 'Saved!' : 'Save'}
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* ── Special Allocations for this Institution ── */}
                        <div style={{
                            ...card,
                            padding: '1.25rem 1.5rem',
                            background: 'linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%)',
                            border: '1.5px solid #fcd34d',
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#78350f', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                ⭐ Special Seat Allocations — {inst.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: '1rem' }}>
                                Seats allocated over and above the regular intake for this institution.
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#78350f', marginBottom: '0.4rem' }}>
                                        Supernumerary Seats
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={superSeats[inst.id] ?? 0}
                                        onChange={e => setSuperSeats(prev => ({ ...prev, [inst.id]: parseInt(e.target.value) || 0 }))}
                                        style={{ ...inputNum, width: '80px', borderColor: '#fcd34d', fontSize: '1rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#78350f', marginBottom: '0.4rem' }}>
                                        J&K Quota Seats
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={jkSeats[inst.id] ?? 0}
                                        onChange={e => setJkSeats(prev => ({ ...prev, [inst.id]: parseInt(e.target.value) || 0 }))}
                                        style={{ ...inputNum, width: '80px', borderColor: '#fcd34d', fontSize: '1rem' }}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setSpecialSaved(inst.id);
                                        setTimeout(() => setSpecialSaved(null), 2500);
                                    }}
                                    style={{
                                        backgroundColor: specialSaved === inst.id ? '#16a34a' : '#d97706',
                                        color: 'white',
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'background 0.2s',
                                        marginBottom: '0.1rem',
                                    }}
                                >
                                    <Save size={14} />
                                    {specialSaved === inst.id ? 'Saved!' : 'Save Allocations'}
                                </button>
                            </div>
                        </div>

                    </div>
                );
            })()}
        </div>
    );
};

export default SeatMatrix;
