import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Settings,
    Grid3X3,
    Users,
    UserPlus,
    CheckCircle2,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    const menuGroups = [
        {
            title: 'Admin',
            roles: ['Admin'],
            items: [
                { name: 'Master Setup', path: '/master-setup', icon: Settings },
                { name: 'Seat Matrix & Quotas', path: '/seat-matrix', icon: Grid3X3 },
            ]
        },
        {
            title: 'Admission Officer',
            roles: ['Admission Officer'],
            items: [
                { name: 'Applicants', path: '/applicants', icon: Users },
                { name: 'Seat Allocation', path: '/allocation', icon: UserPlus },
                { name: 'Admission Confirmation', path: '/confirmation', icon: CheckCircle2 },
            ]
        },
        {
            title: 'Overview',
            roles: ['Admin', 'Admission Officer', 'Management'],
            items: [
                { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ]
        }
    ];

    const filteredGroups = menuGroups.filter(group => group.roles.includes(user?.role || ''));

    const sidebarStyle: React.CSSProperties = {
        width: 'var(--sidebar-width)',
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        color: 'var(--text-on-dark)',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0',
        zIndex: 1000,
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    };

    const groupTitleStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'rgba(255,255,255,0.4)',
        padding: '1.5rem 1.5rem 0.75rem',
    };

    const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.5rem',
        color: isActive ? 'var(--text-on-dark)' : 'rgba(255,255,255,0.7)',
        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        fontSize: '0.925rem',
        position: 'relative'
    });

    const activeIndicatorStyle: React.CSSProperties = {
        position: 'absolute',
        left: 0,
        width: '4px',
        height: '100%',
        backgroundColor: 'var(--primary)',
        borderRadius: '0 4px 4px 0'
    };

    return (
        <aside style={sidebarStyle}>
            <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
                    SeatCMS
                </h1>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto' }}>
                {filteredGroups.map((group) => (
                    <div key={group.title}>
                        <div style={groupTitleStyle}>{group.title}</div>
                        {group.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className="nav-link"
                                style={({ isActive }) => navLinkStyle({ isActive })}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && <div style={activeIndicatorStyle} />}
                                        <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                                        <span style={{ flex: 1 }}>{item.name}</span>
                                        <ChevronRight size={14} style={{ opacity: 0.3 }} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.875rem'
                    }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
