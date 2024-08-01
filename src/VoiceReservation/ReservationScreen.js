import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ResulvationCalender from '../StandardReservation/ResulvationCalender';
import AvailableTimes from '../StandardReservation/AvailableTimes';
import ControlPanel from './ControlPanel';
import { useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const VoiceReservationSystem = () => {
  const [text, setText] = useState('');
  const { speak, cancel } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [currentStep, setCurrentStep] = useState(0);
  const [previousResponse, setPreviousResponse] = useState('');
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
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

  useEffect(() => {
    if (!listening && transcript) {
      handleVoiceCommand(transcript);
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript]);

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });

  const handleVoiceCommand = (command) => {
    switch (currentStep) {
      case 0:
        handleDepartmentSelection(command);
        break;
      case 1:
        handleDoctorSelection(command);
        break;
      case 2:
        handleDateSelection(command);
        break;
      case 3:
        handleTimeSelection(command);
        break;
      default:
        break;
    }
  };

  const handleDepartmentSelection = (command) => {
    // 부서 선택 로직
    setDepartment(command);  // 여기서는 단순히 명령을 부서로 설정
    speak({ text: `${command} 부서를 선택하셨습니다. 의사 이름을 말해주세요.` });
    setCurrentStep(1);
    // 실제 부서 기반 의사 목록 가져오는 로직 추가
  };

  const handleDoctorSelection = (command) => {
    // 의사 선택 로직
    setDoctor(command);  // 여기서는 단순히 명령을 의사 이름으로 설정
    speak({ text: `${command} 의사를 선택하셨습니다. 예약할 날짜를 말해주세요.` });
    setCurrentStep(2);
    // 실제 의사 기반 예약 가능한 날짜 가져오는 로직 추가
  };

  const handleDateSelection = (command) => {
    // 날짜 선택 로직
    const parsedDate = parseDate(command);
    if (parsedDate) {
      setDate(parsedDate);
      speak({ text: `${parsedDate} 날짜를 선택하셨습니다. 예약할 시간을 말해주세요.` });
      setCurrentStep(3);
    } else {
      speak({ text: '유효한 날짜를 입력해주세요.' });
      startListening();
    }
  };

  const handleTimeSelection = (command) => {
    // 시간 선택 로직
    const parsedTime = parseTime(command);
    if (parsedTime) {
      setTime(parsedTime);
      checkAvailability(date, parsedTime);
    } else {
      speak({ text: '유효한 시간을 입력해주세요.' });
      startListening();
    }
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
            <ControlPanel 
              handleSpeak={() => speak({ text })}
              handleStopSpeaking={cancel}
              handleStartListening={startListening}
              handleStopListening={SpeechRecognition.stopListening}
              handleReset={resetTranscript}
              listening={listening}
              transcript={transcript}
              handleUserResponse={handleVoiceCommand}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceReservationSystem;
