import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import styled from 'styled-components';
import { FaGoogle, FaLeaf, FaComment } from 'react-icons/fa';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';
// 스타일 컴포넌트 정의
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

const RadioGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const RadioLabel = styled.label`
  margin: 0 1rem;
  font-size: 1rem;
  color: #555;
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    margin: 0.5rem 0;
  }
`;

const RadioInput = styled.input`
  margin-right: 0.5rem;
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

  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0.5rem;
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

    @media (max-width: 480px) {
      font-size: 0.875rem;
      padding: 0.5rem;
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  font-size: 1.5rem;
  color: #007bff;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;

  &:hover {
    background-color: #e6e6e6;
  }
`;

const SignupForm = () => {
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    setError('');  // 라디오 버튼 선택 시 에러 메시지 제거
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userType) {
      setError('유형을 선택해주세요.');
    } else {
      if (userType === "의사") {
        navigate('/doctor/signup');
      } else {
        navigate('/member/signup');
      }
    }
  };

  const handleGoBack = () => {
    navigate('/home/loginForm');
  };
  return (
    <ScreenWrapper>
      <MainContent>
      <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
      <LoginFormWrapper>
        <h3>회원가입</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="userType"
                  value="의사"
                  checked={userType === '의사'}
                  onChange={handleUserTypeChange}
                />
                의사
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="userType"
                  value="환자"
                  checked={userType === '환자'}
                  onChange={handleUserTypeChange}
                />
                환자
              </RadioLabel>
            </RadioGroup>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Button type="submit">다음</Button>
          </FormGroup>
        </form>
        <CardFooter>
          <StyledLink to="/home/loginForm">로그인</StyledLink>
          <SocialLoginContainer>
            <a href="http://localhost:8080/api/v1/auth/oauth2/google">
              <FaGoogle /> Google
            </a>
            <a href="http://localhost:8080/api/v1/auth/oauth2/naver">
              <FaLeaf /> Naver
            </a>
            <a href="http://localhost:8080/api/v1/auth/oauth2/kakao">
              <FaComment /> Kakao
            </a>
          </SocialLoginContainer>
        </CardFooter>
        </LoginFormWrapper>
      </MainContent>
    </ScreenWrapper>
  );
};

export default SignupForm;
