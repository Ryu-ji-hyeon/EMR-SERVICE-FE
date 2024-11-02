import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DepartmentSelector from '../Department/DepartmentSelector';
import DoctorSelector from '../Doctor/DoctorSelector';
import styled from 'styled-components';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { jwtDecode } from 'jwt-decode';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft, FaMicrophone } from 'react-icons/fa';

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Card = styled.div`
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1.25rem;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #2260ff;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1c3faa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const TranscriptContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
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

const CurrentTranscript = styled.div`
  background-color: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #1976d2;
  min-height: 3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20rem 2rem;
  position: relative;
`;

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
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;

  &:hover {
    background-color: #e6e6e6;
  }
`;

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

const NavIcon = styled.div`
  font-size: 1.5rem;
  color: #007bff;
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
`;

const DepartmentDoctorSelection = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [userCommands, setUserCommands] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const { speak, cancel } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  const handleGoBack = () => navigate('/Voice/VoiceGuide');

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
      setPatientId(decodedToken?.sub);
    }
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/departments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-XSRF-TOKEN': csrfToken
          },
          withCredentials: true
        });
        setAvailableDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [csrfToken]);

  useEffect(() => {
    if (!listening && transcript) {
      handleVoiceCommand(transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    }
    setIsListening(!isListening);
  };

  const handleReset = () => resetTranscript();

  const speakQuestion = (text) => {
    speak({ text, lang: 'ko-KR' });
    setTimeout(() => SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' }), 3000);
  };

  const startVoiceGuide = () => speakQuestion('부서 안내 화면입니다. 부서 이름 듣고 싶으십니까?');

  const handleDepartmentSelection = async (command) => {
    const selectedDept = availableDepartments.find(dept => dept.deptName === command);
    if (selectedDept) {
      setSelectedDepartment(selectedDept.deptName);
      speakQuestion(`${selectedDept.deptName} 부서를 선택하셨습니다.`);
  
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/doctors`, {
          params: { department: selectedDept.deptName },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-XSRF-TOKEN': csrfToken
          },
          withCredentials: true
        });
  
        const doctors = response.data;
        if (doctors.length > 0) {
          setAvailableDoctors(doctors);
          if (doctors.length === 1) {
            handleDoctorSelection(doctors[0].doctorName);
          } else {
            const doctorNames = doctors.map(doc => doc.doctorName).join(', ');
            speakQuestion(`선택한 ${selectedDept.deptName} 부서의 의사 목록은 다음과 같습니다: ${doctorNames}. 선택할 의사 이름을 말해주세요.`);
            setCurrentStep(2);
          }
        } else {
          speakQuestion(`선택한 ${selectedDept.deptName} 부서에는 현재 등록된 의사가 없습니다.`);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        speakQuestion('의사 목록을 불러오는 중 오류가 발생했습니다.');
      }
    } else {
      speakQuestion('유효한 부서를 선택해주세요.');
    }
  };

  const handleDoctorSelection = async (doctorName) => {
    const selectedDoctor = availableDoctors.find(doc => doc.doctorName === doctorName);
    if (selectedDoctor) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/doctor/${selectedDoctor.doctorId}/date`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-XSRF-TOKEN': csrfToken
          },
          params: { date: new Date().toISOString().split('T')[0] },
          withCredentials: true
        });
        speakQuestion(`선택한 ${selectedDoctor.doctorName} 의사의 예약 화면으로 넘어가겠습니다. 음성 안내 시작 버튼을 누르고 예약 진행해주세요`);
        const reservations = response.data;

        navigate('/Voice/ReservationScreen', {
          state: {
            selectedDoctor: {
              doctorId: selectedDoctor.doctorId,
              name: selectedDoctor.doctorName,
              department: selectedDepartment
            },
            reservations
          }
        });
      } catch (error) {
        console.error('Error fetching reservations:', error);
        speakQuestion('예약 정보를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } else {
      speakQuestion('해당 이름의 의사가 없습니다. 다시 시도해주세요.');
    }
  };

  const handleVoiceCommand = (command) => {
    setUserCommands(prevCommands => [...prevCommands, command]);
    if (currentStep === 0) {
      askIfWantDepartmentList(command);
    } else if (currentStep === 1) {
      handleDepartmentSelection(command);
    } else if (currentStep === 2) {
      handleDoctorSelection(command);
    }
  };

  const askIfWantDepartmentList = (command) => {
    if (command.includes('네')) {
      readDepartmentList();
    } else if (command.includes('아니오') || command.includes('아니요')) {
      speakQuestion('어느 부서를 선택하시겠습니까?');
      setCurrentStep(1);
    }
  };

  const readDepartmentList = () => {
    if (availableDepartments.length > 0) {
      const departmentNames = availableDepartments.map(dept => dept.deptName).join(', ');
      speakQuestion(`다음은 부서 목록입니다: ${departmentNames}. 어느 부서를 선택하시겠습니까?`);
      setCurrentStep(1);
    } else {
      speakQuestion('현재 사용할 수 있는 부서 정보가 없습니다.');
    }
  };

  return (
    <ScreenContainer>
      <MainContent>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
        <Content>
          <Title>음성 진료 예약 서비스</Title>
          <Card>
            <ButtonGroup>
              <Button onClick={startVoiceGuide}>음성 안내 시작</Button>
              <Button 
                onClick={toggleListening}
                style={{ backgroundColor: isListening ? '#f44336' : '#2260ff' }}
              >
                {isListening ? '응답 종료' : '응답 시작'}
              </Button>
              <Button onClick={handleReset}>초기화</Button>
            </ButtonGroup>
            <DepartmentSelector onSelect={handleDepartmentSelection} />
            {selectedDepartment && (
              <DoctorSelector department={selectedDepartment} onSelect={(doctor) => handleDoctorSelection(doctor.doctorName)} />
            )}
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
          </Card>
        </Content>
        <BottomNavBar>
          <NavIcon onClick={() => navigate('/member/dashboard')}><FaHome /><span>홈</span></NavIcon>
          <NavIcon onClick={() => navigate('/reservation-choice')}><FaCalendarCheck /><span>예약</span></NavIcon>
          <NavIcon onClick={() => navigate('/member/profile')}><FaUser /><span>프로필</span></NavIcon>
          <NavIcon onClick={() => navigate('/')}><FaCog /><span>로그아웃</span></NavIcon>
        </BottomNavBar>
      </MainContent>
    </ScreenContainer>
  );
};

export default DepartmentDoctorSelection;
