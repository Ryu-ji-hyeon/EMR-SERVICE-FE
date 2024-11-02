import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft, FaMicrophone } from 'react-icons/fa';



const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
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

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ResponseList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;
  li {
    padding: 0.5rem;
    background: #f0f0f0;
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  height: calc(100vh - 70px); /* 화면 전체 높이에서 하단 네비게이션 바 높이 제외 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 7rem 1rem 1rem; /* Title 높이만큼 상단 padding 추가 */
  position: relative;
`;

const Card = styled.div`
  width: 80%;
  height: 180%;
  padding: 10rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1rem; /* Title 아래로 여백 추가 */
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

const TranscriptContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
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

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.isListening ? '#4caf50' : '#757575'};
  margin: 1rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const VoiceGuide = () => {
  const navigate = useNavigate();
  const { speak } = useSpeechSynthesis();
  const [isListening, setIsListening] = useState(false);
  const [userCommands, setUserCommands] = useState([]);
  const [error, setError] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    commands: [
      {
        command: '네',
        callback: () => handleUserResponse('네'),
      },
      {
        command: '아니오',
        callback: () => handleUserResponse('아니오'),
      },
    ],
  });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("브라우저가 음성 인식을 지원하지 않습니다.");
    }
  }, []);

  const handleGoBack = () => {
    navigate('/reservation-choice');
  };

  const startVoiceGuide = () => {
    setError(null);
    resetTranscript();
    speak({
      text: '안녕하세요. 음성 안내 예약 시스템을 사용하기 전에 몇 가지 주의사항을 알려드리겠습니다. 이 시스템은 음성 인식 기술을 사용하여 예약을 진행하니, 정확한 인식을 위해 조용한 환경에서 사용해 주세요. 또한, 이 대화는 품질 개선을 위해 녹음될 수 있습니다. 응답 시작 버튼을 누르고 응답 후 응답 종료 버튼을 누르시면 됩니다. 예약을 진행하시겠습니까?',
      lang: 'ko-KR',
    });
  };

  const startListening = () => {
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    if (transcript) {
      setUserCommands(prev => [...prev, transcript]);
      handleUserResponse(transcript);
    }
  };

  const handleReset = () => {
    setUserCommands([]);
    resetTranscript();
    setIsListening(false);
    setError(null);
  };

  const handleUserResponse = (response) => {
    const lowerResponse = response.toLowerCase();
    if (lowerResponse.includes('네') || lowerResponse.includes('예') || 
        lowerResponse.includes('응') || lowerResponse.includes('어')) {
      navigate('/Voice/DepartmentDoctorSelection');
    } else if (lowerResponse.includes('아니') || lowerResponse.includes('아니요')) {
      navigate('/member/dashboard');
    } else {
      setError('유효한 응답이 아닙니다. "네" 또는 "아니오"로 답변해 주세요.');
      speak({
        text: '유효한 응답이 아닙니다. "네" 또는 "아니오"로 답변해 주세요.',
        lang: 'ko-KR',
      });
    }
  };

  return (
    <ScreenContainer>
      <MainContent>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
        <Content>
          <Title>음성 예약 안내</Title>
          <Card>
            <ButtonGroup>
              <Button onClick={startVoiceGuide}>
                음성 안내 시작
              </Button>
              <Button 
                onClick={isListening ? handleStopListening : startListening}
                style={{ backgroundColor: isListening ? '#f44336' : '#2260ff' }}
              >
                {isListening ? '응답 종료' : '응답 시작'}
              </Button>
              <Button onClick={handleReset}>초기화</Button>
            </ButtonGroup>

            <StatusIndicator isListening={isListening}>
              <FaMicrophone />
              {isListening ? '말씀해 주세요...' : '마이크 꺼짐'}
            </StatusIndicator>

            <TranscriptContainer>
              <h3>음성 인식 기록</h3>
              {userCommands.length > 0 ? (
                <ResponseList>
                  {userCommands.map((command, index) => (
                    <li key={index}>
                      {`${index + 1}. ${command}`}
                    </li>
                  ))}
                </ResponseList>
              ) : (
                <Text>아직 음성 기록이 없습니다.</Text>
              )}
            </TranscriptContainer>

            <CurrentTranscript>
              <FaMicrophone />
              {transcript || '음성을 인식하면 여기에 표시됩니다...'}
            </CurrentTranscript>

            {error && (
              <Text style={{ color: 'red', marginTop: '1rem' }}>
                {error}
              </Text>
            )}
          </Card>
        </Content>

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
      </MainContent>
    </ScreenContainer>
  );
};

export default VoiceGuide;