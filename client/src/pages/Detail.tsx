import { AnimatePresence, motion } from "framer-motion";
import { ObjectId } from "mongoose";
import { useEffect, useRef } from "react";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import CommentWrite from "../components/layout/Feed/CommentWrite";
import Meatballs, { Overlay } from "../components/layout/Feed/Meatballs";
import Section from "../components/layout/Feed/Section";
import {
  commentDelete,
  getFeed,
  ICommentDelete,
  IGetFeed,
} from "../utills/api";
import { userAtom } from "../utills/atoms";
import { elapsedTime, ModalScrollPrevent } from "../utills/utill";

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
  height: 100%;
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
  margin-right: 10px;
`;

const ProfileId = styled.div`
  padding: 0;
  font-size: 1em;
  font-weight: 600;
  margin-right: 8px;
  color: ${(props) => props.theme.textColor};
`;
const Comments = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 225px);
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  //스크롤해야하고 크기 나머지 부위 빼서적용
`;
const Comment = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px 16px;
  align-items: center;
`;
const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
`;
const CommentText = styled.div`
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4px 0;
`;
const CommentOption = styled.div`
  color: ${(props) => props.theme.textLightColor};
  font-size: 12px;
  font-weight: 400;
  display: flex;
  gap: 6px;
`;
const OptionItem = styled.span`
  cursor: pointer;
`;
const BottomFixed = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
`;

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { feedId } = useParams();
  const user = useRecoilValue(userAtom);
  const DetailRef = useRef<HTMLDivElement>(null);
  const isMutating = useIsMutating();

  const { data, isLoading } = useQuery<IGetFeed>("feed", () =>
    getFeed(feedId as string)
  );

  const commentDeleteMutation = useMutation(
    (data: ICommentDelete) => commentDelete(data),
    {
      onSettled: () => {
        queryClient.invalidateQueries("allFeed");
        queryClient.invalidateQueries("feed");
        queryClient.invalidateQueries("myFeed");
      },
    }
  );

  const commentDeleteFn = (feedId: ObjectId, _id: ObjectId) => {
    if (!isMutating) {
      const deleteData = { feedId, _id };
      commentDeleteMutation.mutate(deleteData);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (DetailRef.current && !DetailRef.current.contains(e.target as Node)) {
        navigate(location.state?.backgroundLocation.pathname, {
          state: { scroll: "fixed" },
        });
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [DetailRef, location.state?.backgroundLocation.pathname, navigate]);

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
                          <ProfileId>{data?.writerProfile.id}</ProfileId>
                        </Link>
                      </FeedProfile>
                      <Meatballs feed={data as IGetFeed} />
                    </FeedHeader>
                    <Comments>
                      <Comment>
                        <Link to={`/${data?.writerProfile.id}`}>
                          <ProfileImg src={data?.writerProfile.profileImage} />
                        </Link>
                        <CommentContent>
                          <Row>
                            <Link to={`/${data?.writerProfile.id}`}>
                              <ProfileId>{data?.writerProfile.id}</ProfileId>
                            </Link>
                            <CommentText>{data?.content.text}</CommentText>
                          </Row>
                        </CommentContent>
                      </Comment>
                      {data?.comments.map((comment, idx) => (
                        <Comment key={idx}>
                          <Link to={`/${comment.writerProfile.id}`}>
                            <ProfileImg
                              src={comment.writerProfile.profileImage}
                            />
                          </Link>
                          <CommentContent>
                            <Row>
                              <Link to={`/${comment.writerProfile.id}`}>
                                <ProfileId>
                                  {comment.writerProfile.id}
                                </ProfileId>
                              </Link>
                              <CommentText>{comment.comment}</CommentText>
                            </Row>
                            <CommentOption>
                              {elapsedTime(comment.createDate)}
                              {comment.writer === user?._id ||
                              data.writer === user?._id ? (
                                <OptionItem
                                  onClick={() =>
                                    commentDeleteFn(data._id, comment._id)
                                  }
                                >
                                  삭제
                                </OptionItem>
                              ) : null}
                            </CommentOption>
                          </CommentContent>
                        </Comment>
                      ))}
                    </Comments>
                    <BottomFixed>
                      <Section
                        feedId={data?._id as ObjectId}
                        feedLikeList={data?.likeList as ObjectId[]}
                        feedCreate={data?.createDate}
                      />
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
