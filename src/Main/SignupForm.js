import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import styled from 'styled-components';
import { FaGoogle, FaLeaf, FaComment, FaArrowLeft } from 'react-icons/fa';

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
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
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
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
    setError('');
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
    <ModalOverlay>
      <ModalContainer>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
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
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SignupForm;
