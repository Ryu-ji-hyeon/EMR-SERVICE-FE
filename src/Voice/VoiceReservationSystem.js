import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import ResulvationCalender from './ResulvationCalender';
import './VoiceReservationSystem.css';

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

  useEffect(() => {
    axios.get('http://localhost:8080/api/csrf-token', { withCredentials: true })
      .then(response => setCsrfToken(response.data.token))
      .catch(error => console.error('Error fetching CSRF token:', error));

    askDateQuestion();
    handleStartListening();
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

    console.log('User Response:', newResponse);
    axios.post('http://localhost:8080/api/log', { transcript: newResponse })
      .then(() => console.log('Transcript logged successfully'))
      .catch((error) => console.error('Error logging transcript:', error));

    handleStopListening();

    if (currentStep === 0) {
      const parsedDate = parseDate(newResponse);
      console.log('Parsed Date:', parsedDate);
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
      console.log('Parsed Time:', parsedTime);
      if (parsedTime) {
        setTime(parsedTime);
        checkAvailability(date, parsedTime); // 여기서 date를 사용해야 합니다.
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
    console.log(`Checking availability for date: ${date}, time: ${time}`);
    axios.get('http://localhost:8080/api/check', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: { date, time },
      withCredentials: true
    })
      .then((response) => {
        console.log('Availability response:', response.data);
        if (response.data.available) {
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
    console.log(`Making reservation for date: ${date}, time: ${time}`);
    axios.post('http://localhost:8080/api/reserve', null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-XSRF-TOKEN': csrfToken
      },
      params: { date, time },
      withCredentials: true
    })
      .then((response) => {
        console.log('Reservation response:', response.data);
        speakQuestion('예약이 확정되었습니다.');
        setText('예약이 확정되었습니다.');
        // 예약 성공 시 예약 가능한 시간대에서 해당 시간 제거
        setAvailableTimes(prevTimes => prevTimes.filter(t => t !== time));
        setCurrentStep(3);
      })
      .catch((error) => {
        console.error('Error making reservation:', error);
        speakQuestion('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
        setText('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  const fetchAvailableTimes = (date) => {
    const token = localStorage.getItem('accessToken');
    axios.get('http://localhost:8080/api/available-times', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: { date },
      withCredentials: true
    })
      .then((response) => {
        console.log('Available times response:', response.data);
        setAvailableTimes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching available times:', error);
      });
  };

  const handleDateClick = (date) => {
    const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해줍니다.
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);

    // 화, 목, 토, 일은 예약 불가
    if ([0, 2, 4, 6].includes(dayOfWeek)) {
      setAvailableTimes([]); // 예약 가능한 시간대를 빈 리스트로 설정
    } else {
      fetchAvailableTimes(formattedDate);
    }
  };

  const handleTimeClick = (time) => {
    const confirmReservation = window.confirm('예약하시겠습니까?');
    if (confirmReservation) {
      setTime(time);
      checkAvailability(selectedDate, time);
    }
  };

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        <h1>음성 인식 예약 시스템</h1>
        <ResulvationCalender onDateClick={handleDateClick} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2>예약 가능한 시간대</h2>
          {selectedDate && <p>선택된 날짜: {selectedDate}</p>}
          {availableTimes.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {availableTimes.map((time) => (
                <button key={time} onClick={() => handleTimeClick(time)} style={{ padding: '10px', textAlign: 'center' }}>
                  {time.slice(0, 5)}
                </button>
              ))}
            </div>
          ) : (
            <p>선택된 날짜에 예약 가능한 시간대가 없습니다.</p>
          )}
        </div>
        <div>
          <button onClick={handleSpeak}>질문 듣기</button>
          <button onClick={handleStopSpeaking}>질문 멈추기</button>
          <button onClick={handleStartListening}>응답 시작</button>
          <button onClick={handleStopListening}>응답 종료</button>
          <button onClick={handleReset}>리셋</button>
          <p>녹음 상태: {listening ? '녹음 중' : '녹음 중지'}</p>
          <p>인식된 텍스트: {transcript}</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceReservationSystem;
