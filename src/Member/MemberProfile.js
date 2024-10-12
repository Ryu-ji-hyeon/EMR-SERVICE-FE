import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

const MemberProfile = () => {
    const [memberInfo, setMemberInfo] = useState(null);
    const [csrfToken, setCsrfToken] = useState(''); // CSRF 토큰 상태 추가
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      // CSRF 토큰 가져오기
      const fetchCsrfToken = async () => {
        try {
          const csrfResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, {
            withCredentials: true,  // 인증된 요청에 필요한 옵션
          });
          setCsrfToken(csrfResponse.data.token);  // CSRF 토큰 상태에 저장
        } catch (error) {
          console.error('Error fetching CSRF token:', error);
        }
      };
  
      // 회원 정보 가져오기
      const fetchMemberInfo = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/member/me`, {
            headers: {
              'X-CSRF-TOKEN': csrfToken,  // CSRF 토큰을 헤더에 추가
            },
            withCredentials: true,  // 쿠키와 함께 요청 전송
          });
          setMemberInfo(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching member info:', error);
          setLoading(false);
        }
      };
  
      fetchCsrfToken();
      fetchMemberInfo();
    }, [csrfToken]);  // CSRF 토큰을 가져온 후 회원 정보를 요청
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (!memberInfo) {
      return <p>회원 정보를 불러오지 못했습니다.</p>;
    }
  
    const handleGoBack = () => {
      navigate('/member/dashboard');
    };
  
    return (
      <ScreenWrapper>
        <MainContent>
          <BackButton onClick={handleGoBack}>
            <FaArrowLeft />
          </BackButton>
          <Content>
            <Title>내 프로필</Title>
            <InfoContainer>
              <InfoItem>
                <strong>이름:</strong> {memberInfo.patientName}
              </InfoItem>
              <InfoItem>
                <strong>성별:</strong> {memberInfo.gender}
              </InfoItem>
              <InfoItem>
                <strong>혈액형:</strong> {memberInfo.bloodType}
              </InfoItem>
              <InfoItem>
                <strong>로그인 ID:</strong> {memberInfo.patientLoginId}
              </InfoItem>
            </InfoContainer>
            <ActionList>
              <ActionItem onClick={() => navigate('/member/edit')}>
                회원 정보 수정
              </ActionItem>
              <ActionItem onClick={() => navigate('/member/memberupdatepassword')}>
                비밀번호 변경
              </ActionItem>
              <ActionItem onClick={() => navigate('/member/delete')}>
                회원 탈퇴
              </ActionItem>
            </ActionList>
          </Content>
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
  
  export default MemberProfile;
