import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { getHomeFeed, IGetFeed, ILike, likeUpdate } from "../../../utills/api";
import Meatballs from "./Meatballs";
import CommentWrite from "./CommentWrite";
import Section from "./Section";
import { useState } from "react";
import { ObjectId } from "mongoose";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../../utills/atoms";
import { elapsedTime } from "../../../utills/utill";

const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid ${(props) => props.theme.containerLine};
  border-radius: 50%;
  background-color: white;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-size: 1em;
  font-weight: 600;
`;
export const ProfileId = styled.div`
  font-size: 1em;
  font-weight: 600;

  color: ${(props) => props.theme.textColor};
`;
const ElapsedTime = styled.div`
  font-size: 1em;
  font-weight: 600;

  color: ${(props) => props.theme.textLightColor};
`;
const FeedContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.containerColor};
  border: 1px solid ${(props) => props.theme.containerLine};
  margin: 0 -1px 12px -1px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const FeedHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const FeedProfile = styled.div`
  margin: 8px 4px 8px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const SvgBtn = styled.button`
  width: 40px;
  height: 40px;
  padding: 8px;
  margin-right: 4px;
  border: none;
  background-color: transparent;

  cursor: pointer;

  :hover {
    filter: brightness(0.7);
  }
`;
export const Svg = styled.svg`
  fill: ${(props) => props.theme.textColor};

  stroke: ${(props) => props.theme.textColor};
  stroke-width: 1px;

  width: 24px;
  height: 24px;

  position: relative;
  background-color: transparent;
`;

const FeedImgContainer = styled.div`
  line-height: 0;
  aspect-ratio: 1 / 1;
  max-height: 585px;
  position: relative;
  display: flex;
  align-items: center;
`;
const FeedImg = styled.img`
  width: 100%;
  height: 100%;
`;

const FeedContentContainer = styled.div`
  padding: 0px 12px 12px 12px;
`;

const FeedContentBox = styled.div`
  display: flex;
  flex-direction: row;

  gap: 6px;
`;
const FeedText = styled.div`
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
`;

const FeedComments = styled.div`
  font-weight: 500;
  color: ${(props) => props.theme.textLightColor};
  margin: 6px 0;
`;
const FeedCommentBox = styled(FeedContentBox)`
  margin-bottom: 0;
`;

const DoubleClickedHeart = styled(motion.svg)`
  width: 100px;
  height: 100px;
  fill: white;
  z-index: 100;
  position: absolute;
  left: calc(50% - 50px);
  top: calc(50% - 50px);

  /* transform: translate(-50%, -50%); */
`;
const visible = {
  scale: 1,
  opacity: 1,
  transition: {
    duration: 0.7,
    type: "spring",
    stiffness: 220,
  },
};
const unVisible = {
  scale: 0,
  opacity: 0,
  transition: {
    duration: 0.3,
    type: "tween",
  },
};
function Feeds() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const user = useRecoilValue(userAtom);
  const { data, isLoading } = useQuery<IGetFeed[]>("homeFeed", getHomeFeed);
  const isMutating = useIsMutating();

  const likeMutation = useMutation((likeData: ILike) => likeUpdate(likeData), {
    onSettled: () => {
      queryClient.invalidateQueries("allFeed");
      queryClient.invalidateQueries("feed");
    },
  });
  const [clickedFeed, setClickedFeed] = useState<ObjectId | null>(null);

  const heartDamping = (feedId: ObjectId) => {
    setClickedFeed(feedId);
    setTimeout(() => {
      setClickedFeed(null);
    }, 700);
  };
  const imgDoubleClicked = (feedId: ObjectId, likeList: ObjectId[]) => {
    heartDamping(feedId);
    const check = likeList.filter((_id) => _id === user?._id);

    if (check.length === 0) {
      if (!isMutating) likeMutation.mutate({ like: true, feedId });
    }
  };
  return (
    <>
      {isLoading ? null : (
        <>
          {data?.map((feed, index) => (
            <FeedContainer key={index}>
              <FeedHeader>
                <FeedProfile>
                  <Link to={`/${feed?.writerProfile.id}`}>
                    <ProfileImg src={feed?.writerProfile.profileImage} />
                  </Link>
                  <Row>
                    <Link to={`/${feed?.writerProfile.id}`}>
                      <ProfileId
                        style={{ marginLeft: "10px", fontWeight: 600 }}
                      >
                        {feed?.writerProfile.id}
                      </ProfileId>
                    </Link>
                    <ElapsedTime>﹒{elapsedTime(feed?.createDate)}</ElapsedTime>
                  </Row>
                </FeedProfile>
                <Meatballs feed={feed} />
              </FeedHeader>
              <FeedImgContainer
                onDoubleClick={() => imgDoubleClicked(feed._id, feed.likeList)}
              >
                <FeedImg src={feed.content.feedImage} />
                <AnimatePresence>
                  {clickedFeed === feed._id && (
                    <DoubleClickedHeart
                      initial={{ scale: 0, opacity: 0 }}
                      animate={visible}
                      exit={unVisible}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </DoubleClickedHeart>
                  )}
                </AnimatePresence>
              </FeedImgContainer>
              <Section feedId={feed._id} feedLikeList={feed.likeList} />
              <FeedContentContainer>
                <FeedContentBox>
                  <Link to={`/${feed?.writerProfile.id}`}>
                    <ProfileId>{feed?.writerProfile.id}</ProfileId>
                  </Link>
                  <FeedText>{feed.content.text}</FeedText>
                </FeedContentBox>

                {(feed.comments.length as number) !== 0 ? (
                  <>
                    <Link
                      to={`/feed/${feed._id}`}
                      state={{ backgroundLocation: location }}
                    >
                      <FeedComments>
                        댓글 {feed.comments.length}개 모두 보기
                      </FeedComments>
                    </Link>
                    <FeedCommentBox>
                      <Link to={`/${feed?.comments[0].writerProfile.id}`}>
                        <ProfileId>
                          {feed?.comments[0].writerProfile.id}
                        </ProfileId>
                      </Link>
                      <FeedText>{feed.comments[0].comment}</FeedText>
                    </FeedCommentBox>
                  </>
                ) : null}
              </FeedContentContainer>

              <CommentWrite feedId={feed._id} index={index} />
            </FeedContainer>
          ))}
        </>
      )}
    </>
  );
}

export default Feeds;
