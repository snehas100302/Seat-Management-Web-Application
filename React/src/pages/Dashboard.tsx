import React from 'react';
import { LayoutDashboard, Users, CheckCircle, PieChart, TrendingUp, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
    const { programs, applicants } = useAppContext();

    const totalIntake = programs.reduce((acc, p) => acc + p.totalIntake, 0);
    const totalApplied = applicants.length;
    const totalAllocated = applicants.filter(a => a.allocatedProgramId).length;
    const totalConfirmed = applicants.filter(a => a.isFeePaid).length;

    const stats = [
        { label: 'Total Intake', value: totalIntake, icon: TrendingUp, color: '#3b82f6' },
        { label: 'Total Applicants', value: totalApplied, icon: Users, color: '#8b5cf6' },
        { label: 'Seats Allocated', value: totalAllocated, icon: PieChart, color: '#f59e0b' },
        { label: 'Admissions Confirmed', value: totalConfirmed, icon: CheckCircle, color: 'var(--primary)' },
    ];

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)'
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LayoutDashboard className="text-primary" /> Institutional Dashboard
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time overview of the admission cycle and seat occupancy.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map(stat => (
                    <div key={stat.label} style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</p>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{stat.value}</h2>
                            </div>
                            <div style={{ padding: '0.5rem', backgroundColor: `${stat.color}15`, borderRadius: 'var(--radius-md)' }}>
                                <stat.icon color={stat.color} size={24} />
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: '6px', backgroundColor: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${(stat.value / totalIntake) * 100}%`, height: '100%', backgroundColor: stat.color }}></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {Math.round((stat.value / totalIntake) * 100) || 0}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Program-wise Occupancy</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {programs.map(p => {
                            const allocated = applicants.filter(a => a.allocatedProgramId === p.id).length;
                            const percent = (allocated / p.totalIntake) * 100;
                            return (
                                <div key={p.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{allocated} / {p.totalIntake}</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: percent > 90 ? 'var(--danger)' : 'var(--primary)' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Verification Alerts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {applicants.filter(a => a.status === 'Pending').length > 0 ? (
                            applicants.filter(a => a.status === 'Pending').map(a => (
                                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#fff8e6', borderRadius: 'var(--radius-md)', border: '1px solid #ffeeba' }}>
                                    <AlertCircle size={18} color="#b45309" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Documents Pending: {a.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#b45309' }}>Registration date: Today</div>
                                    </div>
                                    <button style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>Review</button>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                All document verifications are up to date!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
