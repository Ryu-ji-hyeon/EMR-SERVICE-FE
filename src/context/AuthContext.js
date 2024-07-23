import React, { createContext, useContext, useState } from 'react';
import { login } from '../services/authService'; // getUserDetails는 필요 없으므로 제거

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = async (loginId, password, role) => {
    try {
      const data = await login(loginId, password, role);
      setToken(data.token);
      setUser({ role: data.role }); // 로그인 후 반환된 데이터를 그대로 저장 (토큰, 역할 등 포함)
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
