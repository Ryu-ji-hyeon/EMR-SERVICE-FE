import React from 'react';

const DoctorDashboard = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h3>Doctor Dashboard</h3>
            </div>
            <div className="card-body">
              <p>의사만 접근 가능한 내용</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
