import styled from "styled-components";

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  padding-bottom: 224px;
  flex-direction: column;
`;
const Row = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;

  flex-wrap: wrap;
`;
const Feed = styled.div`
  width: 31.35%;
  background-color: white;
  cursor: pointer;

  :after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;
export default function MypageFeed() {
  return (
    <Container>
      <Row>
        <Feed></Feed>
        <Feed></Feed>
        <Feed></Feed>
      </Row>
      <Row>
        <Feed></Feed>
        <Feed></Feed>
        <Feed></Feed>
      </Row>
    </Container>
  );
}
