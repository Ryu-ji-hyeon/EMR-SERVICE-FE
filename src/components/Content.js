import styled from "styled-components";

const Content = styled.div`
  width: 100%;
  max-width: 400px; /* 최대 너비를 설정하여 가운데 정렬 */
  background-color: #ffffff;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 살짝의 그림자 효과 */
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 작은 화면 (예: 모바일) */
  @media (max-width: 480px) {
    padding: 1rem;
  }

  /* 중간 화면 (예: 태블릿) */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.5rem;
  }

  /* 큰 화면 (예: 데스크톱) */
  @media (min-width: 769px) {
    padding: 2rem;
  }
`;


export default Content;
