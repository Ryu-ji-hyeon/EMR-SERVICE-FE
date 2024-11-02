import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ResulvationCalender from '../StandardReservation/ResulvationCalender';
import AvailableTimes from '../StandardReservation/AvailableTimes';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft, FaMicrophone } from 'react-icons/fa';

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
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  flex-direction: column;
  margin-top: 20px;
`;

const TranscriptContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
`;

const CurrentTranscript = styled.div`
  background-color: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #1976d2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 10px;
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
const ResponseList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;

  li {
    background-color: #f9f9f9;
    margin-bottom: 0.5rem;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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
  const [isConfirmingReservation, setIsConfirmingReservation] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [userCommands, setUserCommands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedTime, setSelectedTime] = useState(null);

  const handleGoBack = () => {
    navigate('/Voice/DepartmentDoctorSelection'); // ReservationChoice로 이동
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

      if (selectedDoctor) {
        fetchFullyBookedDates(selectedDoctor.doctorId);
      }
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (!listening && transcript) {
      // Handle the command if transcript is available
      handleVoiceCommand(transcript.trim());
      setRecognizedText(transcript);
      setUserCommands(prevCommands => [...prevCommands, transcript]);
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript]);

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    }
    setIsListening(!isListening);
  };

  const handleReset = () => {
    resetTranscript();
    setRecognizedText('');
    setUserCommands([]);
    setCurrentStep(0); // Reset to the first step
  };

  const startVoiceReservation = () => {
    speak({ text: '예약 날짜와 시간 선택하는 화면입니다. 예약할 날짜를 말씀해주세요.' });
    setCurrentStep(2); // Move to the date selection step
    startListening();
  };

  const handleVoiceCommand = (command) => {
    console.log("Current Step:", currentStep, "Recognized Command:", command);

    if (isConfirmingReservation) {
      // Handle reservation confirmation step
      if (command.includes('네') || command.includes('예') || command.includes('좋습니다')) {
        setIsConfirmingReservation(false);
        if (pendingReservation) {
          makeReservation(pendingReservation.date, pendingReservation.time);
        }
      } else if (command.includes('아니오') || command.includes('아니요') || command.includes('취소')) {
        speak({ text: '예약이 취소되었습니다. 다른 시간을 선택해주세요.' });
        setIsConfirmingReservation(false);
        setPendingReservation(null);
        setCurrentStep(3); // Return to the time selection step
      } else {
        speak({ text: '네 또는 아니오로 답변해 주세요.' });
        startListening();
      }
    } else {
      // Process steps for date and time selection
      if (currentStep === 2) {
        handleDateSelection(command);
      } else if (currentStep === 3) {
        handleTimeSelection(command);
      }
    }
  };

  const handleDateSelection = (command) => {
    const parsedDate = parseDate(command);
    if (parsedDate) {
      setSelectedDate(parsedDate);
      setCurrentStep(3); // Move to the time selection step
      speak({ text: `${parsedDate} 날짜를 선택하셨습니다. 예약할 시간을 말해주세요.` });
      fetchAvailableTimes(selectedDoctor?.doctorId, parsedDate);
    } else {
      speak({ text: '유효한 날짜를 말씀해주세요.' });
      startListening();
    }
  };

  const handleTimeSelection = (command) => {
    const parsedTime = parseTime(command);
    if (parsedTime) {
      checkAvailability(selectedDate, parsedTime);
      setCurrentStep(4); // Prevent repeated processing of the same step
    } else {
      speak({ text: '유효한 시간을 입력해주세요.' });
      startListening();
    }
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
          speak({ text: `${selectedDoctor.name} 의사의 ${date} ${time}에 예약하시겠습니까? 네 또는 아니오로 답변해 주세요.` });
          setIsConfirmingReservation(true);
          setPendingReservation({ date, time });
          startListening();
        } else {
          speak({ text: '이미 선택한 날짜와 시간에 예약이 있습니다. 다른 시간을 선택해주세요.' });
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
  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setIsModalOpen(true); // Show the confirmation modal
  };

  const confirmReservation = () => {
    setIsModalOpen(false);
    checkAvailability(selectedDate, selectedTime); // Check availability for the selected time
  };
  const cancelReservation = () => {
    setIsModalOpen(false);
    setSelectedTime(null); // Clear selected time if the user cancels
  };
  const handleDateClick = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);
    fetchAvailableTimes(selectedDoctor?.doctorId, formattedDate);
  };
  const parseDate = (response) => {
    const match = response.match(/(\d{1,2})월\s*(\d{1,2})일?/);
    if (match) {
      const [_, month, day] = match;
      const year = new Date().getFullYear();
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
  };

  const parseTime = (response) => {
    const timeMatch = response.match(/(오전|오후)?\s*(\d{1,2})시/);
    if (timeMatch) {
      let hour = parseInt(timeMatch[2], 10);
      if (timeMatch[1] === '오후' && hour < 12) hour += 12;
      else if (timeMatch[1] === '오전' && hour === 12) hour = 0;
      return `${String(hour).padStart(2, '0')}:00`;
    }
    return null;
  };
  

  return (
    <ReservationContainer>
       <MainContent>
         {/* 뒤로 가기 버튼 추가 */}
         <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
      <Title>음성 진료 예약 시스템</Title>
	
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
      <TranscriptContainer>
              <h3>음성 인식 기록</h3>
              <ResponseList>
                {userCommands.map((command, index) => (
                  <li key={index}>{command}</li>
                ))}
              </ResponseList>
              <CurrentTranscript>
                <FaMicrophone />
                {transcript || '음성을 인식하면 여기에 표시됩니다...'}
              </CurrentTranscript>
            </TranscriptContainer>
            
        <ButtonGroup>
          <Button onClick={startVoiceReservation}>음성 안내 시작</Button>
          <Button
            onClick={toggleListening}
            style={{ backgroundColor: isListening ? '#f44336' : '#2260ff' }}
          >
            {isListening ? '응답 종료' : '응답 시작'}
          </Button>
          <Button onClick={handleReset}>초기화</Button>
        </ButtonGroup>
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <p>선택하신 시간 {selectedTime}으로 예약하시겠습니까?</p>
              <div>
                <ModalButton onClick={confirmReservation}>예</ModalButton>
                <ModalButton onClick={cancelReservation}>아니오</ModalButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

      {/* 하단 네비게이션 바 추가 */}
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
    </ReservationContainer>
  );
};

export default VoiceReservationSystem;
