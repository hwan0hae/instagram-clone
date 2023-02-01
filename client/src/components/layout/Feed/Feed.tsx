import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllFeed, IGetFeed } from "../../../utills/api";
import Meatballs from "./Meatballs";
import CommentWrite from "./CommentWrite";
import Section from "./Section";

const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid ${(props) => props.theme.containerLine};
  border-radius: 50%;
  background-color: white;
`;

export const ProfileId = styled.div`
  padding: 0;
  font-size: 1em;
  font-weight: 600;

  color: ${(props) => props.theme.textColor};
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
`;
const FeedImg = styled.img`
  width: 100%;
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

function Feed() {
  const location = useLocation();
  const { data, isLoading } = useQuery<IGetFeed[]>("allFeed", getAllFeed);
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
                  <Link to={`/${feed?.writerProfile.id}`}>
                    <ProfileId style={{ marginLeft: "10px", fontWeight: 600 }}>
                      {feed?.writerProfile.id}
                    </ProfileId>
                  </Link>
                </FeedProfile>
                <Meatballs />
              </FeedHeader>
              <FeedImgContainer>
                <FeedImg src={feed.content.feedImage} />
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

export default Feed;