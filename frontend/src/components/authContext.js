import { createContext, useState, useContext, useEffect } from 'react';
import api from './axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/profile');
        if (response.status === 200) {
          setIsLoggedIn(true);
          setUserData(response.data);
        }
      } catch (error) { 
        console.log(error.message);
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    window.location.reload();
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, setUserData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
