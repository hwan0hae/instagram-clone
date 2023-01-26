import styled from "styled-components";
import { Link, PathMatch, useMatch } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { commentWrite, getFeed, IComment, IGetFeed } from "../../../utills/api";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Meatballs from "./Meatballs";
import Detail from "../../../pages/Detail";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../../utills/atoms";
import { ObjectId } from "mongoose";

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
  fill: ${(props) => [props.theme.textColor]};

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

const FeedSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 6px;
  padding: 6px 0 0 6px;
  justify-content: space-between;
`;
const FeedContentContainer = styled.div`
  padding: 0 12px 12px 12px;
`;
const FeedLikeCount = styled.div`
  font-weight: 600;
`;
const FeedContentBox = styled.div`
  display: flex;
  flex-direction: row;
  margin: 6px 0;
  gap: 6px;
`;
const FeedText = styled.div`
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
`;

const FeedComments = styled.div`
  font-weight: 500;
  color: ${(props) => props.theme.textLightColor};
`;
const FeedCommentBox = styled(FeedContentBox)`
  margin-bottom: 0;
`;
const FeedFooter = styled.div`
  padding: 4px 16px 4px 12px;
  border-top: 1px solid ${(props) => props.theme.containerLine};
`;
const FeedForm = styled.form`
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
`;
const FeedImoticon = styled.div`
  width: 24px;
  height: 24px;

  margin-right: 12px;
`;
const Imoji = styled.div`
  position: absolute;
  left: 0;
  margin-top: -400px;
`;

const FeedInput = styled.input`
  background-color: transparent;
  border: none;
  width: calc(100% - 60px);
  color: ${(props) => props.theme.textColor};
  :focus {
    outline: none;
  }
`;
const FeedSubmit = styled.button`
  color: ${(props) => props.theme.blue.lightBlue};
  background-color: transparent;
  border: none;
  font-weight: 500;
  padding: 0;
  margin: 0;
  margin-left: 12px;
  width: 24px;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.blue.darkBlue};
  }
`;

interface IForm {
  comment: { text: string }[];
}

function Feed() {
  const { data, isLoading } = useQuery<IGetFeed[]>("feed", getFeed);
  const queryClient = useQueryClient();
  const feedPathMatch: PathMatch<string> | null = useMatch(`/feed/:feedId`);
  const imojiRef = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userAtom);
  const [emojiIndex, setEmojiIndex] = useState<number>(NaN);
  const { register, handleSubmit, getValues, setValue } = useForm<IForm>({
    defaultValues: {
      comment: [{ text: "" }],
    },
  });

  const commentWriteMutation = useMutation(
    (comment: IComment) => commentWrite(comment),
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries("feed");
          queryClient.invalidateQueries("myFeed");
        } else {
        }
      },
    }
  );

  const onSubmit = (idx: number) => {
    const comment = getValues("comment")[idx].text;
    const commentData: IComment = {
      writer: user?._id as ObjectId,
      comment,
      feedId: data?.[idx]._id as ObjectId,
    };

    commentWriteMutation.mutate(commentData);
    setValue(`comment.${idx as number}.text`, "");
  };

  /** 이모지 */
  const onImojiClick = (idx: number) => {
    setEmojiIndex(idx);
  };
  const onClick = (emojiData: EmojiClickData) => {
    setValue(
      `comment.${emojiIndex as number}.text`,
      getValues("comment")[emojiIndex].text + emojiData.emoji
    );
    setEmojiIndex(NaN);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (imojiRef.current && !imojiRef.current.contains(e.target as Node)) {
        setEmojiIndex(NaN);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [imojiRef]);

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
              <FeedSection>
                <div>
                  <SvgBtn>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                    </Svg>
                  </SvgBtn>
                  <Link to={`/feed/${feed._id}`} state={{ feed: feed }}>
                    <SvgBtn>
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.98c0 9.836 11.02 15.55 19.12 9.7l124.9-93.68h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z" />
                      </Svg>
                    </SvgBtn>
                  </Link>
                  <SvgBtn>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
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
              <FeedContentContainer>
                <FeedLikeCount>
                  <span>
                    좋아요 <span>0</span>개
                  </span>
                </FeedLikeCount>
                <FeedContentBox>
                  <ProfileId>{feed?.writerProfile.id}</ProfileId>
                  <FeedText>{feed.content.text}</FeedText>
                </FeedContentBox>
                <Link to={`/feed/${feed._id}`} state={{ feed: feed }}>
                  {(feed.comments.length as number) !== 0 ? (
                    <>
                      <FeedComments>
                        댓글 {feed.comments.length}개 모두 보기
                      </FeedComments>
                      <FeedCommentBox>
                        <ProfileId>
                          {feed?.comments[0].writerProfile.id}
                        </ProfileId>
                        <FeedText>{feed.comments[0].comment}</FeedText>
                      </FeedCommentBox>
                    </>
                  ) : null}
                </Link>
              </FeedContentContainer>

              <FeedFooter>
                <FeedForm onSubmit={handleSubmit(() => onSubmit(index))}>
                  {emojiIndex === index && (
                    <Imoji ref={imojiRef}>
                      <EmojiPicker
                        height={350}
                        autoFocusSearch={false}
                        onEmojiClick={onClick}
                      />
                    </Imoji>
                  )}
                  <FeedImoticon onClick={() => onImojiClick(index)}>
                    <Svg
                      style={{ scale: "0.9" }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M256 352C293.2 352 319.2 334.5 334.4 318.1C343.3 308.4 358.5 307.7 368.3 316.7C378 325.7 378.6 340.9 369.6 350.6C347.7 374.5 309.7 400 256 400C202.3 400 164.3 374.5 142.4 350.6C133.4 340.9 133.1 325.7 143.7 316.7C153.5 307.7 168.7 308.4 177.6 318.1C192.8 334.5 218.8 352 256 352zM208.4 208C208.4 225.7 194 240 176.4 240C158.7 240 144.4 225.7 144.4 208C144.4 190.3 158.7 176 176.4 176C194 176 208.4 190.3 208.4 208zM304.4 208C304.4 190.3 318.7 176 336.4 176C354 176 368.4 190.3 368.4 208C368.4 225.7 354 240 336.4 240C318.7 240 304.4 225.7 304.4 208zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
                    </Svg>
                  </FeedImoticon>
                  <FeedInput
                    {...register(`comment.${index}.text`)}
                    required
                    placeholder="댓글 달기..."
                    autoComplete="off"
                  />
                  <FeedSubmit>게시</FeedSubmit>
                </FeedForm>
              </FeedFooter>
            </FeedContainer>
          ))}
        </>
      )}
      {feedPathMatch ? <Detail /> : null}
    </>
  );
}

export default Feed;
