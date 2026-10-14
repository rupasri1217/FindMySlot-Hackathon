import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import GoogleAccountModal from './components/GoogleAccountModal';
import DriverDashboard from './components/DriverDashboard';
import OperatorDashboard from './components/OperatorDashboard';

function MainRouter() {
  const { activePath, isAuthenticated, userRole } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('driver');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default LIGHT MODE

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Sync dark class with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleOpenAuth = (role = 'driver') => {
    setAuthInitialRole(role);
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };

  // Route matching logic
  if (isAuthenticated && activePath === '/driver/dashboard') {
    return <DriverDashboard isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
  }

  if (isAuthenticated && activePath === '/operator/dashboard') {
    return <OperatorDashboard isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
  }

  // Default Landing Page + Google Account Modal
  return (
    <>
      <LandingPage 
        onOpenAuth={handleOpenAuth} 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme} 
      />
      <GoogleAccountModal 
        isOpen={isAuthOpen} 
        onClose={handleCloseAuth} 
        initialRole={authInitialRole} 
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}
