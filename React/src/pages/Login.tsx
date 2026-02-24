import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Building2, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background orbs */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(40, 167, 69, 0.15), transparent 70%)',
                animation: 'float 8s ease-in-out infinite',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-15%',
                right: '-10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12), transparent 70%)',
                animation: 'float 6s ease-in-out infinite reverse',
                pointerEvents: 'none'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '440px',
                padding: '2.5rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(30, 41, 59, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6)',
                color: 'white',
                animation: 'fadeInUp 0.5s ease-out'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '16px',
                        margin: '0 auto 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(40, 167, 69, 0.35)'
                    }}>
                        <Building2 size={30} />
                    </div>
                    <h1 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Admission Management
                    </h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                        Sign in to access the CMS portal
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.75rem 1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(220, 53, 69, 0.15)',
                        border: '1px solid rgba(220, 53, 69, 0.3)',
                        color: '#ff6b7a',
                        fontSize: '0.85rem',
                        animation: 'fadeInUp 0.3s ease-out'
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    {/* Email */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: '0.5rem',
                            display: 'block',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@institution.edu"
                            style={{
                                width: '100%',
                                padding: '0.85rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'border-color 0.2s, box-shadow 0.2s'
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(40, 167, 69, 0.5)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <label style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: '0.5rem',
                            display: 'block',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 3rem 0.85rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(40, 167, 69, 0.5)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    padding: '4px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            borderRadius: '8px',
                            backgroundColor: isLoading ? '#1e7a34' : 'var(--primary)',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            border: 'none',
                            cursor: isLoading ? 'wait' : 'pointer',
                            transition: 'background-color 0.2s, transform 0.1s',
                            boxShadow: '0 4px 14px rgba(40, 167, 69, 0.3)'
                        }}
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Credentials hint */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Demo Credentials
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                        <div><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Admin:</strong> admin@institution.edu / admin123</div>
                        <div><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Officer:</strong> officer@institution.edu / officer123</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
