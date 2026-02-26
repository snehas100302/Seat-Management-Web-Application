import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Admin' | 'Admission Officer' | 'Management';

export interface User {
    id: string | number;
    username: string;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    accessToken?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isLoading: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('seat_cms_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
console.log("result ",result);
            if (response.ok && result.code === 200) {
                const newUser: User = {
                    ...result.data,
                    accessToken: result.accessToken
                };

                setUser(newUser);
                localStorage.setItem('seat_cms_user', JSON.stringify(newUser));
                localStorage.setItem('seat_cms_token', result.accessToken);
                setIsLoading(false);
                return { success: true, message: 'Login successful!' };
            } else {
                setIsLoading(false);
                return { success: false, message: result.message || result.errorMsg || 'Invalid credentials' };
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            return { success: false, message: 'Network error or server is unreachable.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('seat_cms_user');
        localStorage.removeItem('seat_cms_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
