import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/apiClient';
import { AuthFormValues, RegisterFormValues } from '../types';

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (values: AuthFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar desde localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (values: AuthFormValues) => {
    try {
      // TODO: Reemplazar con llamada real a la API cuando esté disponible
      // const response = await apiClient.post<{ user: AuthUser; token: string }>('/auth/login', values);
      
      // Mock login por ahora
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser: AuthUser = {
        id: '1',
        fullName: 'Usuario de Prueba',
        email: values.email,
        role: 'admin',
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Error al iniciar sesión');
    }
  };

  const register = async (values: RegisterFormValues) => {
    try {
      // TODO: Reemplazar con llamada real a la API cuando esté disponible
      // const response = await apiClient.post<{ user: AuthUser; token: string }>('/auth/register', values);
      
      // Mock register por ahora
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser: AuthUser = {
        id: '1',
        fullName: values.fullName,
        email: values.email,
        role: 'user',
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Error al registrar usuario');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
