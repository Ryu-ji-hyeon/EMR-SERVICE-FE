import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleLogin = async (username, password, loginType, csrfToken) => {
    try {
      let endpoint = '';
      let loginData = {};

      if (loginType === 'member') {
        endpoint = '/api/member/login';
        loginData = {
          patientLoginId: username,
          patientPw: password
        };
      } else if (loginType === 'doctor') {
        endpoint = '/api/doctor/login';
        loginData = {
          doctorLoginId: username,
          doctorPw: password
        };
      }

      const response = await axios.post(`${process.env.REACT_APP_API_SERVER}${endpoint}`, loginData, {
        headers: {
          'X-XSRF-TOKEN': csrfToken
        },
        withCredentials: true
      });

      const { role, token, patientId } = response.data;

      setUser({ username, role });
      localStorage.setItem('accessToken', token);
      if (role === 'MEMBER') {
        localStorage.setItem('patientId', patientId); // 서버에서 반환한 patientId 저장
      }
      return response.data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw new Error('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('patientId'); // 로그아웃 시 patientId 제거
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
