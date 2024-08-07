import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken'); // 토큰으로 인증 여부 확인

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
