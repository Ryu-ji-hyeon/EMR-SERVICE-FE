import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ResulvationCalender from './ResulvationCalender';
import AvailableTimes from './AvailableTimes';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';


const Title = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const CompactCalendar = styled(ResulvationCalender)`
  .rbc-calendar {
    font-size: 0.875rem;
    max-width: 100%;
    min-width: 100%;
    margin: 0 auto;
  }

  .rbc-header {
    padding: 4px;
  }

  .rbc-day-bg {
    padding: 2px;
  }

  .rbc-event {
    padding: 2px;
  }

  .rbc-date-cell {
    padding: 4px;
  }

  .rbc-row-content {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .rbc-row {
    display: flex;
    flex-direction: row;
  }

  .rbc-row-segment {
    flex: 1;
  }
`;

const CompactTimes = styled(AvailableTimes)`
  button {
    padding: 5px 10px;
    margin: 3px 0;
    font-size: 0.75rem;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e6e6e6;
  }
`;


const StandardReservation = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const location = useLocation();
  const { selectedDoctor } = location.state || {};
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoBack = () => {
    navigate('/standard-reservation');
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
      const loggedInUserId = decodedToken?.sub;

      axios.get(`${process.env.REACT_APP_API_SERVER}/api/member/patient-id`, {
        params: { loginId: loggedInUserId },
        withCredentials: true
      })
      .then((response) => {
        setPatientId(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patient ID:', error);
      });
    }

    if (selectedDoctor) {
      fetchFullyBookedDates(selectedDoctor.doctorId);
    }
  }, [selectedDoctor]);

  const fetchFullyBookedDates = (doctorId) => {
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/fully-booked-dates`, {
      params: { doctorId },
      withCredentials: true
    })
    .then((response) => {
      setFullyBookedDates(response.data);
    })
    .catch((error) => {
      console.error('Error fetching fully booked dates:', error);
    });
  };

  const fetchAvailableTimes = (doctorId, date) => {
    const token = localStorage.getItem('accessToken');
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/available-times`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken
      },
      params: { doctorId, date },
      withCredentials: true
    })
    .then((response) => {
      setAvailableTimes(response.data);
    })
    .catch((error) => {
      console.error('Error fetching available times:', error);
    });
  };

  const handleDateClick = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);
    fetchAvailableTimes(selectedDoctor.doctorId, formattedDate);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setIsModalOpen(true); // Show the confirmation modal
  };

  const confirmReservation = () => {
    setIsModalOpen(false);
    checkAvailability(selectedDate, selectedTime);
  };

  const checkAvailability = (date, time) => {
    const token = localStorage.getItem('accessToken');
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/check`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken
      },
      params: { doctorId: selectedDoctor.doctorId, date, time },
      withCredentials: true
    })
    .then((response) => {
      if (response.data.available) {
        makeReservation(date, time);
      } else {
        alert('이미 예약이 있습니다. 다른 시간을 선택해주세요.');
      }
    })
    .catch((error) => {
      console.error('Error checking availability:', error);
      alert('예약 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
    });
  };

  const makeReservation = (date, time) => {
    const token = localStorage.getItem('accessToken');

    axios.post(`${process.env.REACT_APP_API_SERVER}/api/reservations/reserve`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json'
      },
      params: {
        doctorId: selectedDoctor.doctorId,
        patientId: patientId,
        date,
        time
      },
      withCredentials: true
    })
    .then((response) => {
      alert('예약이 확정되었습니다.');
      setAvailableTimes(prevTimes => prevTimes.filter(t => t !== time));
      navigate('/member/reservations');
    })
    .catch((error) => {
      console.error('Error making reservation:', error);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    });
  };

  return (
    <ScreenContainer>
      <MainContent>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
        <Content>
          <Title>일반 예약 시스템</Title>
          {selectedDoctor && (
            <Layout>
              <CompactCalendar onDateClick={handleDateClick} fullyBookedDates={fullyBookedDates} />
              <CompactTimes availableTimes={availableTimes} onTimeClick={handleTimeClick} selectedDate={selectedDate} />
            </Layout>
          )}
        </Content>

        {/* Confirmation Modal */}
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <p>선택하신 시간 {selectedTime}으로 예약하시겠습니까?</p>
              <div>
                <ModalButton onClick={confirmReservation}>예</ModalButton>
                <ModalButton onClick={() => setIsModalOpen(false)}>아니오</ModalButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

      {!isModalOpen && (
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
              )}
            </MainContent>
          </ScreenContainer>
  );
};

export default StandardReservation;
