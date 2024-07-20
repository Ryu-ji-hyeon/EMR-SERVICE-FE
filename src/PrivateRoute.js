import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken'); // 또는 다른 인증 상태 확인 로직

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
