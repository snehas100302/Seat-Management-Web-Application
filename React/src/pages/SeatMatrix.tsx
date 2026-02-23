import React from 'react';
import { Grid3X3, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SeatMatrix: React.FC = () => {
    const { programs } = useAppContext();

    const containerStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    };

    const thStyle: React.CSSProperties = {
        padding: '1rem 1.5rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid var(--border-color)',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase'
    };

    const tdStyle: React.CSSProperties = {
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-color)',
        fontSize: '0.9rem'
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Grid3X3 className="text-primary" /> Seat Matrix & Quota Configuration
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Define intake limits and quota distribution for each program.</p>
                </div>
                <div style={{
                    backgroundColor: '#e7f5ea',
                    color: 'var(--primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <AlertCircle size={16} /> Sum of quota seats must equal Total Intake.
                </div>
            </div>

            <div style={containerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Program Name</th>
                            <th style={thStyle}>Total Intake</th>
                            <th style={thStyle}>General</th>
                            <th style={thStyle}>SC</th>
                            <th style={thStyle}>ST</th>
                            <th style={thStyle}>MGMT</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map(program => (
                            <tr key={program.id}>
                                <td style={{ ...tdStyle, fontWeight: 600 }}>{program.name}</td>
                                <td style={tdStyle}>
                                    <input type="number" defaultValue={program.totalIntake} style={{ width: '60px', padding: '0.25rem' }} />
                                </td>
                                {program.quotas.map(quota => (
                                    <td key={quota.id} style={tdStyle}>
                                        <input type="number" defaultValue={quota.seats} style={{ width: '60px', padding: '0.25rem' }} />
                                    </td>
                                ))}
                                <td style={tdStyle}>
                                    <button style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SeatMatrix;
