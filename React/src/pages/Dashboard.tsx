import React from 'react';
import {
    LayoutDashboard, Users, CheckCircle, TrendingUp, AlertCircle,
    Clock, CreditCard, FileText, PieChart
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
    const { programs, applicants, quotas } = useAppContext();

    const totalIntake = programs.reduce((acc, p) => acc + p.totalIntake, 0);
    const totalApplicants = applicants.length;
    const totalAllocated = applicants.filter(a => a.allocatedProgramId).length;
    const totalConfirmed = applicants.filter(a => a.admissionNumber).length;
    const totalRemaining = totalIntake - totalAllocated;
    const feePending = applicants.filter(a => a.allocatedProgramId && a.feeStatus === 'PENDING');
    const docsPending = applicants.filter(a => a.documents.some(d => d.status !== 'VERIFIED'));

    const stats = [
        { label: 'Total Intake', value: totalIntake, icon: TrendingUp, color: '#3b82f6', bg: '#eff6ff' },
        { label: 'Total Applicants', value: totalApplicants, icon: Users, color: '#8b5cf6', bg: '#faf5ff' },
        { label: 'Seats Allocated', value: totalAllocated, icon: PieChart, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Confirmed', value: totalConfirmed, icon: CheckCircle, color: '#059669', bg: '#ecfdf5' },
    ];

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LayoutDashboard size={22} color="var(--primary)" /> Institutional Dashboard
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time overview of the admission cycle, seat occupancy, and pending actions.</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                {stats.map(stat => (
                    <div key={stat.label} style={cardStyle} className="card-animate">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</p>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.15rem' }}>{stat.value}</h2>
                            </div>
                            <div style={{ padding: '0.6rem', backgroundColor: stat.bg, borderRadius: '10px' }}>
                                <stat.icon color={stat.color} size={22} />
                            </div>
                        </div>
                        <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: '5px', backgroundColor: '#f1f3f5', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${totalIntake > 0 ? Math.min((stat.value / totalIntake) * 100, 100) : 0}%`,
                                    height: '100%', backgroundColor: stat.color,
                                    borderRadius: '3px', transition: 'width 0.6s ease-out',
                                }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '32px', textAlign: 'right' }}>
                                {totalIntake > 0 ? Math.round((stat.value / totalIntake) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Remaining seats highlight */}
            <div style={{
                ...cardStyle,
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                borderColor: '#a7f3d0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '2rem',
                padding: '1.25rem 1.5rem',
            }} className="card-animate">
                <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#065f46' }}>Remaining Seats Available</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>{totalRemaining} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#065f46' }}>/ {totalIntake}</span></div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#065f46', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span>Fill Rate: <strong>{totalIntake > 0 ? Math.round((totalAllocated / totalIntake) * 100) : 0}%</strong></span>
                    <span>Confirmation Rate: <strong>{totalAllocated > 0 ? Math.round((totalConfirmed / totalAllocated) * 100) : 0}%</strong></span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Quota-wise Breakdown */}
                <div style={cardStyle} className="card-animate">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <PieChart size={17} color="var(--primary)" /> Quota-wise Seat Status
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(['KCET', 'COMEDK', 'MANAGEMENT'] as const).map(quotaName => {
                            const qList = quotas.filter(q => q.name === quotaName);
                            const total = qList.reduce((s, q) => s + q.totalSeats, 0);
                            const filled = qList.reduce((s, q) => s + q.filledSeats, 0);
                            const percent = total > 0 ? (filled / total) * 100 : 0;
                            const colors: Record<string, string> = { 'KCET': '#3b82f6', 'COMEDK': '#8b5cf6', 'MANAGEMENT': '#f59e0b' };
                            return (
                                <div key={quotaName}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 600 }}>{quotaName}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{filled} / {total}</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${percent}%`, height: '100%',
                                            backgroundColor: colors[quotaName],
                                            borderRadius: '4px',
                                            transition: 'width 0.6s ease-out',
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Program-wise Occupancy */}
                <div style={cardStyle} className="card-animate">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <TrendingUp size={17} color="var(--primary)" /> Program-wise Occupancy
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {programs.map(p => {
                            const allocated = applicants.filter(a => a.allocatedProgramId === p.id).length;
                            const percent = p.totalIntake > 0 ? (allocated / p.totalIntake) * 100 : 0;
                            return (
                                <div key={p.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{allocated} / {p.totalIntake}</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${percent}%`, height: '100%',
                                            backgroundColor: percent > 90 ? 'var(--danger)' : 'var(--primary)',
                                            borderRadius: '4px',
                                            transition: 'width 0.6s ease-out',
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                        {programs.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No programs configured.</p>}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Pending Documents */}
                <div style={cardStyle} className="card-animate">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={17} color="#d97706" /> Pending Documents
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {docsPending.length > 0 ? (
                            docsPending.slice(0, 8).map(a => {
                                const pendingCount = a.documents.filter(d => d.status !== 'VERIFIED').length;
                                return (
                                    <div key={a.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                                        padding: '0.6rem 0.85rem', backgroundColor: '#fffbeb',
                                        borderRadius: 'var(--radius-sm)', border: '1px solid #fef3c7',
                                    }}>
                                        <AlertCircle size={15} color="#d97706" />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{a.name}</div>
                                            <div style={{ fontSize: '0.68rem', color: '#92400e' }}>{pendingCount} document(s) pending</div>
                                        </div>
                                        <span className="badge badge-warning"><Clock size={9} /> Review</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <CheckCircle size={24} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
                                <div>All documents verified!</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fee Pending */}
                <div style={cardStyle} className="card-animate">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CreditCard size={17} color="#dc2626" /> Fee Pending List
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {feePending.length > 0 ? (
                            feePending.slice(0, 8).map(a => (
                                <div key={a.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                                    padding: '0.6rem 0.85rem', backgroundColor: '#fef2f2',
                                    borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca',
                                }}>
                                    <CreditCard size={15} color="#dc2626" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{a.name}</div>
                                        <div style={{ fontSize: '0.68rem', color: '#991b1b' }}>
                                            {programs.find(p => p.id === a.allocatedProgramId)?.name || '—'}
                                        </div>
                                    </div>
                                    <span className="badge badge-danger"><Clock size={9} /> Unpaid</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <CheckCircle size={24} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
                                <div>No pending fees!</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
