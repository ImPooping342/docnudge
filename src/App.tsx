import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NewRequestPage from './pages/NewRequestPage';
import RequestDetailPage from './pages/RequestDetailPage';
import ClientUploadPage from './pages/ClientUploadPage';
import EarlyAccessPage from './pages/EarlyAccessPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/early-access" element={<EarlyAccessPage />} />
        
        {/* App Section */}
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/new" element={<NewRequestPage />} />
        <Route path="/app/requests/:id" element={<RequestDetailPage />} />
        
        {/* Public Client Section */}
        <Route path="/r/:token" element={<ClientUploadPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
