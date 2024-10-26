import React from 'react';

function SplashScreen() {
  const splashScreenStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff', // 흰색 배경 설정
  };

  const logoContainerStyle = {
    position: 'relative',
    width: '500px', // 이미지 크기
    height: '500px', // 이미지 크기
  };

  const logoStyle = {
    width: '100%',
    height: '100%',
  };

  const textStyle = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '50px',
    fontWeight: 'bold',
    color: 'blue', // 텍스트 색상
  };

  return (
    <div style={splashScreenStyle}>
      <div style={logoContainerStyle}>
        <img src="/splashscreen.png" alt="App Logo" style={logoStyle} />
        <div style={textStyle}>MediConnect</div>
      </div>
    </div>
  );
}

export default SplashScreen;
