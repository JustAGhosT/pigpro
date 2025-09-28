import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'farmer' | 'feeder' | 'butcher' | 'scientist' | 'manager';
  avatar?: string;
  tier: 'free' | 'premium' | 'enterprise';
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  logout: () => void;
  showAuthModal: (mode?: 'signin' | 'signup') => void;
  hideAuthModal: () => void;
  authModalMode: 'signin' | 'signup';
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In a real app, validate token with backend
          const mockUser: User = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+27 82 123 4567',
            role: 'farmer',
            tier: 'free',
            isVerified: true,
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Simulate API call - in production, this would be a real API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, validate credentials with backend
      // Never log actual passwords
      console.log('Login attempt for:', email);
      
      // Mock user data - in production, this comes from the API response
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        phone: '+27 82 123 4567',
        role: 'farmer',
        tier: 'free',
        isVerified: true,
      };
      
      setUser(mockUser);
      // In production, use a real JWT token from the API
      localStorage.setItem('auth_token', 'mock_token');
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: '1',
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone,
        role: userData.role || 'farmer',
        tier: 'free',
        isVerified: false,
      };
      
      setUser(newUser);
      localStorage.setItem('auth_token', 'mock_token');
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser: User = {
        id: '1',
        name: `User via ${provider}`,
        email: `user@${provider}.com`,
        role: 'farmer',
        tier: 'free',
        isVerified: true,
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token');
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw new Error(`${provider} login failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const showAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const hideAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    socialLogin,
    logout,
    showAuthModal,
    hideAuthModal,
    authModalMode,
    isAuthModalOpen,
  };

  return (
    <AuthContext.Provider value={value}>
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
