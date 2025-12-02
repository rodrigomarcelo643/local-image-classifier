import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UploadForm from "./components/UploadForm";
import PredictForm from "./components/PredictForm";
import ModelsList from "./components/ModelsList";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import Documentation from "./pages/Documentation";
import { authToasts } from "./utils/toast";

interface User {
  email: string;
  name: string;
  avatar?: string;
}

function AppContent() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isDocsPage = location.pathname === '/docs';

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleUpdateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    authToasts.logoutSuccess();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex flex-col">
      {!isAuthPage && !isDocsPage && <Navbar user={user} onLogout={handleLogout} />}

      <main className={`flex-1 ${isAuthPage || isDocsPage ? "" : "container mx-auto px-4 py-8"}`}>
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/" replace /> : <LoginForm onLogin={handleLogin} />
            } />
            <Route path="/signup" element={
              user ? <Navigate to="/" replace /> : <SignupForm onSignup={handleLogin} />
            } />
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/predict" element={<PredictForm />} />
            <Route path="/models" element={<ModelsList />} />
            <Route path="/profile" element={
              user ? <ProfilePage user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" replace />
            } />
            <Route path="/settings" element={
              user ? <SettingsPage /> : <Navigate to="/login" replace />
            } />
            <Route path="/docs" element={<Documentation />} />
          </Routes>
      </main>

      {!isAuthPage && !isDocsPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster 
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#065f46',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            border: '1px solid #10b981',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '500px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              border: '1px solid #10b981',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '1px solid #ef4444',
              color: '#dc2626',
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;