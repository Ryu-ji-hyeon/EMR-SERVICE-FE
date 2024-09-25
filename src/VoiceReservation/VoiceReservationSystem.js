import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ResulvationCalender from '../StandardReservation/ResulvationCalender';
import AvailableTimes from '../StandardReservation/AvailableTimes';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;
const CalendarContainer = styled.div`
  margin-bottom: 30px;
  width: 100%;
  max-width: 500px;
`;

const AvailableTimesContainer = styled.div`
  margin-bottom: 30px;
  width: 100%;
  max-width: 500px;
`;
const ReservationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Button = styled.button`
  width: 100%;
  max-width: 500px;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  background-color: #2260ff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0f5bb5;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.75rem;
  }
`;

const ControlPanelContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Transcript = styled.p`
  margin-top: 20px;
  font-size: 16px;
  color: #333;
  word-break: break-word;
`;

const VoiceReservationSystem = () => {
  const { speak, cancel } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [csrfToken, setCsrfToken] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const location = useLocation();
  const { selectedDoctor } = location.state || {};
  const [patientId, setPatientId] = useState(null);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [recognizedText, setRecognizedText] = useState(''); // 인식된 텍스트

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

      if (selectedDoctor) {
        fetchFullyBookedDates(selectedDoctor.doctorId);
      }
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (!listening && transcript) {
      setRecognizedText(transcript); // 실시간으로 인식된 텍스트 저장
      handleVoiceCommand(transcript);
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript]);

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });

  const handleStopListening = () => {
    SpeechRecognition.stopListening(); 
    if (currentStep === 2) {
      handleDateSelection(recognizedText); // 날짜 선택
    } else if (currentStep === 3) {
      handleTimeSelection(recognizedText); // 시간 선택
    }
    setRecognizedText('');
  };

  // 음성 명령에 따른 처리
  const handleVoiceCommand = (command) => {
      if (currentStep === 2) {
        handleDateSelection(command);
      } else if (currentStep === 3) {
        handleTimeSelection(command);
      }
  };

  const startVoiceReservation = () => {
    speak({ text: '예약 날짜와 시간 선택하는 화면입니다. 예약할 날짜를 말씀해주세요.' });
    setCurrentStep(2); // 날짜 선택 단계로 이동
    startListening();
  };

  const handleDateClick = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);
    fetchAvailableTimes(selectedDoctor?.doctorId, formattedDate);
  };
  // 날짜 선택
  const handleDateSelection = (command) => {
    const parsedDate = parseDate(command);
    if (parsedDate) {
      setSelectedDate(parsedDate);
      speak({ text: `${parsedDate} 날짜를 선택하셨습니다. 예약할 시간을 말해주세요.` });
      fetchAvailableTimes(selectedDoctor?.doctorId, parsedDate);
      setCurrentStep(3); // 시간 선택 단계로 이동
    } else {
      startListening();
    }
  };
  // 시간 선택
  const handleTimeSelection = (command) => {
    const parsedTime = parseTime(command);
    if (parsedTime) {
      checkAvailability(selectedDate, parsedTime);
    } else {
      speak({ text: '유효한 시간을 입력해주세요.' });
      startListening();
    }
  };

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

  const checkAvailability = (date, time) => {
    const token = localStorage.getItem('accessToken');
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/check`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken
      },
      params: { doctorId: selectedDoctor?.doctorId, date, time },
      withCredentials: true
    })
      .then((response) => {
        if (response.data.available) {
          makeReservation(date, time);
        } else {
          speak({ text: '이미 예약이 있습니다. 다른 시간을 선택해주세요.' });
          startListening();
        }
      })
      .catch((error) => {
        console.error('Error checking availability:', error);
        speak({ text: '예약 확인 중 오류가 발생했습니다. 다시 시도해주세요.' });
        startListening();
      });
  };

const handleTimeClick = (time) => {
    const confirmReservation = window.confirm('예약하시겠습니까?');
    if (confirmReservation) {
      checkAvailability(selectedDate, time);
    }
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
        doctorId: selectedDoctor?.doctorId,
        patientId: patientId,
        date,
        time
      },
      withCredentials: true
    })
      .then(() => {
        speak({ text: '예약이 확정되었습니다.' });
        setAvailableTimes(prevTimes => prevTimes.filter(t => t !== time));
        navigate('/member/reservations');
      })
      .catch((error) => {
        console.error('Error making reservation:', error);
        speak({ text: '예약 중 오류가 발생했습니다. 다시 시도해주세요.' });
      });
  };

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

  return (
    <ReservationContainer>
      <Title>음성 인식 예약 시스템</Title>
	
<CalendarContainer>
      <ResulvationCalender 
              onDateClick={handleDateClick} 
              fullyBookedDates={fullyBookedDates}
            />
      </CalendarContainer>
      <AvailableTimesContainer>
            <AvailableTimes 
              availableTimes={availableTimes} 
              onTimeClick={handleTimeClick} 
              selectedDate={selectedDate}
            />
      </AvailableTimesContainer>
      <Transcript>
        <strong>인식된 텍스트 :</strong> {recognizedText}
      </Transcript>
      <ControlPanelContainer>
        <Button onClick={startVoiceReservation}>음성 예약 시작</Button>
        <Button onClick={handleStopListening}>응답 종료</Button>
      </ControlPanelContainer>
    </ReservationContainer>
  );
};

export default VoiceReservationSystem;
