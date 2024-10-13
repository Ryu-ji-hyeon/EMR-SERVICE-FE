import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

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

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  background-color: #f9f9f9;
  padding: 1rem 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;

  strong {
    font-weight: bold;
    color: #333;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.75rem;
  }
`;

const ActionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 350px;
`;

const ActionItem = styled.li`
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.75rem;
  }
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  min-height: calc(100vh - 70px); /* BottomNavBar의 높이만큼 뺀 값 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 2rem;
  padding-bottom: 100px; /* BottomNavBar와 겹치지 않도록 */
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

const DoctorProfile = () => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [csrfToken, setCsrfToken] = useState(''); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchDoctorInfo = async () => {
        try {
          const csrfResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, {
            withCredentials: true,
          });
          setCsrfToken(csrfResponse.data.token);

          const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/me`, {
            headers: {
              'X-CSRF-TOKEN': csrfToken,
            },
            withCredentials: true,
          });
          setDoctorInfo(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching doctor info:', error);
          setLoading(false);
        }
      };

      fetchDoctorInfo();
    }, [csrfToken]);
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (!doctorInfo) {
      return <p>의사 정보를 불러오지 못했습니다.</p>;
    }
  
    return (
      <ScreenWrapper>
        <MainContent>
          <BackButton onClick={() => navigate('/doctor/dashboard')}>
            <FaArrowLeft />
          </BackButton>
          <Content>
            <Title>의사 프로필</Title>
            <InfoContainer>
              <InfoItem>
                <strong>이름:</strong> {doctorInfo.doctorName}
              </InfoItem>
              <InfoItem>
                <strong>부서:</strong> {doctorInfo.deptName}
              </InfoItem>
              <InfoItem>
                <strong>로그인 ID:</strong> {doctorInfo.doctorLoginId}
              </InfoItem>
            </InfoContainer>
            <ActionList>
              <ActionItem onClick={() => navigate('/doctor/doctorupdatepassword')}>
                비밀번호 변경
              </ActionItem>
              <ActionItem onClick={() => navigate('/doctor/delete')}>
                회원 탈퇴
              </ActionItem>
            </ActionList>
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
      </ScreenWrapper>
    );
  };

  
  export default DoctorProfile;
