// src/services/authService.js
import axios from 'axios';

// 로그인 API 호출
export const login = async (loginId, password, role) => {
  try {
    const apiServer = process.env.REACT_APP_API_SERVER;
    const endpoint = role === 'DOCTOR' ? `${apiServer}/api/doctor/login` : `${apiServer}/api/member/login`;
    const response = await axios.post(endpoint, { loginId, password });
    return response.data; // API에서 반환하는 데이터를 그대로 반환 (토큰, 역할 등)
  } catch (error) {
    throw new Error('로그인 실패: ' + (error.response ? error.response.data.message : error.message));
  }
};

// 사용자 정보를 가져오는 함수 (예시)
export const getUserDetails = async (token) => {
  try {
    const response = await axios.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('사용자 정보 가져오기 실패: ' + error.response.data.message);
  }
};
