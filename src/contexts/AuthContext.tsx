import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initConsumer, disconnectConsumer } from '../services/webSocketService'

interface User {
  email: string;
  name?: string;
  id?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (jwtToken: string, user: User) => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  currentUser: null,
  login: () => {},
  logout: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (jwtToken: string, user: User) => {
    localStorage.setItem('jwtToken', jwtToken);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    initConsumer();
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
    disconnectConsumer();
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


