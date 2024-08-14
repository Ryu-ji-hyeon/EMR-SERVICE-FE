import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';

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

const DoctorDashboard = () => {
  return (
    <ScreenContainer>
      <Content>
        <CardTitle>의사 대시보드</CardTitle>
        <NavLink to="/doctor/reservations">예약 확인</NavLink>
        <NavLink to="/doctor/prescribe">처방전 입력</NavLink>
      </Content>
    </ScreenContainer>
  );
};

export default DoctorDashboard;
