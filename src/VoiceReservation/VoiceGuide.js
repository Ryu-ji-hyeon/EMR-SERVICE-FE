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

const Text = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
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
  background-color: #2260ff;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1c3faa;
  }

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.5rem;
  }
`;

const VoiceGuide = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/Voice/DepartmentDoctorSelection');
  };

  return (
    <ScreenContainer>
      <Content>
        <Title>음성 안내 예약 주의사항</Title>
        <Card>
          <Text>
            음성 안내 예약 시스템을 사용하기 전에 주의사항을 읽어주세요.
            이 시스템은 음성 인식 기술을 사용하여 예약을 진행합니다.
          </Text>
          <Text>
            음성 인식의 정확성을 위해 주변 환경이 조용한 곳에서 사용해 주세요.
          </Text>
          <Button onClick={handleConfirm}>확인</Button>
        </Card>
      </Content>
    </ScreenContainer>
  );
};

export default VoiceGuide;
