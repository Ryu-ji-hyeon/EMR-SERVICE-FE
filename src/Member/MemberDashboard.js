import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import NavBar from '../components/NavBar'; // NavBar 컴포넌트 임포트

const CardTitle = styled.h3`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 1.25rem;
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  display: block;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #2260ff;
  text-decoration: none;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #ddd;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0.5rem;
    text-align: center;
  }
`;

const StyledNavBar = styled(NavBar)`
  margin-bottom: 2rem;
`;

const MemberDashboard = () => {
  return (
    <ScreenContainer>
      <Content>
        
        <CardTitle>환자 대시보드</CardTitle>
        <NavLink to="/reservation-choice">예약하기</NavLink>
        <NavLink to="/member/reservations">예약 확인</NavLink>
        <NavLink to="/member/prescriptions">처방전 확인</NavLink>
      </Content>
    </ScreenContainer>
  );
};

export default MemberDashboard;
