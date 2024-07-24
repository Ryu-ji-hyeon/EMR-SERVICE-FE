// src/Voice/ReservationCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const ReservationCalendar = () => {
  const [events, setEvents] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');


  useEffect(() => {
    // CSRF 토큰을 서버에서 가져옵니다.
    axios.get('http://localhost:8080/api/csrf-token', { withCredentials: true })
      .then(response => setCsrfToken(response.data.token))
      .catch(error => console.error('Error fetching CSRF token:', error));
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reservations'); // 실제 API 경로 사용
      const reservations = response.data.map(reservation => ({
        title: reservation.available ? 'Available' : 'Unavailable',
        start: new Date(reservation.date + 'T' + reservation.startTime),
        end: new Date(reservation.date + 'T' + reservation.endTime),
        allDay: false,
        available: reservation.available
      }));
      setEvents(reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.available ? '#28a745' : '#dc3545';
    const style = {
      backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style
    };
  };

  return (
    <div style={{ height: '100vh' }}>
      <h1>예약 캘린더</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default ReservationCalendar;
