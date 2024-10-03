import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 useNavigate 훅 사용
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';


const ReservationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ReservationItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ReservationDetail = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #555;

  strong {
    font-weight: bold;
    color: #333;
  }
`;

const ViewButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #2260ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #1c3faa;
  }
`;

const NoReservationsMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
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
  padding: 20rem 2rem;
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

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  const handleGoBack = () => {
    navigate('/member/dashboard');
  };

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true });
        setCsrfToken(response.data.token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();

    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const patientLoginId = decodedToken?.sub; // JWT에서 patientLoginId 추출

      // patientLoginId를 사용하여 patientId를 가져오는 API 호출
      axios.get(`${process.env.REACT_APP_API_SERVER}/api/member/patient-id`, {
        params: { loginId: patientLoginId },
        withCredentials: true
      })
      .then(response => {
        setPatientId(response.data); // patientId 설정
      })
      .catch(error => {
        console.error('Error fetching patient ID:', error);
      });
    }
  }, []);

  useEffect(() => {
    if (patientId && csrfToken) {
      axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-XSRF-TOKEN': csrfToken
        },
        withCredentials: true
      })
        .then(response => {
          if (Array.isArray(response.data)) {
            setReservations(response.data);
          } else {
            setReservations([]);
          }
        })
        .catch(error => {
          console.error('Error fetching reservations:', error);
          setReservations([]);
        });
    }
  }, [patientId, csrfToken]);

  const handleViewDetails = (reservationId) => {
    navigate('/reservation/details', { state: { reservationId } });
  };

  return (
    <ScreenContainer>
      <MainContent>
        {/* 뒤로 가기 버튼 추가 */}
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
      <Content>
        <h2 className="text-center mb-4">예약 내역</h2>
        <ReservationList>
          {reservations.length === 0 ? (
            <NoReservationsMessage>예약 내역이 없습니다.</NoReservationsMessage>
          ) : (
            reservations.map((reservation) => (
              <ReservationItem key={reservation.reservationId}>
                <ReservationDetail><strong>의사:</strong> {reservation.doctorName}</ReservationDetail>
                <ReservationDetail><strong>부서:</strong> {reservation.deptName}</ReservationDetail>
                <ReservationDetail><strong>날짜:</strong> {reservation.date}</ReservationDetail>
                <ReservationDetail><strong>시간:</strong> {reservation.time}</ReservationDetail>
                <ViewButton onClick={() => handleViewDetails(reservation.reservationId)}>
                  처방전 보기
                </ViewButton>
              </ReservationItem>
            ))
          )}
        </ReservationList>
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
          <NavIcon onClick={() => navigate('/profile')}>
            <FaUser />
            <span>프로필</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/')}>
            <FaCog />
            <span>로그아웃</span>
          </NavIcon>
        </BottomNavBar>
      </MainContent>
    </ScreenContainer>
  );
};

export default ReservationHistory;
