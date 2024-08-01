import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import DepartmentSelector from './DepartmentSelector';
import DoctorSelector from '../Doctor/DoctorSelector';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {jwtDecode} from 'jwt-decode';

const DepartmentDoctorSelection = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableDepartments, setAvailableDepartments] = useState([]); // 초기값을 빈 배열로 설정
  const [csrfToken, setCsrfToken] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [userCommands, setUserCommands] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { speak, cancel } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const navigate = useNavigate();
  const location = useLocation();

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
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/doctor/departments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-XSRF-TOKEN': csrfToken
          },
          withCredentials: true
        });
        console.log('Departments fetched:', response.data); // 디버그: 반환된 데이터 확인
        setAvailableDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [csrfToken]);

  useEffect(() => {
    if (!listening && transcript) {
      handleUserResponse(transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript]);

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    resetTranscript();
  };

  const speakQuestion = (text) => {
    speak({ text, lang: 'ko-KR' });
    setTimeout(() => {
      startListening();
    }, 3000); // 음성 안내 후 3초 후에 다시 음성 인식을 시작
  };

  const startVoiceGuide = () => {
    speakQuestion('부서 안내 화면입니다. 부서 이름 듣고 싶으십니까?');
  };

  const handleVoiceCommand = (command) => {
    setUserCommands(prevCommands => [...prevCommands, command]);
    if (currentStep === 0) {
      askIfWantDepartmentList(command);
    } else if (currentStep === 1) {
      handleDepartmentSelection(command);
    } else if (selectedDepartment) {
      handleDoctorSelection(command);
    }
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedDoctor(null);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    const isVoiceReservation = location.pathname.includes('Voice');
    const path = isVoiceReservation ? '/Voice/ReservationScreen' : '/Standard/ReservationScreen';
    navigate(path, { state: { selectedDoctor: doctor } });
  };

  const askIfWantDepartmentList = (command) => {
    if (command.includes('네')) {
      readDepartmentList();
    } else if (command.includes('아니오')||('아니요')) {
      speakQuestion('어느 부서를 선택하시겠습니까?');
      setCurrentStep(1);
    }
  };

  const readDepartmentList = () => {
    if (Array.isArray(availableDepartments) && availableDepartments.length > 0) {
      const departmentNames = availableDepartments.map(dept => dept.deptName).join(', ');
      speakQuestion(`다음은 부서 목록입니다: ${departmentNames}. 어느 부서를 선택하시겠습니까?`);
      setCurrentStep(1);
    } else {
      speakQuestion('현재 사용할 수 있는 부서 정보가 없습니다.');
    }
  };

  const handleDepartmentSelection = (command) => {
    const selectedDept = availableDepartments.find(dept => dept.deptName === command);
    if (selectedDept) {
      setSelectedDepartment(selectedDept.deptName);
      speakQuestion(`${selectedDept.deptName} 부서를 선택하셨습니다. 의사 이름을 말해주세요.`);
      setCurrentStep(2);
    } else {
      speakQuestion('유효한 부서를 선택해주세요.');
    }
  };

  const handleDoctorSelection = (command) => {
    setSelectedDoctor(command);
    const isVoiceReservation = location.pathname.includes('Voice');
    const path = isVoiceReservation ? '/Voice/ReservationScreen' : '/Standard/ReservationScreen';
    navigate(path, { state: { selectedDoctor: { name: command, department: selectedDepartment } } });
  };

  const handleUserResponse = (response) => {
    handleVoiceCommand(response);
  };

  const parseDate = (response) => {
    const [month, day] = response.match(/\d+/g);
    const year = new Date().getFullYear();
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const parseTime = (response) => {
    const time = response.match(/\d{1,2}/);
    if (time) {
      return `${time[0].padStart(2, '0')}:00`;
    }
    return null;
  };

  const askDateQuestion = () => {
    const questionText = '몇월 며칠 예약할래?';
    speakQuestion(questionText);
    setCurrentStep(1);
  };

  const askTimeQuestion = () => {
    const questionText = '몇시에 예약하시겠습니까?';
    speakQuestion(questionText);
    setCurrentStep(2);
  };

  const checkAvailability = (date, time) => {
    const token = localStorage.getItem('accessToken');
    axios.get(`http://localhost:8080/api/check?date=${date}&time=${time}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    })
      .then((response) => {
        if (response.data.available) {
          makeReservation(date, time);
        } else {
          speakQuestion('이미 예약이 있습니다. 다른 시간을 선택해주세요.');
          setCurrentStep(2);
        }
      })
      .catch((error) => {
        console.error('Error checking availability:', error);
        speakQuestion('예약 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  const makeReservation = (date, time) => {
    const token = localStorage.getItem('accessToken');
    axios.post(`http://localhost:8080/api/reserve`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken
      },
      params: { date, time },
      withCredentials: true
    })
      .then((response) => {
        speakQuestion('예약이 확정되었습니다.');
        setCurrentStep(4);
      })
      .catch((error) => {
        console.error('Error making reservation:', error);
        speakQuestion('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">예약 시스템</h1>
      <div className="card p-4">
        <DepartmentSelector onSelect={handleDepartmentSelect} />
        {selectedDepartment && (
          <DoctorSelector department={selectedDepartment} onSelect={handleDoctorSelect} />
        )}
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={startVoiceGuide}>음성 안내 시작</button>
      </div>
      <div className="mt-4">
        <h3>사용자 응답</h3>
        <ul>
          {userCommands.map((command, index) => (
            <li key={index}>{command}</li>
          ))}
        </ul>
      </div>
      <p>인식된 텍스트: {transcript}</p>
      <br />
      <button onClick={handleStopListening}>응답 종료</button>
      <button onClick={handleReset}>리셋</button>
    </div>
  );
};

export default DepartmentDoctorSelection;
