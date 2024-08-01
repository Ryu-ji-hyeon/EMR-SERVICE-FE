import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReservationChoice = () => {
  const navigate = useNavigate();

  const handleVoiceReservation = () => {
    navigate('/Voice/VoiceGuide');
  };

  const handleStandardReservation = () => {
    navigate('/standard-reservation');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">예약 방법 선택</h1>
      <div className="card p-4">
        <div className="mb-3">
          <button className="btn btn-primary btn-lg btn-block" onClick={handleVoiceReservation}>
            음성 안내 예약
          </button>
        </div>
        <div>
          <button className="btn btn-secondary btn-lg btn-block" onClick={handleStandardReservation}>
            일반 예약
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationChoice;
