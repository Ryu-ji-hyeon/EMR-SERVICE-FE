import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import styled from 'styled-components';
import { FaGoogle, FaLeaf, FaComment } from 'react-icons/fa'; 
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';

const FormGroup = styled.div`
  margin-bottom: 1rem;
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
  
  /* 반응형 디자인을 위한 미디어 쿼리 */
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

  /* 반응형 디자인을 위한 미디어 쿼리 */
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
  padding: 0.75rem;
  background-color: #2260ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #1c3faa;
  }

  /* 반응형 디자인을 위한 미디어 쿼리 */
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

    /* 반응형 디자인을 위한 미디어 쿼리 */
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

  return (
    <ScreenContainer>
      <Content>
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
      </Content>
    </ScreenContainer>
  );
};

export default SignupForm;
