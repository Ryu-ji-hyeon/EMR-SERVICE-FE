import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResulvationCalender from '../VoiceReservation/ResulvationCalender';
import AvailableTimes from './AvailableTimes';
import { useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const VoiceReservationSystem = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const location = useLocation();
  const { selectedDoctor } = location.state || {};
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
      console.log("Decoded Token: ", decodedToken); 
      const loggedInUserId = decodedToken?.sub; 
      console.log("loggedInUserID: ", loggedInUserId);
      setPatientId(loggedInUserId);
    }
  }, []);

  const parseDate = (response) => {
    const match = response.match(/\d+/g);
    if (match && match.length >= 2) {
      const [month, day] = match;
      const year = new Date().getFullYear();
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
  };

  const parseTime = (response) => {
    const match = response.match(/\d{1,2}/);
    if (match) {
      return `${match[0].padStart(2, '0')}:00`;
    }
    return null;
  };

  const checkAvailability = (date, time) => {
    const token = localStorage.getItem('accessToken');
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/available-times`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken
      },
      params: { doctorId: selectedDoctor?.doctorId, date },
      withCredentials: true
    })
      .then((response) => {
        if (response.data.includes(time)) {
          makeReservation(date, time);
        } else {
          speak({ text: '이미 예약이 있습니다. 다른 시간을 선택해주세요.' });
          setCurrentStep(3);
          startListening();
        }
      })
      .catch((error) => {
        console.error('Error checking availability:', error);
        speak({ text: '예약 확인 중 오류가 발생했습니다. 다시 시도해주세요.' });
        startListening();
      });
  };

  const makeReservation = (date, time) => {
    const token = localStorage.getItem('accessToken');
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/reservations/reserve`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken
      },
      params: { doctorId: selectedDoctor?.doctorId, patientId, date, time },
      withCredentials: true
    })
      .then((response) => {
        speak({ text: '예약이 확정되었습니다.' });
        setAvailableTimes(prevTimes => prevTimes.filter(t => t !== time));
        setCurrentStep(4);
      })
      .catch((error) => {
        console.error('Error making reservation:', error);
        speak({ text: '예약 중 오류가 발생했습니다. 다시 시도해주세요.' });
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
    const dayOfWeek = date.getDay();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);

    if ([0, 2, 4, 6].includes(dayOfWeek)) {
      setAvailableTimes([]);
    } else {
      fetchAvailableTimes(selectedDoctor?.doctorId, formattedDate);
    }
  };

  const handleTimeClick = (time) => {
    const confirmReservation = window.confirm('예약하시겠습니까?');
    if (confirmReservation) {
      checkAvailability(selectedDate, time);
    }
  };

  return (
    <div style={{ display: 'flex', padding: '20px', flexDirection: 'column' }}>
      <h1>음성 인식 예약 시스템</h1>
      <button onClick={startListening} className="btn btn-dark mb-3">Start Voice Reservation</button>
      <p>{transcript}</p>
      {selectedDoctor && (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
          <div style={{ flex: 1 }}>
            <ResulvationCalender 
              onDateClick={handleDateClick} 
              fullyBookedDates={fullyBookedDates}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <AvailableTimes 
              availableTimes={availableTimes} 
              onTimeClick={handleTimeClick} 
              selectedDate={selectedDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceReservationSystem;