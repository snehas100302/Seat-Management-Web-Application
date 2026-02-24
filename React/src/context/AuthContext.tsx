import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'officer' | 'management';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isLoading: boolean;
}

// Hardcoded credentials
const CREDENTIALS: { email: string; password: string; role: UserRole; name: string }[] = [
    { email: 'admin@institution.edu', password: 'admin123', role: 'admin', name: 'System Administrator' },
    { email: 'officer@institution.edu', password: 'officer123', role: 'officer', name: 'Admission Officer' },
];

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

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const match = CREDENTIALS.find(c => c.email === email && c.password === password);

        if (!match) {
            setIsLoading(false);
            return { success: false, message: 'Invalid email or password. Please try again.' };
        }

        const newUser: User = {
            id: Math.random().toString(36).substring(7),
            name: match.name,
            role: match.role,
            email: match.email
        };

        setUser(newUser);
        localStorage.setItem('seat_cms_user', JSON.stringify(newUser));
        setIsLoading(false);
        return { success: true, message: 'Login successful!' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('seat_cms_user');
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
