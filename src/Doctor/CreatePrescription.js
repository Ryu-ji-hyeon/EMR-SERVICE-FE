import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';


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
`;

const Textarea = styled.textarea`
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

  &:hover {
    background-color: #1c3faa;
  }
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 980px;
  min-height: calc(100vh - 70px); /* BottomNavBar의 높이만큼 뺀 값 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 5rem 2rem;
  padding-bottom: 100px; /* BottomNavBar와 겹치지 않도록 */
  overflow: visible;
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
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

// NavIcon 스타일 정의
const NavIcon = styled(Link)`
  font-size: 1.5rem;
  color: #007bff;
  text-decoration: none;
  text-align: center;

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

const CreatePrescription = () => {
    const [csrfToken, setCsrfToken] = useState('');
    const [medication, setMedication] = useState('');
    const [dosage, setDosage] = useState('');
    const [instructions, setInstructions] = useState('');

    const location = useLocation();
    const { reservationId } = location.state || {};

    const [reservation, setReservation] = useState(null);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/doctor/reservations');
      };

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true });
                setCsrfToken(response.data.token);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    useEffect(() => {
        if (reservationId) {
            const fetchReservation = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/${reservationId}`, {
                        headers: {
                            'X-XSRF-TOKEN': csrfToken,
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        },
                        withCredentials: true
                    });

                    if (response.data) {
                        setReservation(response.data);
                    } else {
                        console.error('No reservation data received');
                    }
                } catch (error) {
                    console.error('Error fetching reservation:', error);
                }
            };

            fetchReservation();
        }
    }, [reservationId, csrfToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        try {
            await axios.post(
                `${process.env.REACT_APP_API_SERVER}/api/prescriptions/create/${reservationId}`,
                null,  
                {
                    headers: {
                        'X-XSRF-TOKEN': csrfToken,
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    params: {
                        medication: medication,
                        dosage: dosage,
                        instructions: instructions,
                        date: formattedDate
                    },
                    withCredentials: true
                }
            );
            alert('처방전이 성공적으로 생성되었습니다.');
            navigate(`/doctor/dashboard`);
        } catch (error) {
            console.error('처방전 생성 중 오류가 발생했습니다.', error);
            alert('처방전 생성에 실패했습니다.');
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
                <Title>처방전 작성</Title>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>약물</Label>
                        <Input 
                            type="text" 
                            value={medication} 
                            onChange={(e) => setMedication(e.target.value)} 
                            required 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>용량</Label>
                        <Input 
                            type="text" 
                            value={dosage} 
                            onChange={(e) => setDosage(e.target.value)} 
                            required 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>지침</Label>
                        <Textarea 
                            value={instructions} 
                            onChange={(e) => setInstructions(e.target.value)} 
                            required 
                        />
                    </FormGroup>
                    <Button type="submit">처방전 작성</Button>
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
          <NavIcon to="/doctor/profile">
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

export default CreatePrescription;
