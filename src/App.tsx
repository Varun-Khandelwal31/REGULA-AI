import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Onboarding from './pages/Onboarding';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/app/Dashboard';
import Obligations from './pages/app/Obligations';
import Analyzer from './pages/app/Analyzer';
import Filing from './pages/app/Filing';
import Voice from './pages/app/Voice';
import Radar from './pages/app/Radar';
import Vault from './pages/app/Vault';
import Settings from './pages/app/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, onboardingComplete } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !onboardingComplete ? (
                <Onboarding />
              ) : (
                <Navigate to="/app/dashboard" replace />
              )
            ) : (
              <Onboarding />
            )
          }
        />
        <Route
          path="/app"
          element={<AppLayout />}
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="obligations" element={<ProtectedRoute><Obligations /></ProtectedRoute>} />
          <Route path="analyzer" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
          <Route path="filing" element={<ProtectedRoute><Filing /></ProtectedRoute>} />
          <Route path="voice" element={<ProtectedRoute><Voice /></ProtectedRoute>} />
          <Route path="radar" element={<ProtectedRoute><Radar /></ProtectedRoute>} />
          <Route path="vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
