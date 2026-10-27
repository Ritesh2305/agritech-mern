import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'admin';
  phone?: string;
  language?: string;
  region?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  switchDemoUser: (type: 'admin' | 'ramesh' | 'lakshmi') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agritech_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to Ramesh Patel (Farmer) for instant preview experience
    return {
      id: 'usr_farmer_1',
      name: 'Ramesh Patel',
      email: 'ramesh@farmer.in',
      role: 'farmer',
      phone: '+91 98765 43210',
      language: 'hi',
      region: 'Warangal, Telangana',
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agritech_token') || 'demo_farmer_jwt_token_2026';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agritech_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agritech_user');
    }
    if (token) {
      localStorage.setItem('agritech_token', token);
    } else {
      localStorage.removeItem('agritech_token');
    }
  }, [user, token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: data.message || 'Login failed' };
    } catch (err: any) {
      // Local demo fallback if network interrupted
      if (email.includes('admin')) {
        const adminUser: UserProfile = {
          id: 'usr_admin_1',
          name: 'Dr. Vikramaditya Rao',
          email: 'admin@agritech.org',
          role: 'admin',
          phone: '+91 94401 23456',
          region: 'Central Administration, Hyderabad',
        };
        setUser(adminUser);
        setToken('demo_admin_jwt_token_2026');
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, message: 'Could not connect to server. Check credentials.' };
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err: any) {
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'farmer',
        phone: userData.phone || '+91 98000 00000',
        region: userData.region || 'Telangana, India',
      };
      setUser(newUser);
      setToken('demo_registered_token');
      setIsLoading(false);
      return { success: true };
    }
  };

  const switchDemoUser = async (type: 'admin' | 'ramesh' | 'lakshmi') => {
    try {
      const res = await fetch('/api/v1/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoType: type }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        return;
      }
    } catch (e) {
      // fallback
    }

    if (type === 'admin') {
      setUser({
        id: 'usr_admin_1',
        name: 'Dr. Vikramaditya Rao',
        email: 'admin@agritech.org',
        role: 'admin',
        phone: '+91 94401 23456',
        region: 'Central Administration, Hyderabad',
      });
      setToken('demo_admin_jwt_token_2026');
    } else if (type === 'lakshmi') {
      setUser({
        id: 'usr_farmer_2',
        name: 'Lakshmi Devi',
        email: 'lakshmi@farmer.in',
        role: 'farmer',
        phone: '+91 98480 11223',
        language: 'te',
        region: 'Guntur, Andhra Pradesh',
      });
      setToken('demo_lakshmi_token');
    } else {
      setUser({
        id: 'usr_farmer_1',
        name: 'Ramesh Patel',
        email: 'ramesh@farmer.in',
        role: 'farmer',
        phone: '+91 98765 43210',
        language: 'hi',
        region: 'Warangal, Telangana',
      });
      setToken('demo_farmer_jwt_token_2026');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        switchDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
