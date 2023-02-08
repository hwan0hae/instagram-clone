import { ObjectId } from "mongoose";
import { useEffect, useState } from "react";
import { useIsMutating, useMutation, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Svg, SvgBtn } from "./Feed";
import { ILike, likeUpdate } from "../../../utills/api";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../../utills/atoms";
import { elapsedTime, useDidMountEffect } from "../../../utills/utill";
import LikeList from "./LikeList";
const FeedSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${(props) => props.theme.borderLine};
`;
const FeedSection = styled.div`
  display: flex;
  margin-bottom: 6px;
  padding: 6px 0 0 6px;
  justify-content: space-between;
`;
const FeedLikeCount = styled.div`
  font-weight: 600;
  padding: 0px 12px;
  margin-bottom: 4px;

  cursor: pointer;
`;

const LikeSvgBtn = styled.button<{ clicked: boolean }>`
  width: 40px;
  height: 40px;
  padding: 8px;
  margin-right: 4px;
  border: none;
  background-color: transparent;

  cursor: pointer;

  :hover {
    filter: ${(props) => (props.clicked ? "none" : "brightness(0.7)")};
  }
`;

const LikeSvg = styled.svg<{ clicked: boolean }>`
  fill: ${(props) => (props.clicked ? props.theme.red : "transparent")};

  stroke: ${(props) => (props.clicked ? "transparent" : props.theme.textColor)};
  stroke-width: 40px;

  width: 25px;
  height: 24px;

  position: relative;
  background-color: transparent;
`;

const ElapsedTime = styled.div`
  font-size: 10px;
  font-weight: 400;
  padding: 0px 12px;
  margin-bottom: 12px;

  color: ${(props) => props.theme.textLightColor};
`;

interface ISection {
  feedId: ObjectId;
  feedLikeList: ObjectId[];
  feedCreate?: Date;
}

function Section({ feedId, feedLikeList, feedCreate }: ISection) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const user = useRecoilValue(userAtom);
  const isMutating = useIsMutating();
  const [like, setLike] = useState<boolean>(false);
  const [likeListVisible, setLikeListVisible] = useState<boolean>(false);
  const likeData = { like, feedId };
  const likeMutation = useMutation((likeData: ILike) => likeUpdate(likeData), {
    onSettled: () => {
      queryClient.invalidateQueries("allFeed");
      queryClient.invalidateQueries("feed");
      queryClient.invalidateQueries("myFeed");
    },
  });

  const likeToggleFn = () => {
    setLike((prv) => !prv);
  };

  useDidMountEffect(() => {
    const check = feedLikeList.filter((_id) => _id === user?._id);

    if (!isMutating) {
      if (like) {
        if (check.length === 0) {
          likeMutation.mutate(likeData);
        }
      } else {
        if (check.length > 0) {
          likeMutation.mutate(likeData);
        }
      }
    }
  }, [like]);

  useEffect(() => {
    const check = feedLikeList.filter((_id) => _id === user?._id);
    if (check.length > 0) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [feedLikeList]);

  return (
    <>
      <FeedSectionContainer>
        <FeedSection>
          <div>
            <LikeSvgBtn onClick={likeToggleFn} clicked={like}>
              <LikeSvg
                clicked={like}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
              </LikeSvg>
            </LikeSvgBtn>
            {location.state?.backgroundLocation ? (
              <SvgBtn>
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.98c0 9.836 11.02 15.55 19.12 9.7l124.9-93.68h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z" />
                </Svg>
              </SvgBtn>
            ) : (
              <Link
                to={`/feed/${feedId}`}
                state={{ backgroundLocation: location }}
              >
                <SvgBtn>
                  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.98c0 9.836 11.02 15.55 19.12 9.7l124.9-93.68h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z" />
                  </Svg>
                </SvgBtn>
              </Link>
            )}

            <SvgBtn>
              <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
              </Svg>
            </SvgBtn>
          </div>
          <SvgBtn>
            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M336 0h-288C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93C357.2 519.1 384 504.6 384 479.9V48C384 21.49 362.5 0 336 0zM336 452L192 368l-144 84V54C48 50.63 50.63 48 53.1 48h276C333.4 48 336 50.63 336 54V452z" />
            </Svg>
          </SvgBtn>
        </FeedSection>
        <FeedLikeCount onClick={() => setLikeListVisible(true)}>
          좋아요 {feedLikeList.length}개
        </FeedLikeCount>
        {location.state?.backgroundLocation && (
          <ElapsedTime>{elapsedTime(feedCreate as Date)} 전</ElapsedTime>
        )}
      </FeedSectionContainer>
      {likeListVisible && (
        <LikeList
          feedId={feedId}
          modalVisible={likeListVisible}
          setModalVisible={setLikeListVisible}
        />
      )}
    </>
  );
}

export default Section;
