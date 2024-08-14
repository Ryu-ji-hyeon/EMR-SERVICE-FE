import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ResulvationCalender from './ResulvationCalender';
import AvailableTimes from './AvailableTimes';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';

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

const StandardReservation = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const location = useLocation();
  const { selectedDoctor } = location.state || {};
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);

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
    const confirmReservation = window.confirm('예약하시겠습니까?');
    if (confirmReservation) {
      checkAvailability(selectedDate, time);
    }
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
      <Content>
        <Title>일반 예약 시스템</Title>
        {selectedDoctor && (
          <Layout>
            <CompactCalendar onDateClick={handleDateClick} fullyBookedDates={fullyBookedDates} />
            <CompactTimes availableTimes={availableTimes} onTimeClick={handleTimeClick} selectedDate={selectedDate} />
          </Layout>
        )}
      </Content>
    </ScreenContainer>
  );
};

export default StandardReservation;
