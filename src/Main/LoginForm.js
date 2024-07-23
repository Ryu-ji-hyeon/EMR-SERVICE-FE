import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginType, setLoginType] = useState('member'); // 로그인 타입 상태 추가
  const [errorMessage, setErrorMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  useEffect(() => {
    const apiServer = process.env.REACT_APP_API_SERVER;

    // CSRF 토큰을 서버에서 가져옵니다.
    axios.get(`${apiServer}/api/csrf-token`, { withCredentials: true })
      .then(response => setCsrfToken(response.data.token))
      .catch(error => console.error('Error fetching CSRF token:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLoginTypeChange = (e) => {
    setLoginType(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Reset error message before new attempt

    const apiServer = process.env.REACT_APP_API_SERVER;
    try {
      let endpoint = '';
      let loginData = {};

      if (loginType === 'member') {
        endpoint = '/api/member/login';
        loginData = {
          patientLoginId: credentials.username,
          patientPw: credentials.password
        };
      } else if (loginType === 'doctor') {
        endpoint = '/api/doctor/login';
        loginData = {
          doctorLoginId: credentials.username,
          doctorPw: credentials.password
        };
      }

      const response = await axios.post(`${apiServer}${endpoint}`, loginData, {
        headers: {
          'X-XSRF-TOKEN': csrfToken
        },
        withCredentials: true
      });

      console.log('로그인 성공:', response.data);
      alert('로그인이 성공적으로 완료되었습니다.');
      localStorage.setItem('accessToken', response.data.token); // 토큰 저장

      // 사용자 역할에 따라 다른 대시보드로 리디렉션
      await handleLogin(credentials.username, credentials.password, loginType); // AuthContext에 사용자 정보 저장

        if (response.data.role === 'MEMBER') {
          navigate('/member/dashboard');
        } else if (response.data.role === 'DOCTOR') {
          navigate('/doctor/dashboard');
        } else {
          console.error('알 수 없는 사용자 역할:', response.data.role);
        }
        } catch (error) {
        console.error('로그인 실패:', error);
        setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-dark text-white text-center">
              <h3>로그인</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="loginType">로그인 유형</label>
                  <select 
                    className="form-control" 
                    id="loginType" 
                    value={loginType} 
                    onChange={handleLoginTypeChange}
                  >
                    <option value="member">회원 로그인</option>
                    <option value="doctor">의사 로그인</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="username">아이디</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    name="username" 
                    placeholder="아이디" 
                    value={credentials.username}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">비밀번호</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    name="password" 
                    placeholder="비밀번호" 
                    value={credentials.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <button type="submit" className="btn btn-dark btn-block">로그인</button>
              </form>
            </div>
            <div className="card-footer text-center">
              <Link to="/home/choiceMember" className="btn btn-outline-info">회원가입</Link>
              <div className="mt-3">
                <a href="http://localhost:8080/api/v1/auth/oauth2/google" className="btn btn-outline-dark mx-1">Google</a>
                <a href="http://localhost:8080/api/v1/auth/oauth2/naver" className="btn btn-outline-dark mx-1">Naver</a>
                <a href="http://localhost:8080/api/v1/auth/oauth2/kakao" className="btn btn-outline-dark mx-1">Kakao</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
