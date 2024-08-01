import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => (
  <div className="home-container">
    <div className="overlay"></div>
    <div className="content">
      <h1 className="display-4">AI 음성 인식 기반 EMR 예약 서비스</h1>
      <p className="lead">안전하고 효율적인 전자 의료 기록 관리.</p>
      <div className="button-group">
        <Link className="btn btn-dark-gray btn-lg mx-2" to="/home/loginForm">로그인</Link>
        <Link className="btn btn-light-gray btn-lg mx-2" to="/home/choiceMember">회원가입</Link>
      </div>
    </div>
  </div>
);

export default Home;
