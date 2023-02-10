import styled from "styled-components";
import Feed from "../components/layout/Feed/Feed";
import StoryHeader from "../components/layout/Feed/StoryHeader";

export const Wrapper = styled.div`
  width: calc(100% - 72px);
  position: relative;
  margin-left: 72px;
  display: flex;
  justify-content: center;

  /** 모바일용 */
  @media screen and (max-width: 760px) {
    width: 100%;
    margin-left: 0;
    top: 60px;
  }
`;
const Container = styled.div`
  width: 470px;
`;

export default function Home() {
  return (
    <Wrapper>
      <Container>
        <StoryHeader />
        <Feed />
      </Container>
    </Wrapper>
  );
}
