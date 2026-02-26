import React, { useState } from 'react';
import { Percent, Plus, Edit3, Save, X, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { QuotaName } from '../context/AppContext';

const QUOTA_NAMES: QuotaName[] = ['KCET', 'COMEDK', 'MANAGEMENT'];

const QUOTA_COLORS: Record<QuotaName, { bg: string; text: string; border: string }> = {
    KCET: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    COMEDK: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    MANAGEMENT: { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
};

const ConfigureQuotas: React.FC = () => {
    const { institutions, campuses, departments, programs, quotas, addQuota, updateQuota, isLoadingData } = useAppContext();

    const [selectedInstId, setSelectedInstId] = useState<number | ''>('');
    const [selectedCampusId, setSelectedCampusId] = useState<number | ''>('');
    const [selectedDeptId, setSelectedDeptId] = useState<number | ''>('');
    const [selectedProgId, setSelectedProgId] = useState<number | ''>('');

    const [addForm, setAddForm] = useState<{ quotaType: QuotaName; totalSeats: number }>({ quotaType: 'KCET', totalSeats: 0 });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editSeats, setEditSeats] = useState<number>(0);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    // ── Cascading filter helpers ──
    const filteredCampuses = campuses.filter(c => c.institutionId === selectedInstId);
    const filteredDepts = departments.filter(d => d.campusId === selectedCampusId);
    const filteredProgs = programs.filter(p => p.departmentId === selectedDeptId);
    const programQuotas = quotas.filter(q => q.programId === selectedProgId);
    const selectedProg = programs.find(p => p.id === selectedProgId);

    const availableQuotaNames = QUOTA_NAMES.filter(n => !programQuotas.some(q => q.name === n));

    const showFeedback = (type: 'success' | 'error', msg: string) => {
        setFeedback({ type, msg });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleInstChange = (id: number | '') => {
        setSelectedInstId(id);
        setSelectedCampusId('');
        setSelectedDeptId('');
        setSelectedProgId('');
    };

    const handleCampusChange = (id: number | '') => {
        setSelectedCampusId(id);
        setSelectedDeptId('');
        setSelectedProgId('');
    };

    const handleDeptChange = (id: number | '') => {
        setSelectedDeptId(id);
        setSelectedProgId('');
    };

    const handleAddQuota = async () => {
        if (!selectedProgId) return;
        if (addForm.totalSeats <= 0) { showFeedback('error', 'Total seats must be greater than 0'); return; }
        setSaving(true);
        try {
            await addQuota(selectedProgId as number, { quotaType: addForm.quotaType, totalSeats: addForm.totalSeats });
            setAddForm({ quotaType: availableQuotaNames.filter(n => n !== addForm.quotaType)[0] || 'KCET', totalSeats: 0 });
            showFeedback('success', `${addForm.quotaType} quota added successfully`);
        } catch {
            showFeedback('error', 'Failed to add quota');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateQuota = async (id: number) => {
        if (editSeats <= 0) { showFeedback('error', 'Total seats must be greater than 0'); return; }
        setSaving(true);
        try {
            const q = programQuotas.find(q => q.id === id)!;
            await updateQuota(id, { quotaType: q.name, totalSeats: editSeats });
            setEditingId(null);
            showFeedback('success', 'Quota updated successfully');
        } catch {
            showFeedback('error', 'Failed to update quota');
        } finally {
            setSaving(false);
        }
    };

    // ── Styles ──
    const pageStyle: React.CSSProperties = { padding: '2rem', maxWidth: '960px', margin: '0 auto' };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.775rem', fontWeight: 600,
        color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em'
    };

    const selectStyle: React.CSSProperties = {
        width: '100%', padding: '0.6rem 0.85rem',
        borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
        fontSize: '0.9rem', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)',
        appearance: 'none', cursor: 'pointer',
    };

    const inputStyle: React.CSSProperties = {
        ...selectStyle,
        appearance: undefined,
    };

    const btnPrimary: React.CSSProperties = {
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--primary)', color: '#fff',
        fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
        opacity: saving ? 0.7 : 1,
    };

    const btnGhost: React.CSSProperties = {
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)', backgroundColor: 'transparent',
        color: 'var(--text-primary)', fontSize: '0.875rem', cursor: 'pointer',
    };

    const totalIntake = selectedProg?.totalIntake ?? 0;
    const allocatedSeats = programQuotas.reduce((sum, q) => sum + q.totalSeats, 0);
    const remaining = totalIntake - allocatedSeats;

    return (
        <div style={pageStyle}>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Percent size={20} color="var(--primary)" strokeWidth={2} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Configure Quotas</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '3.25rem' }}>
                    Assign seat quotas (KCET / COMEDK / Management) to programs
                </p>
            </div>

            {/* Feedback banner */}
            {feedback && (
                <div style={{
                    padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem',
                    backgroundColor: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                    color: feedback.type === 'success' ? '#15803d' : '#b91c1c',
                    fontSize: '0.875rem', fontWeight: 500,
                }}>
                    {feedback.msg}
                </div>
            )}

            {/* Program Selector */}
            <div style={cardStyle}>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                    Select Program
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    {/* Institution */}
                    <div>
                        <label style={labelStyle}>Institution</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                style={selectStyle}
                                value={selectedInstId}
                                onChange={e => handleInstChange(e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">— Select —</option>
                                {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                        </div>
                    </div>

                    {/* Campus */}
                    <div>
                        <label style={labelStyle}>Campus</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{ ...selectStyle, opacity: !selectedInstId ? 0.5 : 1 }}
                                disabled={!selectedInstId}
                                value={selectedCampusId}
                                onChange={e => handleCampusChange(e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">— Select —</option>
                                {filteredCampuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                        </div>
                    </div>

                    {/* Department */}
                    <div>
                        <label style={labelStyle}>Department</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{ ...selectStyle, opacity: !selectedCampusId ? 0.5 : 1 }}
                                disabled={!selectedCampusId}
                                value={selectedDeptId}
                                onChange={e => handleDeptChange(e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">— Select —</option>
                                {filteredDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                        </div>
                    </div>

                    {/* Program */}
                    <div>
                        <label style={labelStyle}>Program</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{ ...selectStyle, opacity: !selectedDeptId ? 0.5 : 1 }}
                                disabled={!selectedDeptId}
                                value={selectedProgId}
                                onChange={e => setSelectedProgId(e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">— Select —</option>
                                {filteredProgs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.admissionMode})</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Program selected – show quotas */}
            {selectedProgId && selectedProg && (
                <>
                    {/* Intake summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                        {[
                            { label: 'Total Intake', value: totalIntake, color: 'var(--primary)' },
                            { label: 'Seats Assigned', value: allocatedSeats, color: '#15803d' },
                            { label: 'Unassigned Seats', value: remaining, color: remaining < 0 ? '#b91c1c' : '#d97706' },
                        ].map(stat => (
                            <div key={stat.label} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center', padding: '1.25rem 1rem' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Existing Quotas */}
                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                            Configured Quotas
                        </h2>

                        {isLoadingData ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading…</p>
                        ) : programQuotas.length === 0 ? (
                            <div style={{
                                textAlign: 'center', padding: '2.5rem',
                                color: 'var(--text-secondary)', fontSize: '0.875rem',
                                border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)'
                            }}>
                                No quotas configured for this program yet. Add one below.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {programQuotas.map(q => {
                                    const colors = QUOTA_COLORS[q.name] || QUOTA_COLORS.MANAGEMENT;
                                    const fillPct = q.totalSeats > 0 ? Math.min(100, Math.round((q.filledSeats / q.totalSeats) * 100)) : 0;
                                    return (
                                        <div key={q.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${colors.border}`, backgroundColor: colors.bg,
                                        }}>
                                            {/* Badge */}
                                            <div style={{
                                                minWidth: '90px', padding: '0.3rem 0.75rem',
                                                borderRadius: 'var(--radius-sm)', textAlign: 'center',
                                                backgroundColor: colors.border, color: colors.text,
                                                fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.04em'
                                            }}>
                                                {q.name}
                                            </div>

                                            {/* Seats info */}
                                            <div style={{ flex: 1 }}>
                                                {editingId === q.id ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Seats:</label>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={editSeats}
                                                            onChange={e => setEditSeats(Number(e.target.value))}
                                                            style={{ ...inputStyle, width: '90px' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.4rem' }}>
                                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                                                <strong>{q.totalSeats}</strong> <span style={{ color: 'var(--text-secondary)' }}>total</span>
                                                            </span>
                                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                                                <strong>{q.filledSeats}</strong> <span style={{ color: 'var(--text-secondary)' }}>filled</span>
                                                            </span>
                                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                                                <strong>{q.totalSeats - q.filledSeats}</strong> <span style={{ color: 'var(--text-secondary)' }}>available</span>
                                                            </span>
                                                        </div>
                                                        {/* Progress bar */}
                                                        <div style={{ height: '6px', borderRadius: '99px', backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                                                            <div style={{ width: `${fillPct}%`, height: '100%', borderRadius: '99px', backgroundColor: colors.text, transition: 'width 0.4s ease' }} />
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                                                {editingId === q.id ? (
                                                    <>
                                                        <button
                                                            style={{ ...btnPrimary, padding: '0.45rem 0.85rem' }}
                                                            onClick={() => handleUpdateQuota(q.id)}
                                                            disabled={saving}
                                                        >
                                                            <Save size={14} /> Save
                                                        </button>
                                                        <button
                                                            style={{ ...btnGhost, padding: '0.45rem 0.75rem' }}
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        style={{ ...btnGhost, padding: '0.45rem 0.75rem', color: colors.text, borderColor: colors.border }}
                                                        onClick={() => { setEditingId(q.id); setEditSeats(q.totalSeats); }}
                                                    >
                                                        <Edit3 size={14} /> Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Add new quota */}
                    {availableQuotaNames.length > 0 && (
                        <div style={cardStyle}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                                Add New Quota
                            </h2>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 160px' }}>
                                    <label style={labelStyle}>Quota Type</label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            style={selectStyle}
                                            value={addForm.quotaType}
                                            onChange={e => setAddForm(f => ({ ...f, quotaType: e.target.value as QuotaName }))}
                                        >
                                            {availableQuotaNames.map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                        <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                                    </div>
                                </div>
                                <div style={{ flex: '1 1 140px' }}>
                                    <label style={labelStyle}>Total Seats</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={totalIntake}
                                        value={addForm.totalSeats || ''}
                                        placeholder="e.g. 60"
                                        onChange={e => setAddForm(f => ({ ...f, totalSeats: Number(e.target.value) }))}
                                        style={inputStyle}
                                    />
                                </div>
                                <button
                                    style={{ ...btnPrimary, flexShrink: 0 }}
                                    onClick={handleAddQuota}
                                    disabled={saving || !addForm.totalSeats}
                                >
                                    <Plus size={16} /> Add Quota
                                </button>
                            </div>

                            {remaining < 0 && (
                                <p style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: '#b91c1c' }}>
                                    Warning: Assigned seats ({allocatedSeats}) exceed total intake ({totalIntake}).
                                </p>
                            )}
                        </div>
                    )}

                    {availableQuotaNames.length === 0 && programQuotas.length > 0 && (
                        <div style={{
                            padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                            color: '#15803d', fontSize: '0.875rem', fontWeight: 500,
                        }}>
                            All quota types (KCET, COMEDK, Management) have been configured for this program.
                        </div>
                    )}
                </>
            )}

            {/* Empty state when no program selected */}
            {!selectedProgId && (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    color: 'var(--text-secondary)', border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                }}>
                    <Percent size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Select a program above to configure its quotas</p>
                    <p style={{ fontSize: '0.825rem', marginTop: '0.35rem' }}>Choose Institution → Campus → Department → Program</p>
                </div>
            )}
        </div>
    );
};

export default ConfigureQuotas;
