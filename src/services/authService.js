// src/services/authService.js
import axios from 'axios';

// 로그인 API 호출
export const loginService = async (loginData, role, csrfToken) => {
  try {
    const endpoint = role === 'DOCTOR' ? `${process.env.REACT_APP_API_SERVER}/api/doctor/login` : `${process.env.REACT_APP_API_SERVER}/api/member/login`;
    const response = await axios.post(endpoint, loginData, {
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken // CSRF 토큰 추가
      },
      withCredentials: true
    });
    console.log('loginService response:', response.data); // 디버깅 메시지 추가
    return response.data; // API에서 반환하는 데이터를 그대로 반환 (토큰, 역할 등)
  } catch (error) {
    console.error('loginService error:', error.response); // 에러 메시지 추가
    throw new Error('로그인 실패: ' + (error.response ? error.response.data.message : error.message));
  }
};
