import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ $isCompleted }) => ($isCompleted ? '#28a745' : '#2260ff')};
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${({ $isCompleted }) => ($isCompleted ? '#218838' : '#1c3faa')};
  }
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ffc107;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 1rem;

  &:hover {
    background-color: #e0a800;
  }
`;

const NoReservationsMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  min-height: calc(100vh - 70px); /* BottomNavBar의 높이만큼 뺀 값 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 5rem 2rem;
  padding-bottom: 100px; /* BottomNavBar와 겹치지 않도록 공간 확보 */
  overflow: visible;
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
  position: fixed;
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

const DoctorReservations = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/doctor/dashboard');
  };

  useEffect(() => {
    const fetchCsrfTokenAndDoctorId = async () => {
      try {
        const csrfResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true });
        setCsrfToken(csrfResponse.data.token);

        const token = localStorage.getItem('accessToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          const loggedInUserId = decodedToken?.sub;

          const doctorResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/doctor-id`, {
            params: { loginId: loggedInUserId },
            withCredentials: true,
          });
          setDoctorId(doctorResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCsrfTokenAndDoctorId();
  }, []);

  useEffect(() => {
    if (doctorId && selectedDate) {
      fetchReservationsByDate();
    }
  }, [doctorId, selectedDate]);

  const fetchReservationsByDate = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/doctor/${doctorId}/date`, {
        params: { date: formattedDate },
        headers: { 'X-XSRF-TOKEN': csrfToken },
        withCredentials: true,
      });

      const reservationsWithStatus = await Promise.all(
        response.data.map(async (reservation) => {
          const prescriptionStatus = await fetchPrescriptionStatus(reservation.reservationId);
          return { ...reservation, isPrescribed: prescriptionStatus };
        })
      );
      setReservations(reservationsWithStatus);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchPrescriptionStatus = async (reservationId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/prescriptions/status/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-XSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error checking prescription status:', error);
      return false;
    }
  };

  const handlePrescriptionClick = async (reservationId, isPrescribed) => {
    if (!reservationId) {
      console.error('Invalid reservation ID:', reservationId);
      return;
    }

    if (!isPrescribed) {
      navigate('/doctor/prescribe', { state: { reservationId } });
    } else {
      navigate('/reservation/details', { state: { reservationId } });
    }

    // 처방 상태 업데이트
    await updateReservationStatus(reservationId);
  };

  const updateReservationStatus = async (reservationId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/prescriptions/status/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-XSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data) {
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.reservationId === reservationId ? { ...reservation, isPrescribed: response.data } : reservation
          )
        );
      }
    } catch (error) {
      console.error('Error updating prescription status:', error);
    }
  };

  const handleEditClick = (reservationId) => {
    navigate('/doctor/edit-prescription', { state: { reservationId } });
  };

  return (
    <ScreenContainer>
      <MainContent>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
        <Content>
          <Title>날짜별 예약 환자 목록</Title>

          <DatePickerWrapper>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              inline
            />
          </DatePickerWrapper>

          {reservations.length > 0 ? (
            <ReservationList>
              {reservations.map((reservation) => (
                <ReservationItem key={reservation.reservationId}>
                  <div>
                    <ReservationDetail>
                      <strong>환자 이름:</strong> {reservation.patientName}
                    </ReservationDetail>
                    <ReservationDetail>
                      <strong>예약 시간:</strong> {reservation.time}
                    </ReservationDetail>
                  </div>
                  <div>
                    <ActionButton
                      $isCompleted={reservation.isPrescribed}
                      onClick={() => handlePrescriptionClick(reservation.reservationId, reservation.isPrescribed)}
                    >
                      {reservation.isPrescribed ? '처방 완료' : '처방전 입력'}
                    </ActionButton>
                    {reservation.isPrescribed && (
                      <EditButton onClick={() => handleEditClick(reservation.reservationId)}>수정</EditButton>
                    )}
                  </div>
                </ReservationItem>
              ))}
            </ReservationList>
          ) : (
            <NoReservationsMessage>선택한 날짜에 예약된 환자가 없습니다.</NoReservationsMessage>
          )}
        </Content>

        <BottomNavBar>
          <NavIcon onClick={() => navigate('/doctor/dashboard')}>
            <FaHome />
            <span>홈</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/doctor/reservations')}>
            <FaCalendarCheck />
            <span>예약 확인</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/doctor/profile')}>
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

export default DoctorReservations;
