import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const VoiceReservationSystem = () => {
  const { speak } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [step, setStep] = useState(0);
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const location = useLocation();
  const { selectedDoctor } = location.state || {};
  const [patientId, setPatientId] = useState(null);
  const [userCommands, setUserCommands] = useState([]);

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

  const startVoiceGuide = () => {
    speak({ text: '부서 안내 화면입니다. 부서 이름 듣고 싶으십니까?' });
    setTimeout(() => {
      startListening();
    }, 3000);
  };

  const handleVoiceCommand = (command) => {
    setUserCommands(prevCommands => [...prevCommands, command]);
    switch (step) {
      case 0:
        askIfWantDepartmentList(command);
        break;
      case 1:
        handleDepartmentSelection(command);
        break;
      case 2:
        handleDoctorSelection(command);
        break;
      case 3:
        handleDateSelection(command);
        break;
      case 4:
        handleTimeSelection(command);
        break;
      default:
        break;
    }
  };

  const askIfWantDepartmentList = (command) => {
    if (command.includes('네')) {
      readDepartmentList();
      setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 3000); // 3초 후 음성 인식 중지
    } else if (command.includes('아니오')) {
      speak({ text: '어느 부서를 선택하시겠습니까?' });
      setStep(1);
      startListening();
    }
  };

  const readDepartmentList = () => {
    const departmentNames = availableDepartments.map(dept => dept.name).join(', ');
    speak({ text: `다음은 부서 목록입니다: ${departmentNames}. 어느 부서를 선택하시겠습니까?` });
    setStep(1);
    startListening();
  };

  const handleDepartmentSelection = (command) => {
    const selectedDept = availableDepartments.find(dept => dept.name === command);
    if (selectedDept) {
      setDepartment(selectedDept.name);
      speak({ text: `${selectedDept.name} 부서를 선택하셨습니다. 의사 이름을 말해주세요.` });
      setStep(2);
      // 실제 부서 기반 의사 목록 가져오는 로직 추가
    } else {
      speak({ text: '유효한 부서를 선택해주세요.' });
      startListening();
    }
  };

  const handleDoctorSelection = (command) => {
    // 의사 선택 로직
    setDoctor(command);  // 여기서는 단순히 명령을 의사 이름으로 설정
    speak({ text: `${command} 의사를 선택하셨습니다. 예약할 날짜를 말해주세요.` });
    setStep(3);
    // 실제 의사 기반 예약 가능한 날짜 가져오는 로직 추가
  };

  const handleDateSelection = (command) => {
    // 날짜 선택 로직
    setDate(command);  // 여기서는 단순히 명령을 날짜로 설정
    speak({ text: `${command} 날짜를 선택하셨습니다. 예약할 시간을 말해주세요.` });
    setStep(4);
    // 실제 날짜 기반 예약 가능한 시간 가져오는 로직 추가
  };

  const handleTimeSelection = (command) => {
    setTime(command);
    makeReservation(date, command);
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
        speak({ text: `${date} 일 ${time} 시간에 예약이 완료되었습니다.` });
      })
      .catch((error) => {
        console.error('Error making reservation:', error);
        speak({ text: '예약 중 오류가 발생했습니다. 다시 시도해주세요.' });
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">음성 인식 예약 시스템</h1>
      <div className="text-center">
        <button className="btn btn-primary" onClick={startVoiceGuide}>음성 안내 시작</button>
      </div>
      <p>{transcript}</p>
      <div className="mt-4">
        <h3>사용자 응답</h3>
        <ul>
          {userCommands.map((command, index) => (
            <li key={index}>{command}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceReservationSystem;
