import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import React from 'react';
import axios from 'axios';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'artisan' | 'distributor' | 'admin';
  photoURL?: string;
  phone?: string;
  location?: string;
  bio?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
}

// AuthContext type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  updateUserData: (updatedUser: User) => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component props type
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Set token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Validate token with backend and get fresh user data
      try {
        const response = await axios.get('https://cautious-zebra-x5549r5475j6f979-5000.app.github.dev/api/auth/profile');
        
        if (response.data.success) {
          const userData: User = {
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            role: response.data.data.role,
            phone: response.data.data.phone,
            photoURL: response.data.data.photoURL,
            isEmailVerified: response.data.data.isEmailVerified,
            isPhoneVerified: response.data.data.isPhoneVerified,
            isIdentityVerified: response.data.data.isIdentityVerified
          };
          setUser(userData);
          
          // Update localStorage with fresh data
          localStorage.setItem('userRole', userData.role);
          localStorage.setItem('userName', userData.name);
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userId', userData.id);
          if (userData.photoURL) {
            localStorage.setItem('userPhoto', userData.photoURL);
          }
        } else {
          throw new Error('Invalid token');
        }
      } catch (tokenError) {
        console.warn('Token validation failed, falling back to localStorage data:', tokenError);
        
        // Fallback to localStorage data if backend validation fails
        const userRole = localStorage.getItem('userRole') as User['role'];
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');
        const userPhoto = localStorage.getItem('userPhoto');

        if (userRole && userName && userEmail && userId) {
          const userData: User = {
            id: userId,
            name: userName,
            email: userEmail,
            role: userRole,
            photoURL: userPhoto || undefined,
            isEmailVerified: true,
            isPhoneVerified: false,
            isIdentityVerified: false
          };
          setUser(userData);
        } else {
          // Clear invalid data
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User, token: string) => {
    console.log('🔍 AuthContext Debug - Login called with userData:', userData);
    console.log('🔍 AuthContext Debug - User role:', userData.role);
    
    // Set token in axios defaults
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Update state
    setUser(userData);

    // Store in localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userId', userData.id);
    if (userData.photoURL) {
      localStorage.setItem('userPhoto', userData.photoURL);
    }
    
    console.log('🔍 AuthContext Debug - Data stored in localStorage');
    console.log('🔍 AuthContext Debug - Stored role:', localStorage.getItem('userRole'));
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      try {
        await axios.post('https://cautious-zebra-x5549r5475j6f979-5000.app.github.dev/api/auth/logout');
      } catch (logoutError) {
        console.warn('Backend logout failed:', logoutError);
        // Continue with frontend cleanup even if backend logout fails
      }
      
      // Clear axios default header
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear state
      setUser(null);

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('userPhoto');
      
      // Clear any sessionStorage items
      sessionStorage.removeItem('selectedRole');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    // Update localStorage with new values
    if (userData.name) localStorage.setItem('userName', userData.name);
    if (userData.email) localStorage.setItem('userEmail', userData.email);
    if (userData.photoURL) localStorage.setItem('userPhoto', userData.photoURL);
  };

  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('userName', updatedUser.name);
    localStorage.setItem('userEmail', updatedUser.email);
    if (updatedUser.photoURL) {
      localStorage.setItem('userPhoto', updatedUser.photoURL);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;