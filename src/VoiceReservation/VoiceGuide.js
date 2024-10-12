import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';


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

const VoiceGuide = () => {
  const navigate = useNavigate();
  const { speak } = useSpeechSynthesis(); // 음성 출력용 훅
  const [isListening, setIsListening] = useState(false); // 음성 인식 상태 관리
  const [userCommands, setUserCommands] = useState([]); // 사용자의 명령을 저장하는 배열
  const [transcript, setTranscript] = useState(''); // 현재 인식된 텍스트 저장
  const [error, setError] = useState(null); // 에러 상태 관리

  const handleGoBack = () => {
    navigate('/reservation-choice'); // ReservationChoice로 이동
  };


  // 음성 인식 처리 설정
  const { resetTranscript, listening, finalTranscript } = useSpeechRecognition({
    onResult: (result) => {
      const lowerTranscript = result.toLowerCase(); // 인식된 텍스트 소문자로 저장
      setTranscript(lowerTranscript);
      setUserCommands((prev) => [...prev, lowerTranscript]);
      console.log('인식된 텍스트:', lowerTranscript);
    },
    onError: (event) => {
      setError(`음성 인식 에러: ${event.error}`);
      console.error("음성 인식 에러:", event.error);
      SpeechRecognition.stopListening();
    },
  });

  useEffect(() => {
    // 음성 인식이 멈추면, 인식된 텍스트 처리
    if (!listening && finalTranscript) {
      setTranscript(finalTranscript);
      handleUserResponse(finalTranscript);
    }
  }, [listening, finalTranscript]); // listening 상태와 finalTranscript 변화 감지

  useEffect(() => {
    // SpeechRecognition 브라우저 지원 여부 확인
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      setError("브라우저가 음성 인식을 지원하지 않습니다.");
      console.error("브라우저가 SpeechRecognition을 지원하지 않습니다.");
    }

    // 음성 안내 전 음성 인식 멈추기
    SpeechRecognition.stopListening();
    setIsListening(false);
  }, []);

  // 음성 안내 시작 (음성 안내만 진행, 음성 인식은 하지 않음)
  const startVoiceGuide = () => {
    setError(null); // 에러 상태 초기화
    speak({
      text: '안녕하세요. 음성 안내 예약 시스템을 사용하기 전에 몇 가지 주의사항을 알려드리겠습니다. 이 시스템은 음성 인식 기술을 사용하여 예약을 진행하니, 정확한 인식을 위해 조용한 환경에서 사용해 주세요. 또한, 이 대화는 품질 개선을 위해 녹음될 수 있습니다. 응답 시작 버튼을 누르고 응답 후 응답 종료 버튼을 누르시면 됩니다. 예약을 진행하시겠습니까?',
      lang: 'ko-KR',
    });
  };

  // "응답 시작" 버튼을 눌러야 음성 인식 활성화
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    setIsListening(true);
    console.log("음성 인식이 시작되었습니다.");
  };

  // 음성 인식 멈추기
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    console.log("음성 인식이 멈췄습니다.");
  };

  // 리셋 기능: 인식된 텍스트와 명령을 초기화
  const handleReset = () => {
    setTranscript('');
    setUserCommands([]);
    resetTranscript();
    setIsListening(false);
    setError(null); // 에러 초기화
  };

// 음성 인식 후 응답에 따른 이벤트 처리
const handleUserResponse = (response) => {
  console.log('응답 처리 중...');
  
  // 인식된 텍스트(response)를 기반으로 이벤트 처리
  if (response.includes('네') || response.includes('응') || response.includes('어') || response.includes('녜') || response.includes('엉')) {
    navigate('/Voice/DepartmentDoctorSelection'); // 예약 경로로 이동
  } else if (response.includes('아니오') || response.includes('아니요') || response.includes('아니')) {
    navigate('/member/dashboard'); // 취소시 대시보드로 이동
  } else {
    setError('유효한 응답이 아닙니다. 다시 응답해주세요.');
    speak({
      text: '유효한 응답이 아닙니다. 다시 응답해주세요.',
      lang: 'ko-KR',
    });
  }
};

  return (
    <ScreenContainer>
      <MainContent>
        {/* 뒤로 가기 버튼 추가 */}
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>
      <Content>
        <Title>음성 예약 주의사항</Title>
        <Card>
          <Text>음성 안내 예약 시스템 주의사항</Text>
          <Button onClick={startVoiceGuide}>
            음성 안내 시작
          </Button>

          {/* 응답 시작 버튼은 언제나 활성화 */}
          <Button onClick={startListening} disabled={isListening}>
            {isListening ? '듣는 중...' : '응답 시작'}
          </Button>

          {/* 사용자의 대답 출력 */}
          <div className="mt-4">
            <h3>사용자 응답</h3>
            <ResponseList>
              {userCommands.map((command, index) => (
                <li key={index}>{command}</li>
              ))}
            </ResponseList>
          </div>

          <p>인식된 텍스트: {transcript}</p>

          {/* 에러 메시지 출력 */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* 응답 종료 및 리셋 버튼 */}
          <div>
            <Button onClick={handleStopListening} disabled={!isListening && !listening}>
              응답 종료
            </Button>
            <Button onClick={handleReset}>리셋</Button>
          </div>
        </Card>
      </Content>

      {/* 하단 네비게이션 바 추가 */}
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
