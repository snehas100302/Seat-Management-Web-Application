import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth, User } from '../context/AuthContext';
import { api } from '../utils/api';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [profile, setProfile] = useState<User | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });

    const fetchProfile = async () => {
        setError(null);
        setLoadingProfile(true);
        try {
            const res = await api.get<User>('/api/auth/profile');
            if (res.code === 200) {
                const data = res.data as any;
                setProfile(data);
                setForm({ fullName: data.fullName || '', email: data.email || '', phone: data.phone || '', password: '' });
                return data;
            }
            setError(res.message || 'Failed to load profile');
            return null;
        } catch (e: any) {
            setError(e?.message || 'Failed to load profile');
            return null;
        } finally {
            setLoadingProfile(false);
        }
    };

    const openViewProfile = async () => {
        const data = profile || await fetchProfile();
        if (data) {
            setViewOpen(true);
            setMenuOpen(false);
        }
    };

    const openEditProfile = async () => {
        const data = profile || await fetchProfile();
        if (data) {
            setEditOpen(true);
            setViewOpen(false);
            setMenuOpen(false);
        }
    };

    const handleUpdateProfile = async () => {
        setError(null);
        setLoadingProfile(true);
        try {
            const payload = {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password || undefined
            };
            const res = await api.put<User>('/api/auth/profile', payload);
            if (res.code === 200) {
                const data = res.data as any;
                setProfile(data);
                setEditOpen(false);
                setViewOpen(true);
                setForm({ fullName: data.fullName || '', email: data.email || '', phone: data.phone || '', password: '' });
            } else {
                setError(res.message || 'Failed to update profile');
            }
        } catch (e: any) {
            setError(e?.message || 'Failed to update profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                padding: '2rem',
                marginLeft: 'var(--sidebar-width)',
                backgroundColor: 'var(--bg-main)',
                minHeight: '100vh'
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
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.username}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role}</div>
                        </div>
                        <button
                            onClick={() => setMenuOpen(prev => !prev)}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            aria-label="Profile menu"
                        >
                            {user?.username?.substring(0, 1) || 'U'}
                        </button>

                        {menuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '48px',
                                right: 0,
                                background: 'white',
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                minWidth: '180px',
                                zIndex: 20,
                                overflow: 'hidden'
                            }}>
                                <button onClick={openViewProfile} style={{ width: '100%', padding: '0.75rem 1rem', background: 'white', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>
                                    View Profile
                                </button>
                                <button onClick={openEditProfile} style={{ width: '100%', padding: '0.75rem 1rem', background: 'white', borderTop: '1px solid var(--border-color)', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>
                                    Update Profile
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                {children}
            </main>

            {/* View Profile Modal */}
            {viewOpen && profile && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', width: '360px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Profile</h3>
                            <button onClick={() => setViewOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                        </div>
                        <div style={{ display: 'grid', rowGap: '0.5rem', fontSize: '0.9rem' }}>
                            <div><strong>Full Name:</strong> {profile.fullName}</div>
                            <div><strong>Username:</strong> {profile.username}</div>
                            <div><strong>Email:</strong> {profile.email || '—'}</div>
                            <div><strong>Phone:</strong> {profile.phone || '—'}</div>
                            <div><strong>Role:</strong> {profile.role}</div>
                        </div>
                        {error && <div style={{ marginTop: '0.75rem', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>}
                        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                            <button onClick={() => { setViewOpen(false); setEditOpen(true); }} style={{ padding: '0.65rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Update Profile</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {editOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', width: '380px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Update Profile</h3>
                            <button onClick={() => setEditOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Name
                                <input style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                    value={form.fullName}
                                    onChange={e => setForm({ ...form, fullName: e.target.value })} />
                            </label>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email
                                <input style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })} />
                            </label>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Phone
                                <input style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </label>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>New Password (optional)
                                <input type="password" style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })} />
                            </label>
                        </div>
                        {error && <div style={{ marginTop: '0.75rem', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>}
                        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button onClick={() => setEditOpen(false)} style={{ padding: '0.6rem 0.9rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleUpdateProfile} disabled={loadingProfile} style={{ padding: '0.65rem 1rem', background: loadingProfile ? '#9ca3af' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: loadingProfile ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
                                {loadingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
