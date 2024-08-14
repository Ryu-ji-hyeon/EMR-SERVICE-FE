import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Card = styled.div`
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1.25rem;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &.primary {
    background-color: #2260ff;

    &:hover {
      background-color: #1c3faa;
    }
  }

  &.secondary {
    background-color: #6c757d;

    &:hover {
      background-color: #5a6268;
    }
  }

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

const ReservationChoice = () => {
  const navigate = useNavigate();

  const handleVoiceReservation = () => {
    navigate('/Voice/VoiceGuide');
  };

  const handleStandardReservation = () => {
    navigate('/standard-reservation');
  };

  return (
    <ScreenContainer>
      <Content>
        <Title>예약 방법 선택</Title>
        <Card>
          <Button className="primary" onClick={handleVoiceReservation}>
            음성 안내 예약
          </Button>
          <Button className="secondary" onClick={handleStandardReservation}>
            일반 예약
          </Button>
        </Card>
      </Content>
    </ScreenContainer>
  );
};

export default ReservationChoice;
