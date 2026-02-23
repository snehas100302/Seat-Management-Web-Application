import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                padding: '2rem',
                marginLeft: 'var(--sidebar-width)',
                backgroundColor: 'var(--bg-main)'
            }}>
                <header style={{
                    height: 'var(--header-height)',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Seat Management CMS</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Admin User</span>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem'
                        }}>JD</div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};

export default Layout;
