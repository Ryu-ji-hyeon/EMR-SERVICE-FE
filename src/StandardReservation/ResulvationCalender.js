import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';

const localizer = momentLocalizer(moment);

const CalendarContainer = styled.div`
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  font-size: 0.8em;
`;

const ResulvationCalender = ({ onDateClick }) => {
  const [events, setEvents] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/csrf-token', { withCredentials: true })
      .then(response => setCsrfToken(response.data.token))
      .catch(error => console.error('Error fetching CSRF token:', error));
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        if (Array.isArray(response.data)) {
          const reservations = response.data.map(reservation => ({
            start: new Date(reservation.date + 'T' + reservation.time),
            end: new Date(reservation.date + 'T' + reservation.time),
            allDay: false,
            color: 'red'
          }));

          setEvents(reservations);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  // 화요일과 목요일을 예약 불가 날짜로 설정
  const disabledDays = [0,2, 4,6]; // 화요일(2), 목요일(4)

  const CustomDateCellWrapper = ({ children, value }) => {
    const day = value.getDay();
    const isDisabledDay = disabledDays.includes(day);

    return React.cloneElement(children, {
      style: {
        ...children.props.style,
        backgroundColor: isDisabledDay ? '#e0e0e0' : 'white',
        color: isDisabledDay ? '#999999' : 'inherit',
        pointerEvents: isDisabledDay ? 'none' : 'auto', // 클릭 비활성화
        cursor: isDisabledDay ? 'default' : 'pointer'   // 커서 모양 변경
      }
    });
  };

  return (
    <CalendarContainer>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 300 }}
        views={['month']}
        onSelectSlot={slotInfo => {
          const day = slotInfo.start.getDay(); // 날짜 객체에서 요일 가져오기
          if (!disabledDays.includes(day)) {
            onDateClick(slotInfo.start);
          }
        }}
        selectable
        components={{
          dateCellWrapper: CustomDateCellWrapper
        }}
      />
    </CalendarContainer>
  );
};

export default ResulvationCalender;
