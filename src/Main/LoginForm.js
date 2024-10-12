import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaLeaf, FaComment } from 'react-icons/fa';

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1.1rem; /* 입력 크기 약간 증가 */
  color: #333;

  &:focus {
    outline: none;
    border-color: #2260ff;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1.1rem; /* 입력 크기 약간 증가 */
  color: #333;

  &:focus {
    outline: none;
    border-color: #2260ff;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1.2rem;
  background-color: #2260ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5rem;

  &:hover {
    background-color: #1c3faa;
  }
`;

const StyledLink = styled(Link)`
  color: #2260ff;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5rem;
    color: #333;
    text-decoration: none;
    font-size: 1rem;
    font-weight: bold;
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background-color: #f9f9f9;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f0f0f0;
    }

    svg {
      margin-right: 0.5rem;
    }
  }
`;

const CardFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  border-top: 1px solid #e6e6e6;
  padding-top: 1rem;

  a {
    color: #2260ff;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #2260ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #1c3faa;
  }
`;

const ScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f4f8;
  padding: 0 2rem;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 2rem;
  overflow: visible;
  position: relative;
`;

const LoginFormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 1px;
`;

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginType, setLoginType] = useState('member');
  const [errorMessage, setErrorMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true })
      .then((response) => setCsrfToken(response.data.token))
      .catch((error) => console.error('Error fetching CSRF token:', error));
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
    setErrorMessage('');

    try {
      const response = await handleLogin(credentials.username, credentials.password, loginType, csrfToken);

      console.log('로그인 성공:', response);
      setShowModal(true); 
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);

    if (loginType === 'member') {
      navigate(`/member/dashboard`);
    } else if (loginType === 'doctor') {
      navigate(`/doctor/dashboard`);
    }
  };

  return (
    <ScreenWrapper>
      <MainContent>
        <LoginFormWrapper>
          <h3>로그인</h3>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="loginType">로그인 유형</Label>
              <Select id="loginType" value={loginType} onChange={handleLoginTypeChange}>
                <option value="member">회원 로그인</option>
                <option value="doctor">의사 로그인</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="username">아이디</Label>
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="아이디"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="비밀번호"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </FormGroup>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Button type="submit">로그인</Button>
          </form>
          <CardFooter>
            아직 회원이 아니신가요? <StyledLink to="/home/choiceMember">회원가입</StyledLink>
            <SocialLoginContainer>
              <a href="http://localhost:8080/oauth2/callback/google">
                <FaGoogle /> Google
              </a>
              <a href="http://localhost:8080/oauth2/callback/naver">
                <FaLeaf /> Naver
              </a>
              <a href="http://localhost:8080/oauth2/callback/kakao">
                <FaComment /> Kakao
              </a>
            </SocialLoginContainer>
          </CardFooter>
        </LoginFormWrapper>

        {showModal && (
          <ModalOverlay>
            <ModalContainer>
              <h3>로그인 성공!</h3>
              <p>로그인이 성공적으로 완료되었습니다.</p>
              <ModalButton onClick={handleModalClose}>확인</ModalButton>
            </ModalContainer>
          </ModalOverlay>
        )}
      </MainContent>
    </ScreenWrapper>
  );
};

export default LoginForm;
