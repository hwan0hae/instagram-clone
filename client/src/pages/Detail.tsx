import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Meatballs, { Overlay } from "../components/layout/Home/Meatballs";
import { IGetFeed } from "../utills/api";

const Container = styled(motion.div)`
  background-color: ${(props) => props.theme.menuColor};
  width: 100%;

  max-width: 1300px; //조정할것
  margin: 40px;
  border-radius: 15px;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);

  overflow: hidden;
  z-index: 999;
`;
const FeedContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 450px;
  max-height: 910px;
  width: 100%;
`;
const FeedImgContainer = styled.div`
  width: calc(100% - 500px);
  line-height: 0;
  display: flex;
  align-items: center;
  background-color: black;
  padding: 20px 0;
`;
const FeedImg = styled.img`
  width: 100%;
`;
const ContentsBox = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
`;
const FeedHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.borderLine};
`;
const FeedProfile = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid ${(props) => props.theme.containerLine};
  border-radius: 50%;
  background-color: white;
`;

const ProfileId = styled.div`
  padding: 0;
  font-size: 1em;
  font-weight: 600;

  color: ${(props) => props.theme.textColor};
`;

const FeedComments = styled.div`
  padding: 14px;
`;

function Detail() {
  const location = useLocation();
  const feed = location.state.feed as IGetFeed;
  const navigate = useNavigate();
  const DetailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (DetailRef.current && !DetailRef.current.contains(e.target as Node)) {
        navigate("/");
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [DetailRef, navigate]);

  return (
    <>
      <AnimatePresence>
        <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Container
            ref={DetailRef}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            <FeedContainer>
              <FeedImgContainer>
                <FeedImg src={feed.content.feedImage} />
              </FeedImgContainer>
              <ContentsBox>
                <FeedHeader>
                  <FeedProfile>
                    <Link to={`/${feed?.writerProfile.id}`}>
                      <ProfileImg src={feed?.writerProfile.profileImage} />
                    </Link>
                    <Link to={`/${feed?.writerProfile.id}`}>
                      <ProfileId
                        style={{ marginLeft: "10px", fontWeight: 600 }}
                      >
                        {feed?.writerProfile.id}
                      </ProfileId>
                    </Link>
                  </FeedProfile>
                  <Meatballs />
                </FeedHeader>
                <FeedComments></FeedComments>
              </ContentsBox>
            </FeedContainer>
          </Container>
        </Overlay>
      </AnimatePresence>
    </>
  );
}

export default Detail;

//게시물 db > 커맨트 추가 해서 댓글을 저장한다. 댓글을 단 사람의 정보도 같이 저장되어야함
