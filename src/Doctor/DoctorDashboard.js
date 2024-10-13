import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaCalendarCheck, FaPrescriptionBottleAlt, FaCalendarPlus, FaHome, FaUser, FaCog } from 'react-icons/fa';

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
  padding: 4rem 5.5rem;
  font-size: 1.5rem;
  color: #fff;
  text-decoration: none;
  background-color: #007bff;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;
  width: 100%;
  max-width: 350px;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  svg {
    margin-right: 12px;
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 1.5rem;
  }
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  min-height: calc(100vh - 70px); /* BottomNavBar 높이를 뺀 값 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20rem 2rem;
  overflow: visible;
  position: relative;
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
  z-index: 1000; /* 다른 요소보다 앞에 위치 */
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

const DoctorDashboard = () => {
  return (
    <ScreenContainer>
      <MainContent>
        <Content>
          <CardTitle>의사 대시보드</CardTitle>
          <NavLink to="/doctor/reservations">예약 확인</NavLink>
          <NavLink to="/doctor/prescribe">처방전 입력</NavLink>
        </Content>

        <BottomNavBar>
          <NavIcon to="/doctor/dashboard">
            <FaHome />
            <span>홈</span>
          </NavIcon>
          <NavIcon to="/doctor/reservations">
            <FaCalendarCheck />
            <span>예약 확인</span>
          </NavIcon>
          <NavIcon to="/doctor/profile">
            <FaUser />
            <span>프로필</span>
          </NavIcon>
          <NavIcon to="/">
            <FaCog />
            <span>로그아웃</span>
          </NavIcon>
        </BottomNavBar>
      </MainContent>
    </ScreenContainer>
  );
};

export default DoctorDashboard;
