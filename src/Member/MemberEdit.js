import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';


// 스타일 컴포넌트 정의
const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 350px;
`;

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 350px;
  padding: 1rem;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
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

const ScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f4f8;
  padding: 0 2rem;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 2rem;
  overflow: visible;
  position: relative;
`;

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

const MemberEdit = () => {
  const [memberInfo, setMemberInfo] = useState({
    patientName: '',
    gender: '',
    age: '',
    weight: '',
    height: '',
    bloodType: '',
  });
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 기존 회원 정보 가져오기
    const fetchMemberInfo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/member/me`, {
          withCredentials: true,
        });
        setMemberInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member info:', error);
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo({
      ...memberInfo,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchCsrfToken = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, {
                withCredentials: true,
            });
            setCsrfToken(response.data.token);  // 받아온 CSRF 토큰을 상태로 저장
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    };

    fetchCsrfToken();
}, []);

const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        // 회원 정보 업데이트 요청 시 CSRF 토큰을 함께 보냄
        await axios.put(`${process.env.REACT_APP_API_SERVER}/api/member/update`, memberInfo, {
            withCredentials: true,
            headers: {
                'X-XSRF-TOKEN': csrfToken,  // CSRF 토큰을 헤더에 추가
            },
        });
        alert('회원 정보가 성공적으로 수정되었습니다.');
        navigate('/member/profile'); // 프로필 페이지로 이동
    } catch (error) {
        console.error('Error updating member info:', error);
        alert('회원 정보 수정에 실패했습니다.');
    }
};


  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <ScreenWrapper>
      <MainContent>
        <BackButton onClick={() => navigate('/member/profile')}>
          <FaArrowLeft />
        </BackButton>
        <Title>회원 정보 수정</Title>
        <Form onSubmit={handleFormSubmit}>
          <InputGroup>
            <Label htmlFor="patientName">이름</Label>
            <Input
              id="patientName"
              name="patientName"
              value={memberInfo.patientName}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="gender">성별</Label>
            <Select
              id="gender"
              name="gender"
              value={memberInfo.gender}
              onChange={handleInputChange}
            >
              <option value="">선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="age">나이</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={memberInfo.age}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="weight">몸무게</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={memberInfo.weight}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="height">키</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={memberInfo.height}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="bloodType">혈액형</Label>
            <Select
              id="bloodType"
              name="bloodType"
              value={memberInfo.bloodType}
              onChange={handleInputChange}
            >
              <option value="">선택</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </Select>
          </InputGroup>
          <Button type="submit">정보 수정</Button>
        </Form>
        <BottomNavBar>
          <NavIcon onClick={() => navigate('/member/dashboard')}>
            <FaHome />
            <span>홈</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/reservation-choice')}>
            <FaCalendarCheck />
            <span>예약</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/member/profile')}>
            <FaUser />
            <span>프로필</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/')}>
            <FaCog />
            <span>로그아웃</span>
          </NavIcon>
        </BottomNavBar>
      </MainContent>
    </ScreenWrapper>
  );
};

export default MemberEdit;
