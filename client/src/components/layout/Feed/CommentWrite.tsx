import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { commentWrite, IComment } from "../../../utills/api";
import { userAtom } from "../../../utills/atoms";
import { useEffect, useRef, useState } from "react";
import { ObjectId } from "mongoose";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Svg } from "./Feed";

const CommentWriteBox = styled.div`
  padding: 4px 16px 4px 12px;
  border-top: 1px solid ${(props) => props.theme.borderLine};
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
  width: 25px;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.blue.darkBlue};
  }
`;

interface IForm {
  comment: { text: string }[];
}

interface ICommentWrite {
  feedId: ObjectId;
  index: number;
}

export default function CommentWrite({ feedId, index }: ICommentWrite) {
  const queryClient = useQueryClient();
  const imojiRef = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userAtom);
  const [emojiClicked, setEmojiClicked] = useState<boolean>(false);
  const { register, handleSubmit, getValues, setValue } = useForm<IForm>({
    defaultValues: {
      comment: [{ text: "" }],
    },
  });

  const commentWriteMutation = useMutation(
    (comment: IComment) => commentWrite(comment),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["page_feed_list"]);
        queryClient.invalidateQueries("feed");
      },
    }
  );

  const onSubmit = () => {
    const comment = getValues("comment")[index].text;
    const commentData: IComment = {
      writer: user?._id as ObjectId,
      comment,
      feedId: feedId,
    };

    commentWriteMutation.mutate(commentData);
    setValue(`comment.${index}.text`, "");
  };

  /** 이모지 */
  const onClick = (emojiData: EmojiClickData) => {
    setValue(
      `comment.${index}.text`,
      getValues("comment")[index].text + emojiData.emoji
    );
    setEmojiClicked(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (imojiRef.current && !imojiRef.current.contains(e.target as Node)) {
        setEmojiClicked(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [imojiRef]);

  return (
    <CommentWriteBox>
      <FeedForm onSubmit={handleSubmit(onSubmit)}>
        {emojiClicked && (
          <Imoji ref={imojiRef}>
            <EmojiPicker
              height={350}
              autoFocusSearch={false}
              onEmojiClick={onClick}
            />
          </Imoji>
        )}
        <FeedImoticon onClick={() => setEmojiClicked(true)}>
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
    </CommentWriteBox>
  );
}
