import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ControlPanel = ({ handleSpeak, handleStopSpeaking, handleStartListening, handleStopListening, handleReset, listening, transcript, speakQuestion, handleUserResponse }) => {
  return (
    <div className="mt-4">
      <button className="btn btn-primary mr-2" onClick={handleSpeak}>Speak</button>
      <button className="btn btn-danger mr-2" onClick={handleStopSpeaking}>Stop Speaking</button>
      <button className="btn btn-success mr-2" onClick={handleStartListening}>{listening ? 'Listening...' : 'Start Listening'}</button>
      <button className="btn btn-warning mr-2" onClick={handleStopListening}>Stop Listening</button>
      <button className="btn btn-secondary mr-2" onClick={handleReset}>Reset Transcript</button>
      <div className="mt-2">
        <strong>Transcript:</strong> {transcript}
      </div>
    </div>
  );
};

export default ControlPanel;
