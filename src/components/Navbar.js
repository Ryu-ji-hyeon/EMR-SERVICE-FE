import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const NavBar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/'); // 홈 화면으로 리디렉션
  };

  return (
    <NavBarContainer>
      <BrandLink to="/">EMR Service</BrandLink>
      <NavMenu>
        <NavList>
          {user ? (
            <>
              {user.role === 'MEMBER' && (
                <>
                  <NavItem>
                    <NavLink to="/reservation-choice">예약하기</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/member/reservations">예약 확인</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/member/prescriptions">처방전 확인</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/member/charts">내 차트 보기</NavLink>
                  </NavItem>
                </>
              )}
              {user.role === 'DOCTOR' && (
                <>
                  <NavItem>
                    <NavLink to="/doctor/reservations">예약 확인</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/doctor/prescribe">처방전 입력</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/doctor/charts">환자 차트 보기</NavLink>
                  </NavItem>
                </>
              )}
              <NavItem>
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink to="/home/loginForm">로그인</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/home/choiceMember">회원가입</NavLink>
              </NavItem>
            </>
          )}
        </NavList>
      </NavMenu>
    </NavBarContainer>
  );
};

export default NavBar;

const NavBarContainer = styled.nav`
  background-color: #343a40;  /* 어두운 배경색으로 설정 */
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 2px -2px gray;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BrandLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;  /* 흰색 텍스트 */
  text-decoration: none;

  &:hover {
    color: #d4d4d4; /* hover 시 색상 변경 */
  }
`;

const NavMenu = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 0.5rem;
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    text-align: center;
  }
`;

const NavItem = styled.li`
  margin-left: 1rem;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-bottom: 0.5rem;
  }
`;

const NavLink = styled(Link)`
  color: #ffffff;  /* 흰색 텍스트 */
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;

  &:hover {
    color: #343a40;  /* hover 시 텍스트 색상 변경 */
    background-color: #ffffff;  /* hover 시 배경색 변경 */
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;

  &:hover {
    color: #343a40;  /* hover 시 텍스트 색상 변경 */
    background-color: #ffffff;  /* hover 시 배경색 변경 */
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;
