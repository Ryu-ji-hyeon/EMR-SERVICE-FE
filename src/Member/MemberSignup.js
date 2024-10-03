import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';

const FormGroup = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #2260ff;
  }

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #2260ff;
  }

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.35rem;
  background-color: #2260ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.1rem;

  &:hover {
    background-color: #1c3faa;
  }

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
`;

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    patientLoginId: '',
    patientPw: '',
    patientName: '',
    gender: '',
    age: '',
    weight: '',
    height: '',
    bloodType: ''
  });
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // CSRF 토큰을 서버에서 가져옵니다.
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true })
      .then(response => setCsrfToken(response.data.token))
      .catch(error => console.error('Error fetching CSRF token:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const memberDto = {
      patientLoginId: formData.patientLoginId,
      patientPw: formData.patientPw,
      patientName: formData.patientName,
      gender: formData.gender,
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      bloodType: formData.bloodType
    };

    axios.post(`${process.env.REACT_APP_API_SERVER}/api/member/signup`, memberDto, {
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
      .then(response => {
        console.log('회원가입 성공:', response.data);
        alert('회원가입이 성공적으로 완료되었습니다.');
        navigate('/home/loginForm');
      })
      .catch(error => {
        console.error('회원가입 실패:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <ScreenContainer>
      <Content>
        <h3>환자 회원가입</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="patientLoginId">아이디</Label>
            <Input
              type="text"
              id="patientLoginId"
              name="patientLoginId"
              value={formData.patientLoginId}
              onChange={handleChange}
              placeholder="아이디 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="patientPw">비밀번호</Label>
            <Input
              type="password"
              id="patientPw"
              name="patientPw"
              value={formData.patientPw}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="patientName">이름</Label>
            <Input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="이름 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="gender">성별</Label>
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">선택하세요</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="age">나이</Label>
            <Input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="나이 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="weight">체중</Label>
            <Input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="체중 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="height">신장</Label>
            <Input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="신장 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bloodType">혈액형</Label>
            <Select
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
            >
              <option value="">선택하세요</option>
              <option value="A">A형</option>
              <option value="B">B형</option>
              <option value="AB">AB형</option>
              <option value="O">O형</option>
            </Select>
          </FormGroup>
          <Button type="submit">회원가입</Button>
        </form>
      </Content>
    </ScreenContainer>
  );
};

export default PatientRegistrationForm;
