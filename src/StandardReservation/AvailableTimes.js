import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AvailableTimes = ({ availableTimes, onTimeClick, selectedDate }) => {
  // 4x4 그리드로 나누기
  const gridTimes = [];
  for (let i = 0; i < availableTimes.length; i += 4) {
    gridTimes.push(availableTimes.slice(i, i + 4));
  }

  return (
    <div className="available-times-container mt-4">
      <h5>{selectedDate ? `${selectedDate}의 예약 가능한 시간` : '날짜를 선택하세요'}</h5>
      <div className="container">
        {gridTimes.map((row, rowIndex) => (
          <div key={rowIndex} className="row mb-2">
            {row.map((time, colIndex) => (
              <div key={colIndex} className="col-3 d-flex justify-content-center">
                <button 
                  className="btn btn-outline-dark" 
                  style={{ width: '90px', margin: '5px' }}
                  onClick={() => onTimeClick(time)}
                >
                  {time.slice(0, 5)} {/* 시:분 까지만 나타내기 */}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableTimes;
