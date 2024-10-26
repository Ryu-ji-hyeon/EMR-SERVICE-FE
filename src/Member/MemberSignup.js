import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
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
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1.1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #2260ff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1.1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #2260ff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1.2rem;
  background-color: #2260ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5rem;

  &:hover {
    background-color: #1c3faa;
  }
`;

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #2260ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #1c3faa;
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
  const [csrfToken, setCsrfToken] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
        setShowSuccessModal(true); // 성공 모달 표시
      })
      .catch(error => {
        console.error('회원가입 실패:', error);
        setShowErrorModal(true); // 실패 모달 표시
      });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/home/loginForm'); // 회원가입 성공 시 로그인 페이지로 이동
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleGoBack = () => {
    navigate('/home/choiceMember');
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton>

        {/* 회원가입 성공 모달 */}
        {showSuccessModal && (
          <ModalOverlay>
            <ModalContainer>
              <h3>회원가입 성공</h3>
              <p>회원가입이 성공적으로 완료되었습니다.</p>
              <ModalButton onClick={handleCloseSuccessModal}>확인</ModalButton>
            </ModalContainer>
          </ModalOverlay>
        )}

        {/* 회원가입 실패 모달 */}
        {showErrorModal && (
          <ModalOverlay>
            <ModalContainer>
              <h3>회원가입 실패</h3>
              <p>회원가입 중 오류가 발생했습니다. 다시 시도해주세요.</p>
              <ModalButton onClick={handleCloseErrorModal}>확인</ModalButton>
            </ModalContainer>
          </ModalOverlay>
        )}

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
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PatientRegistrationForm;
