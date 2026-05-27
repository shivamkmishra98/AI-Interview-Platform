import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Lazy loading pages for performance optimization
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const InterviewSetup = lazy(() => import('./pages/InterviewSetup'));
const ActiveInterview = lazy(() => import('./pages/ActiveInterview'));
const InterviewResult = lazy(() => import('./pages/InterviewResult'));
const Analytics = lazy(() => import('./pages/Analytics'));
const CodingInterview = lazy(() => import('./pages/CodingInterview'));
const Profile = lazy(() => import('./pages/Profile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VoiceInterview = lazy(() => import('./pages/VoiceInterview'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex-1 bg-[#0b1120] min-h-screen flex justify-center items-center">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Mock Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white flex flex-col font-sans">
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155'
            }
          }} 
        />
        <main className="flex-grow flex flex-col">
          <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview/coding" 
              element={
                <ProtectedRoute>
                  <CodingInterview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview/setup" 
              element={
                <ProtectedRoute>
                  <InterviewSetup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview/:id" 
              element={
                <ProtectedRoute>
                  <ActiveInterview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview/result/:id" 
              element={
                <ProtectedRoute>
                  <InterviewResult />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview/voice/:id" 
              element={
                <ProtectedRoute>
                  <VoiceInterview />
                </ProtectedRoute>
              } 
            />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
