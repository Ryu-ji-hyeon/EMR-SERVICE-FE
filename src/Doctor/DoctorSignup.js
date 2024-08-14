import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  padding: 0.75rem;
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

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
`;

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    doctorLoginId: '',
    doctorPw: '',
    doctorName: '',
    deptId: ''
  });
  const [depts, setDepts] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 부서 목록을 서버에서 가져옵니다.
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/departments`, { withCredentials: true })
      .then(response => setDepts(response.data))
      .catch(error => console.error('Error fetching departments:', error));

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
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/doctor/signup`, formData, {
      headers: {
        'X-XSRF-TOKEN': csrfToken
      },
      withCredentials: true
    })
      .then(response => {
        console.log('Signup successful:', response.data);
        alert('회원가입이 성공적으로 완료되었습니다.');
        navigate('/home/loginForm');
      })
      .catch(error => {
        console.error('Error during signup:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <ScreenContainer>
      <Content>
        <h3>의사 회원가입</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="doctorLoginId">아이디</Label>
            <Input
              type="text"
              id="doctorLoginId"
              name="doctorLoginId"
              value={formData.doctorLoginId}
              onChange={handleChange}
              placeholder="아이디 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="doctorPw">비밀번호</Label>
            <Input
              type="password"
              id="doctorPw"
              name="doctorPw"
              value={formData.doctorPw}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="doctorName">의사 이름</Label>
            <Input
              type="text"
              id="doctorName"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="의사 이름 입력"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="dept">부서</Label>
            <Select
              id="dept"
              name="deptId"
              value={formData.deptId}
              onChange={handleChange}
              required
            >
              <option value="">선택하세요</option>
              {depts.map(dept => (
                <option key={dept.deptId} value={dept.deptId}>
                  {dept.deptName}
                </option>
              ))}
            </Select>
          </FormGroup>
          <Button type="submit">회원가입</Button>
        </form>
      </Content>
    </ScreenContainer>
  );
};

export default DoctorSignup;
