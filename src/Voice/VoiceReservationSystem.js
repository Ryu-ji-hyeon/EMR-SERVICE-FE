import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { jwtDecode } from 'jwt-decode';
import ResulvationCalender from './ResulvationCalender';
import DepartmentSelector from '../Doctor/DepartmentSelector';
import DoctorSelector from '../Doctor/DoctorSelector';
import './VoiceReservationSystem.css';
import AvailableTimes from './AvailableTimes';
import ControlPanel from './ControlPanel';

const VoiceReservationSystem = () => {
  const [text, setText] = useState('');
  const { speak, cancel } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [currentStep, setCurrentStep] = useState(0);
  const [previousResponse, setPreviousResponse] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
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
      const loggedInUserId =  decodedToken?.sub; 
      console.log("loggedInUserID: ", loggedInUserId);
      setPatientId(loggedInUserId);
    }
  }, []);

  const speakQuestion = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "ko-KR";
    window.speechSynthesis.speak(speech);
  };

  const askDateQuestion = () => {
    const questionText = '몇월 며칠 예약할래?';
    setText(questionText);
    speakQuestion(questionText);
  };

  const askTimeQuestion = () => {
    const questionText = '몇시에 예약하시겠습니까?';
    setText(questionText);
    speakQuestion(questionText);
  };

  const askAlternativeDateQuestion = () => {
    const questionText = '다른 날짜로 예약 하시겠습니까?';
    setText(questionText);
    speakQuestion(questionText);
  };

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleUserResponse = (response) => {
    const newResponse = response.replace(previousResponse, '').trim();
    setPreviousResponse(response);

    axios.post(`${process.env.REACT_APP_API_SERVER}/api/log`, { transcript: newResponse })
      .then(() => console.log('Transcript logged successfully'))
      .catch((error) => console.error('Error logging transcript:', error));

    if (currentStep === 0) {
      const parsedDate = parseDate(newResponse);
      if (parsedDate) {
        setDate(parsedDate);
        askTimeQuestion();
        setCurrentStep(1);
      } else {
        speakQuestion('유효한 날짜를 입력해주세요.');
        setText('유효한 날짜를 입력해주세요.');
        handleStartListening();
      }
    } else if (currentStep === 1) {
      const parsedTime = parseTime(newResponse);
      if (parsedTime) {
        setTime(parsedTime);
        checkAvailability(date, parsedTime);
      } else {
        speakQuestion('유효한 시간을 입력해주세요.');
        setText('유효한 시간을 입력해주세요.');
        handleStartListening();
      }
    } else if (currentStep === 2) {
      if (newResponse.includes('네')) {
        askDateQuestion();
        setCurrentStep(0);
      } else if (newResponse.includes('아니오') || newResponse.includes('아니요')) {
        speakQuestion('예약을 취소합니다.');
        setText('예약을 취소합니다.');
        setCurrentStep(3);
      }
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
        'Authorization': `Bearer ${token}`
      },
      params: { doctorId: selectedDoctor?.doctorId, date },
      withCredentials: true
    })
      .then((response) => {
        if (response.data.includes(time)) {
          makeReservation(date, time);
        } else {
          speakQuestion('이미 예약이 있습니다. 다른 시간을 선택해주세요.');
          setText('이미 예약이 있습니다. 다른 시간을 선택해주세요.');
          setCurrentStep(1);
          handleStartListening();
        }
      })
      .catch((error) => {
        console.error('Error checking availability:', error);
        speakQuestion('예약 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
        setText('예약 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
        handleStartListening();
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
        speakQuestion('예약이 확정되었습니다.');
        setText('예약이 확정되었습니다.');
        setAvailableTimes(prevTimes => prevTimes.filter(t => t !== time));
        setCurrentStep(3);
      })
      .catch((error) => {
        console.error('Error making reservation:', error);
        speakQuestion('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
        setText('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
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
      setTime(time);
      checkAvailability(selectedDate, time);
    }
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedDoctor(null);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setAvailableTimes([]);
    fetchFullyBookedDates(doctor.doctorId);
  };

  const fetchFullyBookedDates = (doctorId) => {
    const token = localStorage.getItem('accessToken');
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/fully-booked-dates`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken
      },
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

  return (
    <div style={{ display: 'flex', padding: '20px', flexDirection: 'column' }}>
      <h1>음성 인식 예약 시스템</h1>
      <DepartmentSelector onSelect={handleDepartmentSelect} />
      {selectedDepartment && (
        <DoctorSelector department={selectedDepartment} onSelect={handleDoctorSelect} />
      )}
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
              handleStartListening={handleStartListening}
              handleStopListening={handleStopListening}
              handleReset={resetTranscript}
              listening={listening}
              transcript={transcript}
              speakQuestion={speakQuestion}
              handleUserResponse={handleUserResponse}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceReservationSystem;
