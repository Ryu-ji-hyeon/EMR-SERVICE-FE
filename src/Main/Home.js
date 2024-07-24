import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // 스타일 파일 추가


const Home = () => (
  <div className="container-fluid bg-color text-center text-white">
    <div className="overlay"></div>
    <div className="content">
      <h1 className="display-4">Welcome to the EMR Service</h1>
      <p className="lead">Efficient and secure management of electronic medical records.</p>
      <Link className="btn btn-outline-light btn-lg mx-2" to="/home/loginForm">로그인</Link>
      <Link className="btn btn-outline-info btn-lg mx-2" to="/home/choiceMember">회원가입</Link>
    </div>
  </div>
);

export default Home;
