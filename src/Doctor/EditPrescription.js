import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer'; // 기존 스타일 컴포넌트 사용
import Content from '../components/Content'; // 기존 스타일 컴포넌트 사용

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
    </ScreenContainer>
  );
};

export default EditPrescription;
