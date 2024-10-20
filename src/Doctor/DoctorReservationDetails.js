import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaHome, FaCalendarCheck, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';


const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PrescriptionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PrescriptionItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PrescriptionDetail = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #555;

  strong {
    font-weight: bold;
    color: #333;
  }
`;

const NoPrescriptionsMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
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

const DoctorReservationDetails = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');
    const location = useLocation();
    const { reservationId } = location.state || {};
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/doctor/reservations'); // ReservationChoice로 이동
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
        const fetchPrescriptions = async () => {
            if (!reservationId) {
                console.error('Reservation ID is missing');
                return;
            }
            if (!csrfToken) {
                console.error('CSRF token is missing');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/prescriptions/reservation/${reservationId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'X-XSRF-TOKEN': csrfToken,
                    },
                    withCredentials: true
                });

                if (response.data && response.data.length > 0) {
                    setPrescriptions(response.data);
                } else {
                    setPrescriptions([]);
                    console.warn('No prescriptions found');
                }
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };

        if (csrfToken) {
            fetchPrescriptions();
        }
    }, [reservationId, csrfToken]);

    return (
        <ScreenContainer>
            <MainContent>
        { <BackButton onClick={handleGoBack}>
          <FaArrowLeft />
        </BackButton> }
            <Content>
                <Title>처방전 목록</Title>
                {prescriptions.length > 0 ? (
                    <PrescriptionList>
                        {prescriptions.map((prescription) => (
                            <PrescriptionItem key={prescription.prescriptionId}>
                                <PrescriptionDetail><strong>약물:</strong> {prescription.medication}</PrescriptionDetail>
                                <PrescriptionDetail><strong>용량:</strong> {prescription.dosage}</PrescriptionDetail>
                                <PrescriptionDetail><strong>지침:</strong> {prescription.instructions}</PrescriptionDetail>
                                <PrescriptionDetail><strong>날짜:</strong> {new Date(prescription.date).toLocaleString()}</PrescriptionDetail>
                            </PrescriptionItem>
                        ))}
                    </PrescriptionList>
                ) : (
                    <NoPrescriptionsMessage>처방전이 없습니다.</NoPrescriptionsMessage>
                )}
            </Content>

            <BottomNavBar>
          <NavIcon onClick={() => navigate('/doctor/dashboard')}>
            <FaHome />
            <span>홈</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/doctor/reservations')}>
            <FaCalendarCheck />
            <span>예약 확인</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/doctor/profile')}>
            <FaUser />
            <span>프로필</span>
          </NavIcon>
          <NavIcon onClick={() => navigate('/')}>
            <FaCog />
            <span>로그아웃</span>
          </NavIcon>
        </BottomNavBar>
      </MainContent>
        </ScreenContainer>
    );
};

export default DoctorReservationDetails;
