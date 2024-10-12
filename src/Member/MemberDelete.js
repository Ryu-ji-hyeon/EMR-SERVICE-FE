import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// 스타일 정의
const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 350px;
`;

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const DeleteButton = styled.button`
  width: 100%;
  max-width: 350px;
  padding: 1rem;
  font-size: 1.2rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
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

const BottomNavBar = styled.div`
  width: 100%;
  max-width: 980px;
  height: 70px;
  background-color: #ffffff;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
  color: #007bff;
  text-decoration: none;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }

  span {
    font-size: 0.85rem;
    display: block;
    margin-top: 4px;
    color: #333;
  }

  @media (min-width: 768px) {
    font-size: 1.3rem;
    span {
      font-size: 1.1rem;
    }
  }
`;

// 회원 탈퇴 컴포넌트
const MemberDelete = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!password) {
        alert('비밀번호를 입력해 주세요.');
        return;
    }

    if (window.confirm('정말로 회원 탈퇴를 하시겠습니까?')) {
        setLoading(true);
        const token = localStorage.getItem('accessToken'); // JWT 토큰

        try {
            // 회원 탈퇴 API 호출 (POST 사용)
            await axios.post(`${process.env.REACT_APP_API_SERVER}/api/member/delete`, 
            {
              password // 비밀번호를 POST body로 전달
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // JWT 인증 토큰
                    'X-XSRF-TOKEN': await fetchCsrfToken(), // CSRF 토큰 전달
                },
                withCredentials: true, // 쿠키 전송 설정
            });
            alert('회원 탈퇴가 완료되었습니다.');
            localStorage.removeItem('accessToken'); // 토큰 삭제
            navigate('/'); // 메인 페이지로 리다이렉트
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('회원 탈퇴에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }
};


  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, {
        withCredentials: true, // 쿠키 사용 설정
      });
      return response.data.token;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    }
  };

  const handleGoBack = () => {
    navigate('/member/dashboard');
  };

  return (
    <ScreenWrapper>
      <MainContent>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
        <Title>회원 탈퇴</Title>
        <Form onSubmit={handleDeleteAccount}>
          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <DeleteButton type="submit" disabled={loading}>
            {loading ? '처리 중...' : '회원 탈퇴'}
          </DeleteButton>
        </Form>
        <BottomNavBar>
          <NavIcon onClick={() => navigate('/member/dashboard')}>
            <FaHome />
            <span>홈</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/reservation-choice')}>
            <FaCalendarCheck />
            <span>예약</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/member/profile')}>
            <FaUser />
            <span>프로필</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/')}>
            <FaCog />
            <span>로그아웃</span>
          </NavIcon>
        </BottomNavBar>
      </MainContent>
    </ScreenWrapper>
  );
};

export default MemberDelete;
