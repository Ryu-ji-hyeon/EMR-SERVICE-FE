import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AvailableTimes = ({ availableTimes, onTimeClick, selectedDate }) => {
  return (
    <div className="available-times-container mt-4">
      <h5>{selectedDate ? `${selectedDate}의 예약 가능한 시간` : '날짜를 선택하세요'}</h5>
      <ul className="list-group">
        {availableTimes.map((time, index) => (
          <li key={index} className="list-group-item list-group-item-action" onClick={() => onTimeClick(time)}>
            {time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableTimes;
