import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from './axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, setUserData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
