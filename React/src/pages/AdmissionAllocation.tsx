import React, { useState } from 'react';
import { UserPlus, ShieldCheck, AlertTriangle, CheckCircle, ArrowRight, Ban } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AdmissionAllocation: React.FC = () => {
    const { applicants, programs, quotas, allocateSeat, institutions, campuses, departments } = useAppContext();
    const [selectedApplicantId, setSelectedApplicantId] = useState<number | ''>('');
    const [selectedProgramId, setSelectedProgramId] = useState<number | ''>('');
    const [selectedQuotaId, setSelectedQuotaId] = useState<number | ''>('');
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [mode, setMode] = useState<'government' | 'management'>('government');

    const eligibleApplicants = applicants.filter(a => !a.allocatedProgramId);
    const selectedApplicant = applicants.find(a => a.id === selectedApplicantId);
    const selectedProgram = programs.find(p => p.id === selectedProgramId);
    const programQuotas = quotas.filter(q => q.programId === selectedProgramId);

    const getHierarchyLabel = (programId: number) => {
        const prog = programs.find(p => p.id === programId);
        if (!prog) return 'Unknown program';
        const dept = departments.find(d => d.id === prog.departmentId);
        const camp = campuses.find(c => c.id === dept?.campusId);
        const inst = institutions.find(i => i.id === camp?.institutionId);
        const parts = [inst?.name, camp?.name, dept?.name, prog.name].filter(Boolean);
        return parts.join(' / ');
    };

    const handleAllocate = async () => {
        if (!selectedApplicantId || !selectedProgramId || !selectedQuotaId) return;
        const qName = quotas.find(q => q.id === selectedQuotaId)?.name || '';
        const res = await allocateSeat(selectedApplicantId, selectedProgramId, qName);
        setResult(res);
        if (res.success) {
            setSelectedApplicantId('');
            setSelectedProgramId('');
            setSelectedQuotaId('');
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.7rem 0.85rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        fontSize: '0.875rem',
        backgroundColor: '#fafbfc',
    };

    const stepBadge = (num: number, active: boolean) => (
        <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: active ? 'var(--primary)' : '#e5e7eb',
            color: active ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.78rem', fontWeight: 700,
        }}>{num}</div>
    );

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserPlus size={22} color="var(--primary)" /> Admission Allocation
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Allocate seats to applicants based on quota availability.</p>
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
                    {result.success ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    {result.message}
                    <button onClick={() => setResult(null)} style={{ marginLeft: 'auto', padding: '2px', color: 'inherit', opacity: 0.6 }}>✕</button>
                </div>
            )}

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => { setMode('government'); setSelectedQuotaId(''); }}
                    style={{
                        padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)',
                        fontWeight: 600, fontSize: '0.85rem',
                        backgroundColor: mode === 'government' ? 'var(--primary)' : 'white',
                        color: mode === 'government' ? 'white' : 'var(--text-main)',
                        border: `1px solid ${mode === 'government' ? 'var(--primary)' : 'var(--border-color)'}`,
                    }}
                >Government Flow</button>
                <button
                    onClick={() => { setMode('management'); setSelectedQuotaId(''); }}
                    style={{
                        padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)',
                        fontWeight: 600, fontSize: '0.85rem',
                        backgroundColor: mode === 'management' ? '#7c3aed' : 'white',
                        color: mode === 'management' ? 'white' : 'var(--text-main)',
                        border: `1px solid ${mode === 'management' ? '#7c3aed' : 'var(--border-color)'}`,
                    }}
                >Management Flow</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                {/* Left: Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Step 1 */}
                    <div style={cardStyle} className="card-animate">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                            {stepBadge(1, true)}
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Select Applicant</h3>
                        </div>
                        <select style={inputStyle} value={selectedApplicantId} onChange={e => setSelectedApplicantId(Number(e.target.value) || '')}>
                            <option value="">Choose an applicant...</option>
                            {eligibleApplicants.map(a => (
                                <option key={a.id} value={a.id}>{a.name} ({a.category}) — {a.marks}% — {a.quotaType}</option>
                            ))}
                        </select>
                        {eligibleApplicants.length === 0 && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.5rem' }}>No unallocated applicants available.</p>
                        )}
                        {selectedApplicant && mode === 'government' && selectedApplicant.allotmentNumber && (
                            <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#1e40af' }}>
                                <strong>Allotment Number:</strong> {selectedApplicant.allotmentNumber}
                            </div>
                        )}
                    </div>

                    {/* Step 2 */}
                    <div style={{ ...cardStyle, opacity: selectedApplicantId ? 1 : 0.5, pointerEvents: selectedApplicantId ? 'auto' : 'none' }} className="card-animate">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                            {stepBadge(2, !!selectedApplicantId)}
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Choose Program & Quota</h3>
                        </div>
                        <select
                            style={{ ...inputStyle, marginBottom: '0.75rem' }}
                            value={selectedProgramId}
                            onChange={e => { setSelectedProgramId(Number(e.target.value) || ''); setSelectedQuotaId(''); }}
                            disabled={programs.length === 0}
                        >
                            <option value="">Select Program (Inst / Campus / Dept)...</option>
                            {programs.map(p => (
                                <option key={p.id} value={p.id}>{getHierarchyLabel(p.id)} (Intake: {p.totalIntake})</option>
                            ))}
                        </select>
                        {programs.length === 0 && (
                            <div style={{ marginBottom: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#fef9c3', border: '1px solid #fde68a', color: '#854d0e', fontSize: '0.82rem' }}>
                                No programs found. Please add programs and quotas in Seat Matrix / Master Setup first.
                            </div>
                        )}

                        {selectedProgram && programQuotas.length === 0 && (
                            <div style={{ marginBottom: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#1f2937', fontSize: '0.82rem' }}>
                                No quotas configured for this program. Set KCET/COMEDK/Management seats in Seat Matrix, then return to allocate.
                            </div>
                        )}

                        {selectedProgram && programQuotas.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                {programQuotas
                                    .filter(q => mode === 'management' ? q.name === 'MANAGEMENT' : q.name !== 'MANAGEMENT')
                                    .map(quota => {
                                        const remaining = quota.totalSeats - quota.filledSeats;
                                        const isFull = remaining <= 0;
                                        const isSelected = selectedQuotaId === quota.id;
                                        return (
                                            <div
                                                key={quota.id}
                                                onClick={() => !isFull && setSelectedQuotaId(quota.id)}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: `2px solid ${isSelected ? 'var(--primary)' : isFull ? '#fecaca' : 'var(--border-color)'}`,
                                                    backgroundColor: isSelected ? 'rgba(40, 167, 69, 0.06)' : isFull ? '#fef2f2' : 'white',
                                                    cursor: isFull ? 'not-allowed' : 'pointer',
                                                    opacity: isFull ? 0.7 : 1,
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{quota.name}</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: isFull ? 'var(--danger)' : 'var(--primary)' }}>
                                                    {remaining} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ {quota.totalSeats}</span>
                                                </div>
                                                <div style={{ fontSize: '0.68rem', color: isFull ? 'var(--danger)' : 'var(--text-muted)', marginTop: '0.15rem' }}>
                                                    {isFull ? '✕ Quota Full' : 'seats remaining'}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}

                        {/* Quota full banner */}
                        {selectedQuotaId && (() => {
                            const q = quotas.find(q => q.id === selectedQuotaId);
                            if (q && q.filledSeats >= q.totalSeats) return (
                                <div style={{
                                    marginTop: '1rem', padding: '0.85rem', borderRadius: 'var(--radius-md)',
                                    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                                    color: '#991b1b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}>
                                    <Ban size={16} /> <strong>Blocked:</strong> This quota has no remaining seats.
                                </div>
                            );
                            return null;
                        })()}
                    </div>

                    {/* Step 3: Allocate */}
                    <div style={{ ...cardStyle, opacity: (selectedApplicantId && selectedProgramId && selectedQuotaId) ? 1 : 0.5 }} className="card-animate">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                            {stepBadge(3, !!(selectedApplicantId && selectedProgramId && selectedQuotaId))}
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Confirm Allocation</h3>
                        </div>
                        <button
                            onClick={handleAllocate}
                            disabled={!selectedApplicantId || !selectedProgramId || !selectedQuotaId}
                            style={{
                                width: '100%', padding: '0.85rem',
                                backgroundColor: (selectedApplicantId && selectedProgramId && selectedQuotaId) ? 'var(--primary)' : '#e5e7eb',
                                color: (selectedApplicantId && selectedProgramId && selectedQuotaId) ? 'white' : 'var(--text-muted)',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 700, fontSize: '0.9rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                cursor: (selectedApplicantId && selectedProgramId && selectedQuotaId) ? 'pointer' : 'not-allowed',
                                boxShadow: (selectedApplicantId && selectedProgramId && selectedQuotaId) ? '0 4px 14px rgba(40, 167, 69, 0.3)' : 'none',
                            }}
                        >
                            <CheckCircle size={18} /> Allocate Seat
                        </button>
                    </div>
                </div>

                {/* Right: Info Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ ...cardStyle, backgroundColor: mode === 'government' ? '#f0f4ff' : '#faf5ff', borderColor: mode === 'government' ? '#d0e0ff' : '#e9d5ff' }}>
                        <h3 style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                            <ShieldCheck size={17} color={mode === 'government' ? '#2563eb' : '#7c3aed'} />
                            {mode === 'government' ? 'Government Flow' : 'Management Flow'}
                        </h3>
                        <ul style={{ fontSize: '0.78rem', color: mode === 'government' ? '#1e40af' : '#5b21b6', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {mode === 'government' ? (
                                <>
                                    <li>• Select applicant with allotment number</li>
                                    <li>• Choose KCET or COMEDK quota</li>
                                    <li>• System checks real-time availability</li>
                                    <li>• Seat locked immediately on allocation</li>
                                    <li>• Blocked if quota is full</li>
                                </>
                            ) : (
                                <>
                                    <li>• Select applicant (manual entry)</li>
                                    <li>• Choose program & Management quota</li>
                                    <li>• Check seat availability</li>
                                    <li>• Allocate if seats remain</li>
                                </>
                            )}
                        </ul>
                    </div>

                    {selectedApplicant && (
                        <div style={cardStyle} className="card-animate">
                            <h3 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.85rem' }}>Applicant Preview</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {[
                                    ['Name', selectedApplicant.name],
                                    ['Category', selectedApplicant.category],
                                    ['Marks', `${selectedApplicant.marks}%`],
                                    ['Quota Type', selectedApplicant.quotaType],
                                    ['Entry Type', selectedApplicant.entryType],
                                    ['Allotment #', selectedApplicant.allotmentNumber || '—'],
                                ].map(([label, value]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                                        <span style={{ fontWeight: 600 }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent allocations */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.85rem' }}>Recent Allocations</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {applicants.filter(a => a.allocatedProgramId).slice(-5).reverse().map(a => (
                                <div key={a.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-sm)',
                                    backgroundColor: '#f8f9fb', fontSize: '0.78rem'
                                }}>
                                    <CheckCircle size={13} color="var(--success)" />
                                    <span style={{ fontWeight: 600 }}>{a.name}</span>
                                    <ArrowRight size={12} color="var(--text-muted)" />
                                    <span style={{ color: 'var(--text-muted)' }}>{programs.find(p => p.id === a.allocatedProgramId)?.name}</span>
                                </div>
                            ))}
                            {applicants.filter(a => a.allocatedProgramId).length === 0 && (
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No allocations yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Institutions → Campuses → Departments → Programs with totals */}
            <div style={{ marginTop: '2rem', ...cardStyle, padding: '1.25rem 1.5rem' }} className="card-animate">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Seat Overview by Institution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {institutions.map(inst => {
                        const instCampuses = campuses.filter(c => c.institutionId === inst.id);
                        // Placeholder specials (not persisted anywhere yet)
                        const supernumerary = 0;
                        const jkQuota = 0;

                        return (
                            <div key={inst.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{inst.name}</div>
                                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                        <span>Supernumerary: <strong>{supernumerary}</strong></span>
                                        <span>J&K: <strong>{jkQuota}</strong></span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {instCampuses.map(camp => {
                                        const campDepts = departments.filter(d => d.campusId === camp.id);
                                        return (
                                            <div key={camp.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#f9fafb', border: '1px solid var(--border-color)' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>{camp.name}</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {campDepts.map(dept => {
                                                        const deptPrograms = programs.filter(p => p.departmentId === dept.id);
                                                        return (
                                                            <div key={dept.id} style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'white', border: '1px dashed var(--border-color)' }}>
                                                                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.4rem' }}>{dept.name}</div>
                                                                {deptPrograms.length === 0 ? (
                                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No programs</div>
                                                                ) : (
                                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                                                        <thead>
                                                                            <tr style={{ background: '#f8fafc' }}>
                                                                                <th style={{ textAlign: 'left', padding: '6px', borderBottom: '1px solid var(--border-color)' }}>Program</th>
                                                                                <th style={{ textAlign: 'center', padding: '6px', borderBottom: '1px solid var(--border-color)' }}>Total Seats</th>
                                                                                <th style={{ textAlign: 'center', padding: '6px', borderBottom: '1px solid var(--border-color)' }}>Allocated</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {deptPrograms.map(p => {
                                                                                const pQuotas = quotas.filter(q => q.programId === p.id);
                                                                                const totalSeats = pQuotas.reduce((sum, q) => sum + (q.totalSeats || 0), 0);
                                                                                const allocated = pQuotas.reduce((sum, q) => sum + (q.filledSeats || 0), 0);
                                                                                return (
                                                                                    <tr key={p.id}>
                                                                                        <td style={{ padding: '6px', borderBottom: '1px solid var(--border-color)' }}>{p.name}</td>
                                                                                        <td style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>{totalSeats}</td>
                                                                                        <td style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid var(--border-color)', color: allocated >= totalSeats ? 'var(--danger)' : 'var(--primary)' }}>
                                                                                            {allocated}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdmissionAllocation;
