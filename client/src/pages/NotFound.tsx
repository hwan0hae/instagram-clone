import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { isLoginAtom } from "../utills/atoms";
import { Wrapper as LoginWrapper } from "./Home";
import { Wrapper } from "./Login";
const Container = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.textColor};
  align-items: center;
`;
const NotPage = styled.div`
  font-size: 24px;
  font-weight: 600;
`;
const Description = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin: 40px 0;
`;
const LinkText = styled.span`
  color: ${(props) => props.theme.blue.lightBlue};
`;
function NotFound() {
  const isLogin = useRecoilValue(isLoginAtom);
  return (
    <>
      <Helmet>
        <title>페이지를 찾을 수 없습니다.</title>
        {/* meta태그 SEO 검색엔진 */}
      </Helmet>
      {isLogin ? (
        <LoginWrapper>
          <Container>
            <NotPage>죄송합니다. 페이지를 사용할 수 없습니다.</NotPage>
            <Description>
              클릭하신 링크가 잘못되었거나 페이지가 삭제되었습니다.{" "}
              <Link to={"/"}>
                <LinkText>Instagram으로 돌아가기. </LinkText>
              </Link>
            </Description>
          </Container>
        </LoginWrapper>
      ) : (
        <Wrapper>
          <Container>
            <NotPage>죄송합니다. 페이지를 사용할 수 없습니다.</NotPage>
            <Description>
              클릭하신 링크가 잘못되었거나 페이지가 삭제되었습니다.{" "}
              <Link to={"/"}>
                <LinkText>Instagram으로 돌아가기. </LinkText>
              </Link>
            </Description>
          </Container>
        </Wrapper>
      )}
    </>
  );
}

export default NotFound;
