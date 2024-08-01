import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment);

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
        const response = await axios.get('http://localhost:8080/api/reservations', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        console.log('Server Response:', response.data); // 서버 응답 데이터 출력

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

  const TimeSlotWrapper = ({ children, value }) => {
    const hour = value.getHours();
    const isLunchTime = hour === 12;
  
    return React.cloneElement(children, {
      style: {
        ...children.props.style,
        backgroundColor: isLunchTime ? 'gray' : (children.props.style && children.props.style.backgroundColor),
      },
    });
  };

  // 특정 요일 비활성화
  const disabledDays = [0, 2, 4, 6]; // 일요일, 화요일, 목요일, 토요일

  const CustomDateCellWrapper = ({ children, value }) => {
    const day = value.getDay();
    const isDisabledDay = disabledDays.includes(day);
    const isToday = moment(value).isSame(moment(), 'day'); // 오늘 날짜 확인
  
    return React.cloneElement(children, {
      style: {
        ...children.props.style,
        backgroundColor: isDisabledDay ? '#e0e0e0' : 'white',
        color: isDisabledDay ? '#999999' : 'inherit',
        pointerEvents: isDisabledDay ? 'none' : 'auto',
        position: 'relative',
        border: isToday ? '2px solid blue' : 'none', // 오늘 날짜 강조
      },
      children: (
        <div>
          {children.props.children}
          {isDisabledDay && (
            <div className="disabled-day-overlay">
              예약 불가
            </div>
          )}
        </div>
      ),
    });
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        step={30}  // 30분 단위
        timeslots={1}  // 각 시간 슬롯을 1개로 나눔 (즉, 30분 단위)
        min={new Date(2024, 7, 24, 9, 0)}  // 시작 시간: 오전 9시
        max={new Date(2024, 7, 24, 18, 0)} // 끝 시간: 오후 6시
        eventPropGetter={() => {
          return {
            style: {
              backgroundColor: 'transparent',  // 배경색을 투명으로 설정
              border: 'none'                   // 테두리를 제거
            }
          };
        }}
        components={{
          dateCellWrapper: CustomDateCellWrapper,
          timeSlotWrapper: TimeSlotWrapper
        }}
        views={['month']}  // 월간 뷰만 보이도록 설정
        onSelectSlot={slotInfo => onDateClick(slotInfo.start)}  // 날짜 클릭 시 onDateClick 함수 호출
        selectable
      />
    </div>
  );
};

export default ResulvationCalender;
