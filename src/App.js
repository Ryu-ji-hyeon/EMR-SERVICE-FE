import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

// 음성 인식 예약 시스템 
function App() {
  const [text, setText] = useState('');
  const { speak, cancel } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [previousResponse, setPreviousResponse] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    askDateQuestion();
  }, []);

  useEffect(() => {
    if (!listening && transcript) {
      handleUserResponse(transcript.trim());
    }
  }, [listening, transcript]);

  const handleSpeak = () => {
    speak({ text });
  };

  const handleStopSpeaking = () => {
    cancel();
  };

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    resetTranscript();
  };

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

  const handleUserResponse = (response) => {
    const newResponse = response.replace(previousResponse, '').trim();
    setPreviousResponse(response);

    axios.post('http://localhost:8080/api/log', { transcript: newResponse })
      .then(() => console.log('Transcript logged successfully'))
      .catch((error) => console.error('Error logging transcript:', error));

    if (currentStep === 0) {
      setDate(parseDate(newResponse));
      askTimeQuestion();
      setCurrentStep(1);
    } else if (currentStep === 1) {
      const parsedTime = parseTime(newResponse);
      if (parsedTime) {
        setTime(parsedTime);
        checkAvailability(date, parsedTime);
      } else {
        speakQuestion('유효한 시간을 입력해주세요.');
        setText('유효한 시간을 입력해주세요.');
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
    // 날짜를 파싱하는 로직을 추가하세요.
    // 예: "7월 18일"을 "2024-07-18"로 변환
    const [month, day] = response.match(/\d+/g);
    const year = new Date().getFullYear();
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const parseTime = (response) => {
    // 시간을 파싱하는 로직을 추가하세요.
    // 예: "15시"를 "15:00"로 변환
    const time = response.match(/\d{1,2}/);
    if (time) {
      return `${time[0].padStart(2, '0')}:00`;
    }
    return null;
  };

  const checkAvailability = (date, time) => {
    axios.get(`http://localhost:8080/api/check?date=${date}&time=${time}`)
      .then((response) => {
        if (response.data.available) {
          makeReservation(date, time);
        } else {
          speakQuestion('이미 예약이 있습니다. 다른 시간을 선택해주세요.');
          setText('이미 예약이 있습니다. 다른 시간을 선택해주세요.');
          setCurrentStep(1);
        }
      })
      .catch((error) => {
        console.error('Error checking availability:', error);
        speakQuestion('예약 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
        setText('예약 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  const makeReservation = (date, time) => {
    axios.post(`http://localhost:8080/api/reserve`, null, { params: { date, time } })
      .then((response) => {
        speakQuestion('예약이 확정되었습니다.');
        setText('예약이 확정되었습니다.');
        setCurrentStep(3);
      })
      .catch((error) => {
        console.error('Error making reservation:', error);
        speakQuestion('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
        setText('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>음성 인식 예약 시스템</h1>
      <button onClick={handleSpeak}>질문 듣기</button>
      <button onClick={handleStopSpeaking}>질문 멈추기</button>
      <br /><br />
      <button onClick={handleStartListening}>응답 시작</button>
      <button onClick={handleStopListening}>응답 종료</button>
      <button onClick={handleReset}>리셋</button>
      <br /><br />
      <p>녹음 상태: {listening ? '녹음 중' : '녹음 중지'}</p>
      <p>인식된 텍스트: {transcript}</p>
      <br /><br />
    </div>
  );
}

export default App;
