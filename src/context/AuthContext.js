// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { loginService } from '../services/authService'; // 로그인 서비스 import

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleLogin = async (username, password, role, csrfToken) => {
    try {
      const loginData = role === 'DOCTOR' ? { doctorLoginId: username, doctorPw: password } : { patientLoginId: username, patientPw: password };
      const response = await loginService(loginData, role, csrfToken); // 로그인 서비스 호출
      console.log('handleLogin response:', response); // 디버깅 메시지 추가
      setUser({ name: response.message, role: response.role });
      localStorage.setItem('accessToken', response.token); // 토큰 저장
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error; // 로그인 실패 처리 로직 추가
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
