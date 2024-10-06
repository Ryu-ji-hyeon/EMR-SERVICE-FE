import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer'; // 기존 스타일 컴포넌트 사용
import Content from '../components/Content'; // 기존 스타일 컴포넌트 사용
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';


const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #2260ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #1c3faa;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
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

const EditPrescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationId } = location.state || {};

  const [csrfToken, setCsrfToken] = useState('');
  const [prescription, setPrescription] = useState({
    medication: '',
    dosage: '',
    instructions: '',
  });

  const handleGoBack = () => {
    navigate('/doctor/reservations');
  };

  useEffect(() => {
    const fetchCsrfTokenAndPrescription = async () => {
      try {
        const csrfResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true });
        setCsrfToken(csrfResponse.data.token);

        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/prescriptions/reservation/${reservationId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-XSRF-TOKEN': csrfResponse.data.token,
          },
          withCredentials: true,
        });

        if (response.data.length > 0) {
          setPrescription(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching prescription data:', error);
      }
    };

    fetchCsrfTokenAndPrescription();
  }, [reservationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${process.env.REACT_APP_API_SERVER}/api/prescriptions/update/${reservationId}`, prescription, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-XSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });
      alert('처방전이 성공적으로 수정되었습니다.');
      navigate('/doctor/reservations');
    } catch (error) {
      console.error('Error updating prescription:', error);
      alert('처방전 수정에 실패했습니다.');
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
        <Title>처방전 수정</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>약물</Label>
            <Input type="text" name="medication" value={prescription.medication} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>용량</Label>
            <Input type="text" name="dosage" value={prescription.dosage} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>지침</Label>
            <TextArea name="instructions" value={prescription.instructions} onChange={handleChange} required />
          </FormGroup>
          <Button type="submit">처방전 수정</Button>
        </form>
      </Content>

      <BottomNavBar>
          <NavIcon to="/doctor/dashboard">
            <FaHome />
            <span>홈</span>
          </NavIcon>
          <NavIcon to="/doctor/reservations">
            <FaCalendarCheck />
            <span>예약 확인</span>
          </NavIcon>
          <NavIcon to="/profile">
            <FaUser />
            <span>프로필</span>
          </NavIcon>
          <NavIcon to="/">
            <FaCog />
            <span>로그아웃</span>
          </NavIcon>
        </BottomNavBar>
      </MainContent>
    </ScreenContainer>
  );
};

export default EditPrescription;
