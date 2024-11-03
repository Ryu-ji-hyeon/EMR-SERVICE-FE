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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e6e6e6;
  }
`;

// 회원 탈퇴 컴포넌트
const MemberDelete = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!password) {
      setModalMessage('비밀번호를 입력해 주세요.');
      setIsModalOpen(true);
      return;
    }

    setShowConfirmation(true); // Show confirmation modal
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    setShowConfirmation(false);

    try {
      // 회원 탈퇴 API 호출
      await axios.post(`${process.env.REACT_APP_API_SERVER}/api/member/delete`,
        { password },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-XSRF-TOKEN': await fetchCsrfToken(),
          },
          withCredentials: true,
        }
      );
      setModalMessage('회원 탈퇴가 완료되었습니다.');
      setIsModalOpen(true);
      localStorage.removeItem('accessToken');
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error deleting account:', error);
      setModalMessage('비밀번호가 올바르지 않습니다.');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, {
        withCredentials: true,
      });
      return response.data.token;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
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

        {/* Success/Error Modal */}
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <p>{modalMessage}</p>
              <ModalButton onClick={closeModal}>확인</ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <ModalOverlay>
            <ModalContent>
              <p>정말로 회원 탈퇴를 하시겠습니까?</p>
              <ModalButton onClick={confirmDeleteAccount}>예</ModalButton>
              <ModalButton onClick={closeConfirmation}>아니오</ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </ScreenWrapper>
  );
};

export default MemberDelete;