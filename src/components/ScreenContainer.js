import styled from "styled-components";

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f8;
  padding: 1rem;

  /* 작은 화면 (예: 모바일) */
  @media (max-width: 480px) {
    padding: 0.5rem;
  }

  /* 중간 화면 (예: 태블릿) */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1rem;
  }

  /* 큰 화면 (예: 데스크톱) */
  @media (min-width: 769px) {
    padding: 2rem;
  }
`;

export default ScreenContainer;
