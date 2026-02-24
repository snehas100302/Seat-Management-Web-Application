import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import MasterSetup from './pages/MasterSetup';
import SeatMatrix from './pages/SeatMatrix';
import ApplicantManagement from './pages/ApplicantManagement';
import AdmissionAllocation from './pages/AdmissionAllocation';
import AdmissionConfirmation from './pages/AdmissionConfirmation';
import Login from './pages/Login';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;

    return <>{children}</>;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
                <ProtectedRoute>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />

                            {/* Admin Routes */}
                            <Route path="/master-setup" element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <MasterSetup />
                                </ProtectedRoute>
                            } />
                            <Route path="/seat-matrix" element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <SeatMatrix />
                                </ProtectedRoute>
                            } />

                            {/* Officer Routes */}
                            <Route path="/applicants" element={
                                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                                    <ApplicantManagement />
                                </ProtectedRoute>
                            } />
                            <Route path="/allocation" element={
                                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                                    <AdmissionAllocation />
                                </ProtectedRoute>
                            } />
                            <Route path="/confirmation" element={
                                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                                    <AdmissionConfirmation />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AppProvider>
        </AuthProvider>
    );
}

export default App;
