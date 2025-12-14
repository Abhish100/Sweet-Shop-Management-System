import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Address } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (u: string, p: string) => Promise<void>;
  initiateRegister: (u: string, e: string, p: string) => Promise<{ otp: string }>;
  verifyOtp: (e: string, otp: string, u: string, p: string) => Promise<void>;
  logout: () => void;
  addAddress: (addr: Omit<Address, 'id'>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    const response = await api.login(identifier, password);
    setUser(response.user);
    // Persist user to localStorage
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const initiateRegister = async (username: string, email: string, password: string) => {
    const response = await api.initiateRegister(username, email, password);
    return response; 
  };

  const verifyOtp = async (email: string, otp: string, username: string, password: string) => {
    const response = await api.verifyOtp(email, otp, username, password);
    setUser(response.user);
    // Persist user to localStorage
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  const logout = async () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const addAddress = async (addr: Omit<Address, 'id'>) => {
    if (!user) return;
    try {
    const updatedUser = await api.addUserAddress(user.id, addr);
    setUser(updatedUser);
    } catch (error) {
      // If backend doesn't support addresses yet, store locally
      console.warn('Address API not available, storing locally');
      const updatedUser = { ...user, savedAddresses: [...(user.savedAddresses || []), { ...addr, id: `addr-${Date.now()}` }] };
      setUser(updatedUser);
    }
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ user, loading, login, initiateRegister, verifyOtp, logout, addAddress, isAdmin }}>
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