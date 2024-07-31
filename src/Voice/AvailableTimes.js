import React from 'react';

const AvailableTimes = ({ availableTimes, onTimeClick, selectedDate }) => (
  <div>
    <h2>예약 가능한 시간대</h2>
    {selectedDate && <p>선택된 날짜: {selectedDate}</p>}
    {availableTimes.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {availableTimes.map((time) => (
          <button 
            key={time} 
            onClick={() => onTimeClick(time)} 
            style={{ padding: '10px', textAlign: 'center' }}
          >
            {time.slice(0, 5)}
          </button>
        ))}
      </div>
    ) : (
      <p>선택된 날짜에 예약 가능한 시간대가 없습니다.</p>
    )}
  </div>
);

export default AvailableTimes;
