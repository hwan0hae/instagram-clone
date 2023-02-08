import styled from "styled-components";
import Feed from "../components/layout/Feed/Feeds";
import StoryHeader from "../components/layout/Feed/StoryHeader";

export const Wrapper = styled.div`
  width: calc(100% - 72px);
  position: relative;
  left: 72px;
  display: flex;
  justify-content: center;
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
