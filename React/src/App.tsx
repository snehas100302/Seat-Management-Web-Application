import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import MasterSetup from './pages/MasterSetup';
import SeatMatrix from './pages/SeatMatrix';
import ApplicantManagement from './pages/ApplicantManagement';
import AdmissionAllocation from './pages/AdmissionAllocation';
import AdmissionConfirmation from './pages/AdmissionConfirmation';

function App() {
    return (
        <AppProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/master-setup" element={<MasterSetup />} />
                        <Route path="/seat-matrix" element={<SeatMatrix />} />
                        <Route path="/applicants" element={<ApplicantManagement />} />
                        <Route path="/allocation" element={<AdmissionAllocation />} />
                        <Route path="/confirmation" element={<AdmissionConfirmation />} />
                    </Routes>
                </Layout>
            </Router>
        </AppProvider>
    );
}


export default App;
