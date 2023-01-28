import { AnimatePresence, motion } from "framer-motion";
import { ObjectId } from "mongoose";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CommentWrite from "../components/layout/Feed/CommentWrite";
import Meatballs, { Overlay } from "../components/layout/Feed/Meatballs";
import Section from "../components/layout/Feed/Section";
import { getFeed, IGetFeed } from "../utills/api";
import { ModalScrollPrevent } from "../utills/utill";

const Container = styled(motion.div)`
  background-color: ${(props) => props.theme.menuColor};
  width: 100%;

  max-width: 1300px; //조정할것
  max-height: 910px;
  margin: 40px;
  border-radius: 5px;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  z-index: 999;
  height: 100%;
  @media screen and (max-width: 1000px) {
    height: 450px;
  }
`;
const FeedContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 450px;
  max-height: 910px;
  width: 100%;
  height: 100%;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
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
const FeedContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Comments = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 201px);
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  //스크롤해야하고 크기 나머지 부위 빼서적용
`;
const Comment = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const CommentText = styled.div`
  margin-left: -8px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
`;

const BottomFixed = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
`;

function Detail() {
  const navigate = useNavigate();
  const { feedId } = useParams();
  const DetailRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<IGetFeed>("feed", () =>
    getFeed(feedId as string)
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (DetailRef.current && !DetailRef.current.contains(e.target as Node)) {
        navigate("/");
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [DetailRef, navigate]);

  ModalScrollPrevent();

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
              {isLoading ? null : (
                <>
                  <FeedImgContainer>
                    <FeedImg src={data?.content.feedImage} />
                  </FeedImgContainer>
                  <ContentsBox>
                    <FeedHeader>
                      <FeedProfile>
                        <Link to={`/${data?.writerProfile.id}`}>
                          <ProfileImg src={data?.writerProfile.profileImage} />
                        </Link>
                        <Link to={`/${data?.writerProfile.id}`}>
                          <ProfileId
                            style={{ marginLeft: "10px", fontWeight: 600 }}
                          >
                            {data?.writerProfile.id}
                          </ProfileId>
                        </Link>
                      </FeedProfile>
                      <Meatballs />
                    </FeedHeader>
                    <Comments>
                      <FeedContent>
                        <FeedProfile>
                          <Link to={`/${data?.writerProfile.id}`}>
                            <ProfileImg
                              src={data?.writerProfile.profileImage}
                            />
                          </Link>
                          <Link to={`/${data?.writerProfile.id}`}>
                            <ProfileId
                              style={{ marginLeft: "10px", fontWeight: 600 }}
                            >
                              {data?.writerProfile.id}
                            </ProfileId>
                          </Link>
                        </FeedProfile>
                        <CommentText>{data?.content.text}</CommentText>
                      </FeedContent>
                      {data?.comments.map((comment, idx) => (
                        <Comment key={idx}>
                          <FeedProfile>
                            <Link to={`/${comment.writerProfile.id}`}>
                              <ProfileImg
                                src={comment.writerProfile.profileImage}
                              />
                            </Link>
                            <Link to={`/${comment.writerProfile.id}`}>
                              <ProfileId
                                style={{ marginLeft: "10px", fontWeight: 600 }}
                              >
                                {comment.writerProfile.id}
                              </ProfileId>
                            </Link>
                          </FeedProfile>
                          <CommentText>{comment.comment}</CommentText>
                        </Comment>
                      ))}
                    </Comments>
                    <BottomFixed>
                      <Section feedId={data?._id as ObjectId} />
                      <CommentWrite feedId={data?._id as ObjectId} index={0} />
                    </BottomFixed>
                  </ContentsBox>
                </>
              )}
            </FeedContainer>
          </Container>
        </Overlay>
      </AnimatePresence>
    </>
  );
}

export default Detail;
