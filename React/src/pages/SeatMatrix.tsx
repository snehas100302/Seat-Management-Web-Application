import React, { useState } from 'react';
import { Grid3X3, AlertCircle, Save, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SeatMatrix: React.FC = () => {
    const { programs, quotas, updateQuota, addQuota } = useAppContext();
    const [editState, setEditState] = useState<Record<string, number>>({});
    const [savedMsg, setSavedMsg] = useState('');

    const getQuotasForProgram = (programId: string) =>
        quotas.filter(q => q.programId === programId);

    const getQuotaByName = (programId: string, name: string) =>
        quotas.find(q => q.programId === programId && q.name === name);

    const handleEdit = (quotaId: string, value: number) => {
        setEditState(prev => ({ ...prev, [quotaId]: value }));
    };

    const getEditValue = (quotaId: string, original: number) =>
        editState[quotaId] !== undefined ? editState[quotaId] : original;

    const handleSave = (programId: string) => {
        const pQuotas = getQuotasForProgram(programId);
        pQuotas.forEach(q => {
            if (editState[q.id] !== undefined) {
                updateQuota(q.id, { totalSeats: editState[q.id] });
            }
        });

        // Create missing quotas
        const quotaNames: ('KCET' | 'COMEDK' | 'Management')[] = ['KCET', 'COMEDK', 'Management'];
        quotaNames.forEach(name => {
            if (!getQuotaByName(programId, name)) {
                addQuota({ programId, name, totalSeats: 0, filledSeats: 0 });
            }
        });

        setSavedMsg(programId);
        setTimeout(() => setSavedMsg(''), 2000);
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
    };

    const thStyle: React.CSSProperties = {
        padding: '0.85rem 1.25rem',
        backgroundColor: '#f8f9fb',
        borderBottom: '2px solid var(--border-color)',
        fontSize: '0.72rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        textAlign: 'center',
    };

    const tdStyle: React.CSSProperties = {
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        fontSize: '0.875rem',
        textAlign: 'center',
    };

    const inputNum: React.CSSProperties = {
        width: '70px',
        padding: '0.4rem 0.5rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: 600,
        backgroundColor: '#fafbfc',
    };

    const quotaNames: ('KCET' | 'COMEDK' | 'Management')[] = ['KCET', 'COMEDK', 'Management'];

    return (
        <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Grid3X3 size={22} color="var(--primary)" /> Seat Matrix & Quota Configuration
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Define intake limits and quota distribution. Sum of quota seats must equal total intake.</p>
                </div>
                <div style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                }}>
                    <AlertCircle size={14} /> Rule: KCET + COMEDK + Management = Total Intake
                </div>
            </div>

            <div style={cardStyle} className="card-animate">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ ...thStyle, textAlign: 'left' }}>Program</th>
                            <th style={thStyle}>Total Intake</th>
                            <th style={thStyle}>KCET</th>
                            <th style={thStyle}>COMEDK</th>
                            <th style={thStyle}>Management</th>
                            <th style={thStyle}>Filled</th>
                            <th style={thStyle}>Remaining</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map(program => {
                            const pQuotas = getQuotasForProgram(program.id);
                            const totalQuotaSeats = quotaNames.reduce((sum, name) => {
                                const q = getQuotaByName(program.id, name);
                                return sum + (q ? getEditValue(q.id, q.totalSeats) : 0);
                            }, 0);
                            const totalFilled = pQuotas.reduce((sum, q) => sum + q.filledSeats, 0);
                            const totalRemaining = program.totalIntake - totalFilled;
                            const isValid = totalQuotaSeats === program.totalIntake;

                            return (
                                <tr key={program.id} className="table-row-hover">
                                    <td style={{ ...tdStyle, textAlign: 'left', fontWeight: 600 }}>
                                        <div>{program.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{program.courseType} • {program.entryType}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{program.totalIntake}</span>
                                    </td>
                                    {quotaNames.map(name => {
                                        const q = getQuotaByName(program.id, name);
                                        if (!q) return (
                                            <td key={name} style={tdStyle}>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                                            </td>
                                        );
                                        return (
                                            <td key={name} style={tdStyle}>
                                                <input
                                                    type="number"
                                                    style={inputNum}
                                                    value={getEditValue(q.id, q.totalSeats)}
                                                    onChange={e => handleEdit(q.id, parseInt(e.target.value) || 0)}
                                                    min={0}
                                                />
                                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {q.filledSeats} filled
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td style={tdStyle}>
                                        <span style={{ fontWeight: 700, color: '#2563eb' }}>{totalFilled}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            fontWeight: 700,
                                            color: totalRemaining === 0 ? 'var(--danger)' : 'var(--success)',
                                        }}>{totalRemaining}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        {isValid ? (
                                            <span className="badge badge-success"><CheckCircle size={12} /> Valid</span>
                                        ) : (
                                            <span className="badge badge-danger"><AlertCircle size={12} /> Mismatch ({totalQuotaSeats}/{program.totalIntake})</span>
                                        )}
                                    </td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => handleSave(program.id)}
                                            style={{
                                                backgroundColor: 'var(--primary)',
                                                color: 'white',
                                                padding: '0.4rem 0.85rem',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                            }}
                                        >
                                            <Save size={13} />
                                            {savedMsg === program.id ? 'Saved!' : 'Save'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {programs.length === 0 && (
                            <tr><td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
                                No programs configured. Go to Master Setup to add programs first.
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                {quotaNames.map(name => {
                    const total = quotas.filter(q => q.name === name).reduce((s, q) => s + q.totalSeats, 0);
                    const filled = quotas.filter(q => q.name === name).reduce((s, q) => s + q.filledSeats, 0);
                    return (
                        <div key={name} style={{
                            ...cardStyle,
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }} className="card-animate">
                            <div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{name} Quota</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.25rem' }}>{filled} / {total}</div>
                            </div>
                            <div style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                background: `conic-gradient(var(--primary) ${total > 0 ? (filled / total) * 360 : 0}deg, #e5e7eb 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--bg-card)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                }}>{total > 0 ? Math.round((filled / total) * 100) : 0}%</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SeatMatrix;
