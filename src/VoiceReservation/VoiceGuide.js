import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const VoiceGuide = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/Voice/DepartmentDoctorSelection');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">음성 안내 예약 주의사항</h1>
      <div className="card p-4">
        <p>
          음성 안내 예약 시스템을 사용하기 전에 주의사항을 읽어주세요. 
          이 시스템은 음성 인식 기술을 사용하여 예약을 진행합니다.
        </p>
        <p>
          음성 인식의 정확성을 위해 주변 환경이 조용한 곳에서 사용해 주세요.
        </p>
        <button className="btn btn-primary btn-lg btn-block" onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  );
};

export default VoiceGuide;
