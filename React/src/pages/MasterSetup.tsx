import React, { useState, useRef, useEffect } from 'react';
import { Settings, Plus, Eye, Edit3, Trash2, Building2, School, GraduationCap, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { CourseType, EntryType, AdmissionMode, Institution, Campus, Department, Program } from '../context/AppContext';

type MainTab = 'add' | 'view' | 'update' | 'delete';

// Compute current academic year from today's date
const computeDefaultYear = (): string => {
    const d = new Date();
    const yr = d.getFullYear();
    return `${yr}-${yr + 1}`;
};

// Segmented toggle for 2-3 options
const ToggleGroup: React.FC<{
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (v: string) => void;
}> = ({ label, options, value, onChange }) => (
    <div>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
        <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #d1d5db' }}>
            {options.map((opt, idx) => (
                <button key={opt.value} onClick={() => onChange(opt.value)} type="button" style={{
                    flex: 1, padding: '0.55rem 0.5rem', fontSize: '0.82rem', fontWeight: 600,
                    backgroundColor: value === opt.value ? 'var(--primary)' : '#fff',
                    color: value === opt.value ? '#fff' : '#6b7280',
                    border: 'none', cursor: 'pointer',
                    borderRight: idx < options.length - 1 ? '1px solid #d1d5db' : 'none',
                    transition: 'all 0.15s ease',
                }}>{opt.label}</button>
            ))}
        </div>
    </div>
);

const MasterSetup: React.FC = () => {
    const {
        institutions, campuses, departments, programs, academicYears,
        addInstitution, addCampus, addDepartment, addProgram, addAcademicYear,
        updateInstitution, updateCampus, updateDepartment, updateProgram,
        deleteInstitution, deleteCampus, deleteDepartment, deleteProgram,
    } = useAppContext();

    const [activeTab, setActiveTab] = useState<MainTab>('add');

    // ── Guided stepper state ──
    const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
    const step1Ref = useRef<HTMLDivElement>(null);
    const step2Ref = useRef<HTMLDivElement>(null);
    const step3Ref = useRef<HTMLDivElement>(null);
    const step4Ref = useRef<HTMLDivElement>(null);
    const stepRefMap: Record<number, React.RefObject<HTMLDivElement>> = { 1: step1Ref, 2: step2Ref, 3: step3Ref, 4: step4Ref };

    const advanceTo = (step: 1 | 2 | 3 | 4) => {
        setActiveStep(step);
        setTimeout(() => stepRefMap[step].current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    };

    // Inline feedback per step
    const [stepMsg, setStepMsg] = useState<Partial<Record<1 | 2 | 3 | 4, { ok: boolean; text: string }>>>({});
    const showMsg = (step: 1 | 2 | 3 | 4, ok: boolean, text: string) => {
        setStepMsg(m => ({ ...m, [step]: { ok, text } }));
        setTimeout(() => setStepMsg(m => { const n = { ...m }; delete n[step]; return n; }), 3000);
    };

    // Selection State
    const [selectedInstId, setSelectedInstId] = useState<number | 'NEW' | ''>('NEW');
    const [selectedCampusId, setSelectedCampusId] = useState<number | ''>('');
    const [selectedDeptId, setSelectedDeptId] = useState<number | ''>('');

    // ── Auto-select newly added items as they arrive from API ──
    const prevInstLen = useRef(institutions.length);
    useEffect(() => {
        if (institutions.length > prevInstLen.current) {
            const newest = institutions[institutions.length - 1];
            setSelectedInstId(newest.id);
        }
        prevInstLen.current = institutions.length;
    }, [institutions]);

    const prevCampLen = useRef(campuses.length);
    useEffect(() => {
        if (campuses.length > prevCampLen.current && selectedInstId !== 'NEW' && selectedInstId !== '') {
            const newest = campuses.filter(c => c.institutionId === selectedInstId).slice(-1)[0];
            if (newest) setSelectedCampusId(newest.id);
        }
        prevCampLen.current = campuses.length;
    }, [campuses]);

    const prevDeptLen = useRef(departments.length);
    useEffect(() => {
        if (departments.length > prevDeptLen.current && selectedCampusId) {
            const newest = departments.filter(d => d.campusId === selectedCampusId).slice(-1)[0];
            if (newest) setSelectedDeptId(newest.id);
        }
        prevDeptLen.current = departments.length;
    }, [departments]);

    // ── Auto-save current academic year if not exists ──
    useEffect(() => {
        const ensureCurrentAcademicYear = async () => {
            const defaultYear = computeDefaultYear();
            const yearExists = academicYears.some(y => y.year === defaultYear);
            
            if (!yearExists && yearForm.year === defaultYear) {
                // Auto-save the default year
                try {
                    await addAcademicYear({ year: defaultYear });
                    setYearSaved(true);
                    setTimeout(() => setYearSaved(false), 3000);
                } catch (e) {
                    console.warn('Failed to auto-create academic year:', e);
                }
            }
        };
        
        ensureCurrentAcademicYear();
    }, [academicYears.length]);

    // Form States (Add)
    const [instForm, setInstForm] = useState({ name: '', code: '', address: '' });
    const [campForm, setCampForm] = useState({ name: '', location: '' });
    const [deptForm, setDeptForm] = useState({ name: '', hod: '' });
    const [progForm, setProgForm] = useState({
        name: '', courseType: 'UG' as CourseType,
        entryType: 'REGULAR' as EntryType, admissionMode: 'GOVERNMENT' as AdmissionMode, totalIntake: 60,
        quotaKCET: 0, quotaCOMEDK: 0, quotaMgmt: 0,
    });
    // Academic Year: auto-filled from current date, common for all institutions
    const [yearForm, setYearForm] = useState({ year: computeDefaultYear() });
    const [yearSaved, setYearSaved] = useState(false);

    // Form States (Update)
    const [updInst, setUpdInst] = useState<Partial<Institution>>({});
    const [updCamp, setUpdCamp] = useState<Partial<Campus>>({});
    const [updDept, setUpdDept] = useState<Partial<Department>>({});
    const [updProg, setUpdProg] = useState<Partial<Program>>({});

    // Update Selection State
    const [updateTarget, setUpdateTarget] = useState<{ type: 'none' | 'inst' | 'camp' | 'dept' | 'prog' | 'year', id: number | '' }>({ type: 'none', id: '' });

    const resetSelections = () => {
        setSelectedCampusId('');
        setSelectedDeptId('');
        setUpdateTarget({ type: 'none', id: '' });
    };

    const handleTabChange = (tab: MainTab) => {
        setActiveTab(tab);
        if (tab === 'add' && !institutions.length) setSelectedInstId('NEW');
        else if (tab !== 'add' && selectedInstId === 'NEW') setSelectedInstId(institutions[0]?.id || '');
        resetSelections();
    };

    // ── Shared styles ──
    const filterBarStyle: React.CSSProperties = {
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.85rem 1.25rem', marginBottom: '1.25rem',
        backgroundColor: '#f8f9fb', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)',
        padding: '1.5rem', marginBottom: '1.5rem',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)', fontSize: '0.875rem',
        backgroundColor: '#fafbfc', transition: 'border-color 0.2s',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.78rem', fontWeight: 600, color: '#64748b',
        textTransform: 'uppercase', letterSpacing: '0.04em',
        display: 'block', marginBottom: '0.4rem',
    };

    const btnPrimary: React.CSSProperties = {
        backgroundColor: 'var(--primary)', color: 'white', padding: '0.7rem 1.5rem',
        borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem',
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer'
    };

    const btnWarning: React.CSSProperties = {
        ...btnPrimary, backgroundColor: '#f59e0b', color: '#fff'
    };

    const btnDanger: React.CSSProperties = {
        ...btnPrimary, backgroundColor: 'var(--danger)', padding: '0.4rem 0.8rem'
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)'
    };

    // ── Guided Add Tab ──
    const renderAddTab = () => {
        const instCampuses = typeof selectedInstId === 'number'
            ? campuses.filter(c => c.institutionId === selectedInstId)
            : [];
        // ONLY show departments for the selected campus, not all campuses in institution
        const campusDepts = selectedCampusId 
            ? departments.filter(d => d.campusId === selectedCampusId)
            : [];
        // ONLY show programs for the selected department
        const deptPrograms = selectedDeptId
            ? programs.filter(p => p.departmentId === selectedDeptId)
            : [];

        // A step is "done" if data exists for it
        const step1Done = institutions.length > 0;
        const step2Done = instCampuses.length > 0;
        const step3Done = campusDepts.length > 0;
        const stepDone: Record<number, boolean> = { 1: step1Done, 2: step2Done, 3: step3Done, 4: deptPrograms.length > 0 };

        const stepWrap = (step: 1 | 2 | 3 | 4): React.CSSProperties => ({
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1rem',
            overflow: 'hidden',
            border: activeStep === step
                ? '2px solid var(--primary)'
                : stepDone[step]
                    ? '1.5px solid #86efac'
                    : '1.5px solid var(--border-color)',
            boxShadow: activeStep === step ? '0 0 0 4px rgba(59,130,246,0.10)' : 'none',
            transition: 'box-shadow 0.25s, border-color 0.25s',
        });

        const stepHeader = (step: 1 | 2 | 3 | 4): React.CSSProperties => ({
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '0.95rem 1.4rem',
            backgroundColor: activeStep === step
                ? 'var(--primary)'
                : stepDone[step]
                    ? '#f0fdf4'
                    : '#f8f9fb',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        });

        const stepNumBadge = (step: 1 | 2 | 3 | 4) => (
            <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem',
                backgroundColor: activeStep === step ? 'rgba(255,255,255,0.25)' : stepDone[step] ? '#22c55e' : '#e5e7eb',
                color: activeStep === step ? '#fff' : stepDone[step] ? '#fff' : '#9ca3af',
            }}>
                {stepDone[step] && activeStep !== step ? <CheckCircle2 size={16} /> : step}
            </div>
        );

        const stepTitle = (title: string, sub: string, isActive: boolean, isDone: boolean) => (
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isActive ? '#fff' : isDone ? '#166534' : 'var(--text-primary)' }}>{title}</div>
                <div style={{ fontSize: '0.78rem', color: isActive ? 'rgba(255,255,255,0.75)' : '#94a3b8', marginTop: '1px' }}>{sub}</div>
            </div>
        );

        const feedbackBanner = (step: 1 | 2 | 3 | 4) => stepMsg[step] ? (
            <div style={{
                margin: '0 1.4rem 0.75rem',
                padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 500,
                backgroundColor: stepMsg[step]!.ok ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${stepMsg[step]!.ok ? '#bbf7d0' : '#fecaca'}`,
                color: stepMsg[step]!.ok ? '#166534' : '#b91c1c',
            }}>{stepMsg[step]!.text}</div>
        ) : null;

        return (
            <div className="card-animate">

                {/* ── Academic Year (global / auto-filled) ── */}
                <div style={{
                    ...cardStyle, marginBottom: '1.75rem',
                    border: '1.5px solid #bfdbfe',
                    backgroundColor: '#eff6ff',
                }}>
                    <h3 style={{ ...sectionTitleStyle, color: '#1d4ed8', marginBottom: '1rem' }}>
                        <Calendar size={18} /> Academic Year
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 400, color: '#3b82f6' }}>Common for all institutions — auto-filled from current date</span>
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                        <div>
                            <label style={{ ...labelStyle, color: '#1e40af' }}>Year Label</label>
                            <input
                                style={{ ...inputStyle, backgroundColor: '#fff', borderColor: '#93c5fd' }}
                                value={yearForm.year}
                                onChange={e => setYearForm({ ...yearForm, year: e.target.value })}
                                placeholder="e.g. 2025-2026"
                            />
                            <div style={{ fontSize: '0.72rem', color: '#3b82f6', marginTop: '0.3rem' }}>
                                Auto-calculated: {computeDefaultYear()} (today is {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
                            </div>
                        </div>
                        <div>
                            {yearSaved
                                ? <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 600, fontSize: '0.82rem' }}><CheckCircle2 size={16} /> Saved!</div>
                                : <button style={{ ...btnPrimary, backgroundColor: '#2563eb' }} onClick={() => {
                                    if (yearForm.year) {
                                        addAcademicYear(yearForm);
                                        setYearSaved(true);
                                        setTimeout(() => setYearSaved(false), 3000);
                                    }
                                }}><Plus size={15} /> Save Year</button>
                            }
                        </div>
                    </div>
                    {academicYears.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
                            {academicYears.map(y => (
                                <span key={y.id} style={{
                                    padding: '0.2rem 0.75rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 600,
                                    backgroundColor: '#f1f5f9',
                                    color: '#64748b',
                                    border: '1px solid #e2e8f0',
                                }}>
                                    {y.year}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* ══ STEP 1 — Institution ══ */}
                <div ref={step1Ref} style={stepWrap(1)}>
                    <div style={stepHeader(1)} onClick={() => advanceTo(1)}>
                        {stepNumBadge(1)}
                        {stepTitle('Institution', 'Create the top-level institution', activeStep === 1, step1Done)}
                        <Building2 size={18} style={{ color: activeStep === 1 ? 'rgba(255,255,255,0.6)' : '#94a3b8' }} />
                    </div>
                    {activeStep === 1 && (
                        <div style={{ padding: '1.25rem 1.4rem' }}>
                            {feedbackBanner(1)}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Institution Name</label>
                                    <input style={inputStyle} value={instForm.name} onChange={e => setInstForm({ ...instForm, name: e.target.value })} placeholder="e.g. RV College of Engineering" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Short Code</label>
                                    <input style={inputStyle} value={instForm.code} onChange={e => setInstForm({ ...instForm, code: e.target.value })} placeholder="e.g. RVCE" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Address</label>
                                    <input style={inputStyle} value={instForm.address} onChange={e => setInstForm({ ...instForm, address: e.target.value })} placeholder="City, State" />
                                </div>
                            </div>

                            {/* Existing institutions */}
                            {institutions.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Or continue with existing institution</label>
                                    <select style={inputStyle} value={typeof selectedInstId === 'number' ? selectedInstId : ''} onChange={e => { setSelectedInstId(Number(e.target.value)); advanceTo(2); }}>
                                        <option value="">— Pick an institution —</option>
                                        {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <button style={btnPrimary} onClick={async () => {
                                if (!instForm.name || !instForm.code) { showMsg(1, false, 'Name and Code are required.'); return; }
                                const savedName = instForm.name;
                                try {
                                    const created = await addInstitution(instForm);
                                    setInstForm({ name: '', code: '', address: '' });
                                    if (created) {
                                        setSelectedInstId(created.id);
                                        showMsg(1, true, `Institution "${savedName}" added! Proceed to add a campus.`);
                                        advanceTo(2);
                                    } else {
                                        showMsg(1, false, 'Failed to create institution. Please try again.');
                                    }
                                } catch (err: any) {
                                    showMsg(1, false, err?.message || 'Something went wrong while adding institution.');
                                }
                            }}>
                                <Plus size={15} /> Save Institution &amp; Continue →
                            </button>
                        </div>
                    )}
                </div>

                {/* ══ STEP 2 — Campus ══ */}
                <div ref={step2Ref} style={stepWrap(2)}>
                    <div style={stepHeader(2)} onClick={() => advanceTo(2)}>
                        {stepNumBadge(2)}
                        {stepTitle(
                            'Campus',
                            typeof selectedInstId === 'number' && institutions.find(i => i.id === selectedInstId)
                                ? `↳ ${institutions.find(i => i.id === selectedInstId)!.name}`
                                : 'Add a campus to the selected institution',
                            activeStep === 2, step2Done
                        )}
                        <School size={18} style={{ color: activeStep === 2 ? 'rgba(255,255,255,0.6)' : '#94a3b8' }} />
                    </div>
                    {activeStep === 2 && (
                        <div style={{ padding: '1.25rem 1.4rem' }}>
                            {feedbackBanner(2)}

                            {/* Breadcrumb — shows auto-populated institution */}
                            {typeof selectedInstId === 'number' && institutions.find(i => i.id === selectedInstId) ? (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.6rem 1rem', marginBottom: '1.1rem',
                                    backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                                    borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
                                }}>
                                    <Building2 size={14} color="#2563eb" />
                                    <span style={{ fontWeight: 700, color: '#1d4ed8' }}>{institutions.find(i => i.id === selectedInstId)!.name}</span>
                                    <span style={{ color: '#93c5fd' }}>•</span>
                                    <span style={{ color: '#3b82f6' }}>{institutions.find(i => i.id === selectedInstId)!.code}</span>
                                    <button onClick={() => advanceTo(1)} style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Change</button>
                                </div>
                            ) : (
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Select Institution First</label>
                                    <select style={{ ...inputStyle, borderColor: '#f87171' }} value={typeof selectedInstId === 'number' ? selectedInstId : ''} onChange={e => setSelectedInstId(Number(e.target.value) || '')}>
                                        <option value="">— Select Institution —</option>
                                        {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Campus Name</label>
                                    <input style={inputStyle} value={campForm.name} onChange={e => setCampForm({ ...campForm, name: e.target.value })} placeholder="e.g. Main Campus" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Location</label>
                                    <input style={inputStyle} value={campForm.location} onChange={e => setCampForm({ ...campForm, location: e.target.value })} placeholder="City/Area" />
                                </div>
                            </div>
                            {instCampuses.length > 0 && (
                                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {instCampuses.map(c => (
                                        <span key={c.id} style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.78rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 500 }}>
                                            ✓ {c.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <button style={{ ...btnPrimary, opacity: selectedInstId && typeof selectedInstId === 'number' ? 1 : 0.5 }}
                                disabled={!selectedInstId || selectedInstId === 'NEW'}
                                onClick={async () => {
                                    if (!campForm.name) { showMsg(2, false, 'Campus name is required.'); return; }
                                    if (!selectedInstId || selectedInstId === 'NEW') { showMsg(2, false, 'Select an institution first.'); return; }
                                    const savedName = campForm.name;
                                    const created = await addCampus({ ...campForm, institutionId: selectedInstId as number });
                                    setCampForm({ name: '', location: '' });
                                    if (created) setSelectedCampusId(created.id);
                                    showMsg(2, true, `Campus "${savedName}" added! Proceed to add a department.`);
                                    advanceTo(3);
                                }}>
                                <Plus size={15} /> Save Campus &amp; Continue →
                            </button>
                        </div>
                    )}
                </div>

                {/* ══ STEP 3 — Department ══ */}
                <div ref={step3Ref} style={stepWrap(3)}>
                    <div style={stepHeader(3)} onClick={() => advanceTo(3)}>
                        {stepNumBadge(3)}
                        {stepTitle(
                            'Department',
                            selectedCampusId && campuses.find(c => c.id === selectedCampusId)
                                ? `↳ ${campuses.find(c => c.id === selectedCampusId)!.name}`
                                : 'Add a department under a campus',
                            activeStep === 3, step3Done
                        )}
                        <GraduationCap size={18} style={{ color: activeStep === 3 ? 'rgba(255,255,255,0.6)' : '#94a3b8' }} />
                    </div>
                    {activeStep === 3 && (
                        <div style={{ padding: '1.25rem 1.4rem' }}>
                            {feedbackBanner(3)}

                            {/* Breadcrumb — Institution → Campus */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap',
                                padding: '0.6rem 1rem', marginBottom: '1.1rem',
                                backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
                            }}>
                                <Building2 size={13} color="#7c3aed" />
                                <span style={{ fontWeight: 600, color: '#5b21b6' }}>
                                    {typeof selectedInstId === 'number' ? (institutions.find(i => i.id === selectedInstId)?.name || '—') : '—'}
                                </span>
                                <span style={{ color: '#c4b5fd' }}>→</span>
                                <School size={13} color="#7c3aed" />
                                {selectedCampusId && campuses.find(c => c.id === selectedCampusId) ? (
                                    <span style={{ fontWeight: 600, color: '#5b21b6' }}>{campuses.find(c => c.id === selectedCampusId)!.name}</span>
                                ) : (
                                    <select style={{ ...inputStyle, width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.8rem', borderColor: '#a78bfa' }} value={selectedCampusId} onChange={e => { setSelectedCampusId(Number(e.target.value) || ''); setSelectedDeptId(''); }}>
                                        <option value="">— pick campus —</option>
                                        {instCampuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                )}
                                {selectedCampusId ? <button onClick={() => { setSelectedCampusId(''); setSelectedDeptId(''); }} style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#7c3aed', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Change campus</button> : null}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Department Name</label>
                                    <input style={inputStyle} value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} placeholder="e.g. Computer Science" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Head of Department (HOD)</label>
                                    <input style={inputStyle} value={deptForm.hod} onChange={e => setDeptForm({ ...deptForm, hod: e.target.value })} placeholder="HOD Name" />
                                </div>
                            </div>
                            {campusDepts.length > 0 && (
                                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {campusDepts.map(d => (
                                        <span key={d.id} style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.78rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 500 }}>
                                            ✓ {d.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <button style={{ ...btnPrimary, opacity: selectedCampusId ? 1 : 0.5 }}
                                disabled={!selectedCampusId}
                                onClick={async () => {
                                    if (!deptForm.name) { showMsg(3, false, 'Department name is required.'); return; }
                                    if (!selectedCampusId) { showMsg(3, false, 'Select a campus first.'); return; }
                                    const savedName = deptForm.name;
                                    const created = await addDepartment({ ...deptForm, campusId: selectedCampusId as number });
                                    setDeptForm({ name: '', hod: '' });
                                    if (created) setSelectedDeptId(created.id);
                                    showMsg(3, true, `Department "${savedName}" added! Proceed to add a program.`);
                                    advanceTo(4);
                                }}>
                                <Plus size={15} /> Save Department &amp; Continue →
                            </button>
                        </div>
                    )}
                </div>

                {/* ══ STEP 4 — Program / Branch ══ */}
                <div ref={step4Ref} style={stepWrap(4)}>
                    <div style={stepHeader(4)} onClick={() => advanceTo(4)}>
                        {stepNumBadge(4)}
                        {stepTitle(
                            'Program / Branch',
                            selectedDeptId && departments.find(d => d.id === selectedDeptId)
                                ? `↳ ${departments.find(d => d.id === selectedDeptId)!.name}`
                                : 'Add a program with course type, entry type and admission mode',
                            activeStep === 4, stepDone[4]
                        )}
                        <BookOpen size={18} style={{ color: activeStep === 4 ? 'rgba(255,255,255,0.6)' : '#94a3b8' }} />
                    </div>
                    {activeStep === 4 && (() => {
                        const quotaSum = progForm.quotaKCET + progForm.quotaCOMEDK + progForm.quotaMgmt;
                        const quotaValid = quotaSum === progForm.totalIntake;
                        const quotaOver = quotaSum > progForm.totalIntake;
                        const quotaRemaining = progForm.totalIntake - quotaSum;
                        return (
                        <div style={{ padding: '1.25rem 1.4rem' }}>
                            {feedbackBanner(4)}

                            {/* Breadcrumb — Institution → Campus → Department */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap',
                                padding: '0.6rem 1rem', marginBottom: '1.1rem',
                                backgroundColor: '#fefce8', border: '1px solid #fde047',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
                            }}>
                                <Building2 size={13} color="#a16207" />
                                <span style={{ fontWeight: 600, color: '#713f12' }}>
                                    {typeof selectedInstId === 'number' ? (institutions.find(i => i.id === selectedInstId)?.name || '—') : '—'}
                                </span>
                                <span style={{ color: '#fbbf24' }}>→</span>
                                <School size={13} color="#a16207" />
                                <span style={{ fontWeight: 600, color: '#713f12' }}>
                                    {selectedCampusId ? (campuses.find(c => c.id === selectedCampusId)?.name || '—') : '—'}
                                </span>
                                <span style={{ color: '#fbbf24' }}>→</span>
                                <GraduationCap size={13} color="#a16207" />
                                {selectedDeptId && departments.find(d => d.id === selectedDeptId) ? (
                                    <span style={{ fontWeight: 600, color: '#713f12' }}>{departments.find(d => d.id === selectedDeptId)!.name}</span>
                                ) : (
                                    <select style={{ ...inputStyle, width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.8rem', borderColor: '#fbbf24' }} value={selectedDeptId} onChange={e => setSelectedDeptId(Number(e.target.value) || '')}>
                                        <option value="">— pick department —</option>
                                        {campusDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                )}
                                {selectedDeptId ? <button onClick={() => setSelectedDeptId('')} style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#a16207', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Change dept</button> : null}
                            </div>

                            {/* Program name */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Program / Branch Name</label>
                                <input style={inputStyle} value={progForm.name} onChange={e => setProgForm({ ...progForm, name: e.target.value })} placeholder="e.g. B.Tech Computer Science" />
                            </div>

                            {/* Toggle button groups */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                <ToggleGroup
                                    label="Course Type"
                                    options={[{ label: 'UG', value: 'UG' }, { label: 'PG', value: 'PG' }]}
                                    value={progForm.courseType}
                                    onChange={v => setProgForm({ ...progForm, courseType: v as CourseType })}
                                />
                                <ToggleGroup
                                    label="Entry Type"
                                    options={[{ label: 'Regular', value: 'REGULAR' }, { label: 'Lateral', value: 'LATERAL' }]}
                                    value={progForm.entryType}
                                    onChange={v => setProgForm({ ...progForm, entryType: v as EntryType })}
                                />
                                <ToggleGroup
                                    label="Admission Mode"
                                    options={[{ label: 'Government', value: 'GOVERNMENT' }, { label: 'Management', value: 'MANAGEMENT' }]}
                                    value={progForm.admissionMode}
                                    onChange={v => setProgForm({ ...progForm, admissionMode: v as AdmissionMode })}
                                />
                            </div>

                            {/* ── Intake & Quota Builder ── */}
                            <div style={{
                                border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                                overflow: 'hidden', marginBottom: '1.25rem',
                            }}>
                                {/* Total Intake header row */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.75rem 1.1rem', backgroundColor: '#f8f9fb',
                                    borderBottom: '1.5px solid var(--border-color)',
                                }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Seat Distribution</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <label style={{ ...labelStyle, margin: 0 }}>Total Intake</label>
                                        <input type="number" min={1}
                                            style={{ ...inputStyle, width: '80px', textAlign: 'center', fontWeight: 700, fontSize: '1rem', padding: '0.4rem 0.5rem', borderColor: 'var(--primary)' }}
                                            value={progForm.totalIntake}
                                            onChange={e => setProgForm({ ...progForm, totalIntake: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                {/* Quota inputs */}
                                <div style={{ padding: '1rem 1.1rem' }}>
                                    <label style={{ ...labelStyle, marginBottom: '0.7rem' }}>Quota-wise Seat Allocation</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                                        {([
                                            { key: 'quotaKCET', label: 'KCET', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
                                            { key: 'quotaCOMEDK', label: 'COMEDK', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
                                            { key: 'quotaMgmt', label: 'Management', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
                                        ] as const).map(({ key, label, color, bg, border }) => (
                                            <div key={key} style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '8px', padding: '0.75rem' }}>
                                                <label style={{ ...labelStyle, color, marginBottom: '0.4rem' }}>{label}</label>
                                                <input type="number" min={0} max={progForm.totalIntake}
                                                    style={{ ...inputStyle, backgroundColor: '#fff', borderColor: border, textAlign: 'center', fontWeight: 700, color }}
                                                    value={(progForm as any)[key]}
                                                    onChange={e => setProgForm({ ...progForm, [key]: parseInt(e.target.value) || 0 })}
                                                />
                                                <div style={{ fontSize: '0.7rem', color, marginTop: '0.3rem', textAlign: 'center' }}>
                                                    {progForm.totalIntake > 0 ? Math.round(((progForm as any)[key] / progForm.totalIntake) * 100) : 0}% of intake
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Live validation bar */}
                                    <div style={{
                                        padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)',
                                        backgroundColor: quotaValid ? '#f0fdf4' : quotaOver ? '#fef2f2' : '#fffbeb',
                                        border: `1px solid ${quotaValid ? '#bbf7d0' : quotaOver ? '#fecaca' : '#fde047'}`,
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                                                <span style={{ color: quotaValid ? '#166534' : quotaOver ? '#b91c1c' : '#92400e' }}>
                                                    {quotaValid ? '✓ Quota = Intake' : quotaOver ? '✕ Quota exceeds intake!' : `${quotaRemaining} seats unassigned`}
                                                </span>
                                                <span style={{ color: '#64748b' }}>{quotaSum} / {progForm.totalIntake}</span>
                                            </div>
                                            <div style={{ height: '6px', borderRadius: '99px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                                                <div style={{
                                                    display: 'flex', height: '100%',
                                                    width: `${Math.min(100, progForm.totalIntake > 0 ? (quotaSum / progForm.totalIntake) * 100 : 0)}%`,
                                                    transition: 'width 0.3s ease',
                                                }}>
                                                    {[progForm.quotaKCET, progForm.quotaCOMEDK, progForm.quotaMgmt].map((v, i) => (
                                                        <div key={i} style={{
                                                            flex: v, height: '100%',
                                                            backgroundColor: ['#1d4ed8', '#059669', '#7c3aed'][i],
                                                        }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            {/* Existing programs badge list — only for selected department */}
                            {deptPrograms.length > 0 && (
                                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {deptPrograms.map(p => (
                                        <span key={p.id} style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.78rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 500 }}>
                                            ✓ {p.name} ({p.courseType}/{p.entryType})
                                        </span>
                                    ))}
                                </div>
                            )}

                            <button
                                style={{ ...btnPrimary, opacity: (selectedDeptId && quotaValid) ? 1 : 0.5 }}
                                disabled={!selectedDeptId}
                                onClick={() => {
                                    if (!progForm.name) { showMsg(4, false, 'Program name is required.'); return; }
                                    if (!selectedDeptId) { showMsg(4, false, 'Select a department first.'); return; }
                                    if (!quotaValid) { showMsg(4, false, `Quota mismatch: ${quotaSum} assigned ≠ ${progForm.totalIntake} intake. Please fix before saving.`); return; }
                                    const quotas = [
                                        { quotaType: 'KCET', totalSeats: progForm.quotaKCET },
                                        { quotaType: 'COMEDK', totalSeats: progForm.quotaCOMEDK },
                                        { quotaType: 'MANAGEMENT', totalSeats: progForm.quotaMgmt },
                                    ].filter(q => q.totalSeats > 0);
                                    addProgram({ ...progForm, departmentId: selectedDeptId as number, quotas });
                                    setProgForm({ ...progForm, name: '', quotaKCET: 0, quotaCOMEDK: 0, quotaMgmt: 0 });
                                    showMsg(4, true, `Program "${progForm.name}" + quotas saved successfully!`);
                                }}>
                                <Plus size={15} /> Save Program &amp; Quotas
                            </button>
                        </div>
                        );
                    })()}
                </div>
            </div>
        );
    };

    const renderViewTab = () => {
        const inst = institutions.find(i => i.id === selectedInstId);
        if (!inst && institutions.length > 0) setSelectedInstId(institutions[0].id);

        return (
            <div className="card-animate">
                <div style={filterBarStyle}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>View Institution:</span>
                    <select style={{ ...inputStyle, width: '300px' }} value={selectedInstId.toString()} onChange={(e) => setSelectedInstId(Number(e.target.value) || '')}>
                        <option value="">-- Select Institution --</option>
                        {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                </div>

                {inst ? (
                    <div>
                        <div style={{ ...cardStyle, backgroundColor: '#f0f4ff', borderColor: '#dbeafe' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem' }}>{inst.name}</h2>
                            <p style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>Code:</strong> {inst.code}</p>
                            <p style={{ color: '#475569', fontSize: '0.9rem' }}><strong>Address:</strong> {inst.address}</p>
                        </div>

                        {campuses.filter(c => c.institutionId === inst.id).map(camp => (
                            <div key={camp.id} style={{ ...cardStyle, marginLeft: '1rem', borderLeft: '4px solid var(--primary)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><School size={18} color="var(--primary)" /> {camp.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>({camp.location})</span></h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {departments.filter(d => d.campusId === camp.id).map(dept => (
                                        <div key={dept.id} style={{ backgroundColor: '#fafbfc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '0.75rem' }}><GraduationCap size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {dept.name} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#64748b' }}>(HOD: {dept.hod})</span></h4>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
                                                {programs.filter(p => p.departmentId === dept.id).map(prog => (
                                                    <div key={prog.id} style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{prog.name}</div>
                                                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                                                            Type: {prog.courseType} | Entry: {prog.entryType}<br />
                                                            Mode: {prog.admissionMode} | Intake: <strong>{prog.totalIntake}</strong>
                                                        </div>
                                                    </div>
                                                ))}
                                                {programs.filter(p => p.departmentId === dept.id).length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No programs added.</span>}
                                            </div>
                                        </div>
                                    ))}
                                    {departments.filter(d => d.campusId === camp.id).length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1rem' }}>No departments added to this campus.</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Select an institution to view its full details.</div>
                )}
            </div>
        );
    };

    const renderUpdateTab = () => {
        const inst = institutions.find(i => i.id === selectedInstId);

        return (
            <div className="card-animate">
                <div style={filterBarStyle}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Institution:</span>
                    <select style={{ ...inputStyle, width: '300px' }} value={selectedInstId.toString()} onChange={(e) => { setSelectedInstId(Number(e.target.value) || ''); setUpdateTarget({ type: 'none', id: '' }); }}>
                        <option value="">-- Select --</option>
                        {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                </div>

                {inst && (
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {/* Left sidebar with tree */}
                        <div style={{ width: '300px', flexShrink: 0, ...cardStyle, padding: '1rem' }}>
                            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 700 }}>Select Item to Update</h3>

                            <div
                                style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '4px', backgroundColor: updateTarget.type === 'inst' ? '#eff6ff' : 'transparent', fontWeight: updateTarget.type === 'inst' ? 600 : 400, color: updateTarget.type === 'inst' ? 'var(--primary)' : 'inherit' }}
                                onClick={() => { setUpdateTarget({ type: 'inst', id: inst.id }); setUpdInst(inst); }}
                            >
                                <Building2 size={14} style={{ display: 'inline', marginRight: '0.4rem' }} /> {inst.name}
                            </div>

                            {campuses.filter(c => c.institutionId === inst.id).map(camp => (
                                <React.Fragment key={camp.id}>
                                    <div
                                        style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '4px', paddingLeft: '1.5rem', backgroundColor: updateTarget.id === camp.id ? '#eff6ff' : 'transparent', fontWeight: updateTarget.id === camp.id ? 600 : 400, color: updateTarget.id === camp.id ? 'var(--primary)' : 'inherit' }}
                                        onClick={() => { setUpdateTarget({ type: 'camp', id: camp.id }); setUpdCamp(camp); }}
                                    >
                                        <School size={14} style={{ display: 'inline', marginRight: '0.4rem' }} /> {camp.name}
                                    </div>

                                    {departments.filter(d => d.campusId === camp.id).map(dept => (
                                        <React.Fragment key={dept.id}>
                                            <div
                                                style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '4px', paddingLeft: '2.5rem', backgroundColor: updateTarget.id === dept.id ? '#eff6ff' : 'transparent', fontWeight: updateTarget.id === dept.id ? 600 : 400, color: updateTarget.id === dept.id ? 'var(--primary)' : 'inherit' }}
                                                onClick={() => { setUpdateTarget({ type: 'dept', id: dept.id }); setUpdDept(dept); }}
                                            >
                                                <GraduationCap size={14} style={{ display: 'inline', marginRight: '0.4rem' }} /> {dept.name}
                                            </div>

                                            {programs.filter(p => p.departmentId === dept.id).map(prog => (
                                                <div
                                                    key={prog.id}
                                                    style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '4px', paddingLeft: '3.5rem', backgroundColor: updateTarget.id === prog.id ? '#eff6ff' : 'transparent', fontSize: '0.85rem', fontWeight: updateTarget.id === prog.id ? 600 : 400, color: updateTarget.id === prog.id ? 'var(--primary)' : 'inherit' }}
                                                    onClick={() => { setUpdateTarget({ type: 'prog', id: prog.id }); setUpdProg(prog); }}
                                                >
                                                    <BookOpen size={13} style={{ display: 'inline', marginRight: '0.4rem' }} /> {prog.name}
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Right content area with form */}
                        <div style={{ flexGrow: 1, ...cardStyle }}>
                            {updateTarget.type === 'none' && <p style={{ color: 'var(--text-muted)' }}>Select an item from the left pane to edit its details.</p>}

                            {updateTarget.type === 'inst' && (
                                <div>
                                    <h3 style={sectionTitleStyle}>Update Institution</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Name</label><input style={inputStyle} value={updInst.name || ''} onChange={e => setUpdInst({ ...updInst, name: e.target.value })} /></div>
                                        <div><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Code</label><input style={inputStyle} value={updInst.code || ''} onChange={e => setUpdInst({ ...updInst, code: e.target.value })} /></div>
                                        <div><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Address</label><input style={inputStyle} value={updInst.address || ''} onChange={e => setUpdInst({ ...updInst, address: e.target.value })} /></div>
                                        <div><button style={btnWarning} onClick={() => { updateInstitution(updateTarget.id as number, updInst); alert('Updated Successfully'); }}><Edit3 size={16} /> Save Changes</button></div>
                                    </div>
                                </div>
                            )}

                            {updateTarget.type === 'camp' && (
                                <div>
                                    <h3 style={sectionTitleStyle}>Update Campus</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Name</label><input style={inputStyle} value={updCamp.name || ''} onChange={e => setUpdCamp({ ...updCamp, name: e.target.value })} /></div>
                                        <div><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Location</label><input style={inputStyle} value={updCamp.location || ''} onChange={e => setUpdCamp({ ...updCamp, location: e.target.value })} /></div>
                                        <div><button style={btnWarning} onClick={() => { updateCampus(updateTarget.id as number, updCamp); alert('Updated Successfully'); }}><Edit3 size={16} /> Save Changes</button></div>
                                    </div>
                                </div>
                            )}

                            {updateTarget.type === 'dept' && (
                                <div>
                                    <h3 style={sectionTitleStyle}>Update Department</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Name</label><input style={inputStyle} value={updDept.name || ''} onChange={e => setUpdDept({ ...updDept, name: e.target.value })} /></div>
                                        <div><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>HOD</label><input style={inputStyle} value={updDept.hod || ''} onChange={e => setUpdDept({ ...updDept, hod: e.target.value })} /></div>
                                        <div><button style={btnWarning} onClick={() => { updateDepartment(updateTarget.id as number, updDept); alert('Updated Successfully'); }}><Edit3 size={16} /> Save Changes</button></div>
                                    </div>
                                </div>
                            )}

                            {updateTarget.type === 'prog' && (
                                <div>
                                    <h3 style={sectionTitleStyle}>Update Program</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Name</label><input style={inputStyle} value={updProg.name || ''} onChange={e => setUpdProg({ ...updProg, name: e.target.value })} /></div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Course Type</label>
                                            <select style={inputStyle} value={updProg.courseType || ''} onChange={e => setUpdProg({ ...updProg, courseType: e.target.value as CourseType })}>
                                                <option value="UG">UG</option><option value="PG">PG</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Entry Type</label>
                                            <select style={inputStyle} value={updProg.entryType || ''} onChange={e => setUpdProg({ ...updProg, entryType: e.target.value as EntryType })}>
                                                <option value="Regular">Regular</option><option value="Lateral">Lateral</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Admission Mode</label>
                                            <select style={inputStyle} value={updProg.admissionMode || ''} onChange={e => setUpdProg({ ...updProg, admissionMode: e.target.value as AdmissionMode })}>
                                                <option value="Government">Government</option><option value="Management">Management</option>
                                            </select>
                                        </div>
                                        <div><label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Total Intake</label><input type="number" style={inputStyle} value={updProg.totalIntake || 0} onChange={e => setUpdProg({ ...updProg, totalIntake: parseInt(e.target.value) || 0 })} /></div>
                                        <div style={{ gridColumn: 'span 2' }}><button style={btnWarning} onClick={() => { updateProgram(updateTarget.id as number, updProg); alert('Updated Successfully'); }}><Edit3 size={16} /> Save Changes</button></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderDeleteTab = () => {
        const inst = institutions.find(i => i.id === selectedInstId);

        return (
            <div className="card-animate">
                <div style={filterBarStyle}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Institution:</span>
                    <select style={{ ...inputStyle, width: '300px' }} value={selectedInstId.toString()} onChange={(e) => setSelectedInstId(Number(e.target.value) || '')}>
                        <option value="">-- Select --</option>
                        {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                </div>

                {inst && (
                    <div style={{ ...cardStyle, borderLeft: '4px solid var(--danger)' }}>
                        <h3 style={{ ...sectionTitleStyle, color: 'var(--danger)' }}>Delete Resources for {inst.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Warning: Deleting resources will remove them permanently. Be careful when deleting items that may have dependencies.</p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#fff1f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3', marginBottom: '1rem' }}>
                            <div>
                                <strong style={{ color: '#be123c', display: 'block', fontSize: '1rem' }}>{inst.name} (Institution)</strong>
                                <span style={{ fontSize: '0.8rem', color: '#9f1239' }}>{inst.code}</span>
                            </div>
                            <button style={btnDanger} onClick={() => { if (confirm('Are you sure you want to delete this Entire Institution?')) { deleteInstitution(inst.id); setSelectedInstId('NEW'); } }}><Trash2 size={16} /> Delete</button>
                        </div>

                        {campuses.filter(c => c.institutionId === inst.id).map(camp => (
                            <div key={camp.id} style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem', backgroundColor: '#fdf2f8', borderRadius: 'var(--radius-md)', border: '1px solid #fbcfe8', marginBottom: '0.5rem' }}>
                                    <div style={{ fontWeight: 600, color: '#9d174d' }}><School size={14} style={{ display: 'inline' }} /> {camp.name} (Campus)</div>
                                    <button style={btnDanger} onClick={() => { if (confirm('Delete Campus?')) deleteCampus(camp.id); }}><Trash2 size={14} /> Delete</button>
                                </div>

                                {departments.filter(d => d.campusId === camp.id).map(dept => (
                                    <div key={dept.id} style={{ marginLeft: '2rem', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1rem', backgroundColor: '#faf5ff', borderRadius: 'var(--radius-md)', border: '1px solid #e9d5ff', marginBottom: '0.5rem' }}>
                                            <div style={{ fontWeight: 500, color: '#6b21a8', fontSize: '0.9rem' }}><GraduationCap size={13} style={{ display: 'inline' }} /> {dept.name} (Dept)</div>
                                            <button style={btnDanger} onClick={() => { if (confirm('Delete Department?')) deleteDepartment(dept.id); }}><Trash2 size={14} /> Delete</button>
                                        </div>

                                        {programs.filter(p => p.departmentId === dept.id).map(prog => (
                                            <div key={prog.id} style={{ marginLeft: '2rem', marginBottom: '0.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                                                    <div style={{ fontSize: '0.85rem', color: '#334155' }}><BookOpen size={12} style={{ display: 'inline' }} /> {prog.name} (Program)</div>
                                                    <button style={{ ...btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => { if (confirm('Delete Program?')) deleteProgram(prog.id); }}><Trash2 size={12} /> Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={22} color="var(--primary)" /> Master Setup
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive management of Institutions, Campuses, Departments, and Programs.</p>
            </div>

            {/* Top Level Action Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => handleTabChange('add')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 1.2rem' }}>
                    <Plus size={15} /> Add Data
                </button>
                <button className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`} onClick={() => handleTabChange('view')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 1.2rem' }}>
                    <Eye size={15} /> View Config
                </button>
                <button className={`tab-btn ${activeTab === 'update' ? 'active' : ''}`} onClick={() => handleTabChange('update')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 1.2rem' }}>
                    <Edit3 size={15} /> Update Data
                </button>
                <button className={`tab-btn ${activeTab === 'delete' ? 'active' : ''}`} onClick={() => handleTabChange('delete')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 1.2rem' }}>
                    <Trash2 size={15} /> Delete Data
                </button>
            </div>

            {activeTab === 'add' && renderAddTab()}
            {activeTab === 'view' && renderViewTab()}
            {activeTab === 'update' && renderUpdateTab()}
            {activeTab === 'delete' && renderDeleteTab()}
        </div>
    );
};

export default MasterSetup;
