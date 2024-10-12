import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';

// 스타일 컴포넌트 정의
const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Card = styled.div`
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 17rem; /* 상단 여백을 더 크게 설정하여 버튼들을 아래로 내림 */
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15rem;
    justify-content: space-evenly;
  }
`;


const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.5rem 4rem; /* 버튼 크기 조정 */
  font-size: 1.2rem;
  color: #fff;
  border: none;
  text-decoration: none;
  background-color: #007bff;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;
  width: 100%;
  max-width: 300px;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &.primary {
    background-color: #007bff;

    &:hover {
      background-color: #0056b3;
    }
  }

  &.secondary {
    background-color: #6c757d;

    &:hover {
      background-color: #5a6268;
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 1rem;
  }
`;
const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  min-height: 100vh; /* 높이 설정을 화면 전체로 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 상단부터 배치 */
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem 2rem;
  overflow: visible; /* 요소 잘리지 않도록 설정 */
  position: relative;
`;

// BackButton 스타일 정의
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


const ScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f4f8;
  padding: 0 2rem;
`;



const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// BottomNavBar 스타일 정의
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

// NavIcon 스타일 정의
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

const ReservationChoice = () => {
  const navigate = useNavigate();

  const handleVoiceReservation = () => {
    navigate('/Voice/VoiceGuide');
  };

  const handleStandardReservation = () => {
    navigate('/standard-reservation');
  };

  const handleGoBack = () => {
    navigate('/member/dashboard');
  };

  return (
    <ScreenWrapper>
      <MainContent>
        <Content>
          <BackButton onClick={handleGoBack}>
            <FaArrowLeft />
          </BackButton>
          <Title>예약 방법 선택</Title>
          {/* ButtonContainer 스타일을 적용하여 버튼을 MemberDashboard와 동일하게 배치 */}
          <ButtonContainer>
            <Button className="primary" onClick={handleVoiceReservation}>
              음성 안내 예약
            </Button>
            <Button className="secondary" onClick={handleStandardReservation}>
              일반 예약
            </Button>
          </ButtonContainer>
        </Content>
        {/* 하단 네비게이션 바 추가 */}
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

export default ReservationChoice;
