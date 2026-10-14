import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'driver' | 'operator' | null
  const [userProfile, setUserProfile] = useState(null);
  const [activePath, setActivePath] = useState('/'); // '/' | '/auth' | '/driver/dashboard' | '/operator/dashboard'

  const login = (role, profileData = {}) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserProfile({
      name: profileData.name || (role === 'driver' ? 'Rohan Sharma' : 'Connaught Place Lot Manager'),
      phone: profileData.phone || '+91 98765 43210',
      vehicleNumber: profileData.vehicleNumber || (role === 'driver' ? 'KA-03-HL-4821' : 'OP-REG-9900')
    });

    const targetRoute = role === 'driver' ? '/driver/dashboard' : '/operator/dashboard';
    setActivePath(targetRoute);
    return targetRoute;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserProfile(null);
    setActivePath('/');
  };

  const navigateTo = (path) => {
    setActivePath(path);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userRole,
      userProfile,
      activePath,
      login,
      logout,
      navigateTo
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
