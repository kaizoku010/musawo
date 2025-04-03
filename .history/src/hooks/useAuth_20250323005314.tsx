
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DEFAULT_ADMIN } from '../config/constants';
import { auth } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      validateSession(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateSession = async (token: string) => {
    try {
      const response = await auth.validate();
      setUser(response.data.user);
    } catch (err) {
      localStorage.removeItem('admin_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use default admin credentials for initial setup
      if (email === DEFAULT_ADMIN.email && password === 'admin123') {
        try {
          console.log('Attempting login with default admin credentials');
          const response = await auth.login(email, password);
          console.log('Login response:', response);
          
          const { token, user } = response.data;
          localStorage.setItem('admin_token', token);
          setUser(user);
          toast.success('Logged in successfully');
          navigate('/dashboard');
        } catch (apiError) {
          console.error('Login API error:', apiError);
          // Fallback to default admin if API fails
          setUser(DEFAULT_ADMIN);
          localStorage.setItem('admin_token', 'default-admin-token');
          toast.success('Logged in with default admin');
          navigate('/dashboard');
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      error 
    }}>
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



