import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaPrescriptionBottleAlt, FaCalendarPlus, FaHome, FaUser, FaCog } from 'react-icons/fa';

// 스타일 컴포넌트 정의
const CardTitle = styled.h3`
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 8rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 5.5rem; /* 버튼 크기 조정: 세로 2rem, 가로 3rem */
  font-size: 1.5rem; /* 폰트 크기를 1.5rem으로 조정 */
  color: #fff;
  text-decoration: none;
  background-color: #007bff;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;
  width: 100%;
  max-width: 350px; /* 버튼 최대 너비를 350px로 조정 */

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  svg {
    margin-right: 12px; /* 아이콘과 텍스트 간의 간격 조정 */
    font-size: 1.8rem; /* 아이콘 크기도 증가 */
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 1.5rem; /* 모바일 화면에서 크기 조정 */
  }
`;


const CalendarTitle = styled.h4`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
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

const NavIcon = styled(Link)`
  font-size: 1.5rem;
  color: #007bff;
  text-decoration: none;
  text-align: center;

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

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  justify-content: center; /* 요소들이 중앙에 위치하도록 조정 */
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rem; /* 버튼 간의 간격을 줄임 */
  margin-bottom: 6rem; /* CalendarContainer와의 간격 조정 */
`;

const CalendarContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin-top: 0; /* 위 요소와의 간격을 없앰 */
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 16px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;
const MemberDashboard = () => {
  return (
    <ScreenWrapper>
      <MainContent>
        <Content>
          <CardTitle>환자 대시보드</CardTitle>
          <ButtonContainer>
            <NavLink to="/reservation-choice">
              <FaCalendarPlus />
              예약하기
            </NavLink>
            <NavLink to="/member/reservations">
              <FaCalendarCheck />
              예약 확인
            </NavLink>
            <NavLink to="/prescriptions">
              <FaPrescriptionBottleAlt />
              처방전 확인
            </NavLink>
          </ButtonContainer>
          <CalendarContainer>
            <CalendarTitle>예약 일정</CalendarTitle>
            <p>현재 예약된 일정이 없습니다.</p>
          </CalendarContainer>
        </Content>
        <BottomNavBar>
          <NavIcon to="/member/dashboard">
            <FaHome />
            <span>홈</span>
          </NavIcon>
          <NavIcon to="/reservation-choice">
            <FaCalendarCheck />
            <span>예약</span>
          </NavIcon>
          <NavIcon to="/member/profile">
            <FaUser />
            <span>프로필</span>
          </NavIcon>
          <NavIcon to="/">
            <FaCog />
            <span>로그아웃</span>
          </NavIcon>
        </BottomNavBar>
      </MainContent>
    </ScreenWrapper>
  );
};

export default MemberDashboard;
