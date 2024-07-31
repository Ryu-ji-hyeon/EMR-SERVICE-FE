import React from 'react';

const ControlPanel = ({ 
  handleSpeak, 
  handleStopSpeaking, 
  handleStartListening, 
  handleStopListening, 
  handleReset, 
  listening, 
  transcript, 
  speakQuestion, 
  handleUserResponse 
}) => (
  <div>
    <button onClick={handleSpeak}>질문 듣기</button>
    <button onClick={handleStopSpeaking}>질문 멈추기</button>
    <button onClick={handleStartListening}>응답 시작</button>
    <button onClick={handleStopListening}>응답 종료</button>
    <button onClick={handleReset}>리셋</button>
    <p>녹음 상태: {listening ? '녹음 중' : '녹음 중지'}</p>
    <p>인식된 텍스트: {transcript}</p>
  </div>
);

export default ControlPanel;
