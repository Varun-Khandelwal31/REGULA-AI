import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  fullName: string;
  email: string;
  businessName: string;
  industry?: string;
  state?: string;
  city?: string;
  employees?: string;
  turnover?: string;
  gstin?: string;
  hasGST?: boolean;
  hasEPFO?: boolean;
  hasESI?: boolean;
  hasUdyam?: boolean;
  hasProfTax?: boolean;
  hasFSSAI?: boolean;
  whatsappNumber?: string;
  alertEmail?: string;
  alertTiming?: string[];
  language?: 'en' | 'hi';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  completeOnboarding: () => void;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  onboardingComplete: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  completeOnboarding: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('regulaai_user');
      const auth = localStorage.getItem('regulaai_auth');
      const onboarded = localStorage.getItem('regulaai_onboarding_complete');

      if (auth && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (onboarded) {
        setOnboardingComplete(true);
      }
    } catch (e) {
      // ignore
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('regulaai_auth', 'true');
    localStorage.setItem('regulaai_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('regulaai_auth');
    localStorage.removeItem('regulaai_user');
    localStorage.removeItem('regulaai_onboarding_complete');
    setUser(null);
    setOnboardingComplete(false);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      localStorage.setItem('regulaai_user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('regulaai_onboarding_complete', 'true');
    setOnboardingComplete(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060E24] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1E5EE5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        onboardingComplete,
        login,
        logout,
        updateUser,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
