import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// 스타일 컴포넌트 정의
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

const Button = styled.button`
  width: 100%;
  max-width: 350px;
  padding: 1rem;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
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
  position: fixed; /* 화면 하단에 고정 */
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

const MemberUpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // CSRF 토큰 상태 추가
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalRedirect, setModalRedirect] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') setCurrentPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
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
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setModalMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setIsModalOpen(true);
      return;
    }

    const token = localStorage.getItem('accessToken');
    const csrfToken = await fetchCsrfToken();

    try {
      await axios.post(
        `${process.env.REACT_APP_API_SERVER}/api/member/updatePassword`,
        {
          patientPw: currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-XSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        }
      );
      setModalMessage('비밀번호가 성공적으로 변경되었습니다.');
      setModalRedirect('/member/profile'); // Redirect to profile after success
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error updating password:', error);
      setModalMessage('현재 비밀번호가 올바르지 않습니다.');
      setIsModalOpen(true);
    }
  };

  const handleGoBack = () => {
    navigate('/member/dashboard');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (modalRedirect) {
      navigate(modalRedirect);
    }
  };

  return (
    <ScreenWrapper>
      <MainContent>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
        <Title>비밀번호 변경</Title>
        <Form onSubmit={handleFormSubmit}>
          <InputGroup>
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <Input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={handleInputChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleInputChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              required
            />
          </InputGroup>
          <Button type="submit">비밀번호 변경</Button>
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

        {/* Modal for alerts */}
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <p>{modalMessage}</p>
              <ModalButton onClick={closeModal}>확인</ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </ScreenWrapper>
  );
};

export default MemberUpdatePassword;
