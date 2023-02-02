import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useQueryClient } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { onFeedUploadClickedAtom, userAtom } from "../../../utills/atoms";
import { useForm } from "react-hook-form";
import { Overlay } from "../Feed/Meatballs";
import { Svg } from "../Feed/Feed";
import { ModalScrollPrevent } from "../../../utills/utill";

const Container = styled(motion.div)<{ selected: boolean }>`
  background-color: ${(props) => props.theme.menuColor};
  width: ${(props) => (props.selected ? "100%" : "50%")};
  max-width: 1080px;
  max-height: 910px;
  margin: 40px;
  border-radius: 15px;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);

  overflow: hidden;
  z-index: 999;
`;

const TabItem = styled.div`
  padding: 16px 0;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  align-items: center;

  :first-child {
    font-size: 18px;
    border-radius: 15px 15px 0 0;
    font-weight: 600;
  }
  :last-child {
    border-radius: 0 0 15px 15px;
    padding: 24px;
  }
  &:not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.borderLine};
  }
`;

const UploadBtn = styled.button`
  background-color: ${(props) => props.theme.blue.darkBlue};
  border: none;
  font-weight: 400;
  color: #efefef;
  font-size: 1em;
  padding: 8px 16px;
  margin: 16px 0;
  border-radius: 10px;

  cursor: pointer;

  :hover {
    background-color: #1877f2;
  }
`;

const ContentTitleBox = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ContentTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;
const SvgBtn = styled.div`
  background-color: transparent;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SubmitBtn = styled.button`
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.blue.darkBlue};
  font-size: 1rem;
  font-weight: 500;
  padding: 0;
  cursor: pointer;
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${(props) => props.theme.borderLine};
`;

const Preview = styled.img`
  width: 60%;
`;
const ContentsBox = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  align-items: center;
  gap: 16px;
`;
const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;
export const ProfileId = styled.span`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 3px;
  color: ${(props) => props.theme.textColor};
`;
const TextArea = styled.textarea`
  font-weight: 400;
  background-color: transparent;
  border: none;
  font-size: 14px;
  padding: 0;
  height: 120px;
  resize: none;
  color: ${(props) => props.theme.textColor};
  outline: none;
`;

interface IForm {
  content: string;
}

const FILE_SIZE_MAX_LIMIT = 5 * 1024 * 1024; // 5MB

function FeedUpload() {
  const queryClient = useQueryClient();
  const TabItemsRef = useRef<HTMLDivElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);
  const user = useRecoilValue(userAtom);
  const [onFeedUploadClicked, setOnFeedUploadClicked] = useRecoilState<boolean>(
    onFeedUploadClickedAtom
  );
  const [imgSelected, setImgSelected] = useState<boolean>(false);
  const [feedImg, setFeedImg] = useState<File | string>("");
  const [preview, setPreview] = useState<string>("");
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const files = (target.files as FileList)[0];
    if (files === undefined) {
      return;
    }
    // 파일 용량 체크
    if (files.size > FILE_SIZE_MAX_LIMIT) {
      target.value = "";
      alert("업로드 가능한 최대 용량은 5MB입니다. ");
      return;
    }
    setFeedImg(files);
    setPreview(URL.createObjectURL(files));
    setImgSelected(true);

    target.value = "";
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const upLoadCancel = () => {
    setValue("content", "");
    setFeedImg("");
    setPreview("");
    setImgSelected(false);
    setOnFeedUploadClicked(false);
  };

  const onFeedUpload = async (data: IForm) => {
    const formData = new FormData();
    formData.append("file", feedImg);
    formData.append("content", data.content);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const response = await axios.post("/api/feed/upload", formData, config);

    if (response.data.success) {
      //작업 성공시 로직
      upLoadCancel();
      queryClient.invalidateQueries("allFeed");
      queryClient.invalidateQueries("myFeed");
    } else {
      console.log(response.data.message);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        TabItemsRef.current &&
        !TabItemsRef.current.contains(e.target as Node)
      ) {
        upLoadCancel();
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [TabItemsRef, upLoadCancel]);

  ModalScrollPrevent(onFeedUploadClicked);

  return (
    <>
      <AnimatePresence>
        {onFeedUploadClicked && (
          <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Container
              selected={imgSelected}
              ref={TabItemsRef}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {imgSelected ? (
                <form onSubmit={handleSubmit(onFeedUpload)}>
                  <ContentTitleBox>
                    <SvgBtn onClick={upLoadCancel}>
                      <Svg
                        style={{ width: 20, height: 20 }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                      </Svg>
                    </SvgBtn>
                    <ContentTitle>새 게시물 만들기</ContentTitle>
                    <SubmitBtn>공유하기</SubmitBtn>
                  </ContentTitleBox>

                  <ContentsContainer>
                    <Preview src={preview} />
                    <ContentsBox>
                      <ProfileBox>
                        <ProfileImg src={user?.profileImage} />
                        <ProfileId>{user?.id}</ProfileId>
                      </ProfileBox>
                      <TextArea
                        {...register("content")}
                        placeholder="문구 입력..."
                        defaultValue={""}
                      />
                    </ContentsBox>
                  </ContentsContainer>
                </form>
              ) : (
                <>
                  <TabItem>새 게시물 만들기</TabItem>
                  <TabItem
                    onClick={() => {
                      imgInput.current?.click();
                    }}
                  >
                    <Svg
                      style={{ width: 64, height: 64 }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path d="M512 32H160c-35.35 0-64 28.65-64 64v224c0 35.35 28.65 64 64 64H512c35.35 0 64-28.65 64-64V96C576 60.65 547.3 32 512 32zM528 320c0 8.822-7.178 16-16 16h-16l-109.3-160.9C383.7 170.7 378.7 168 373.3 168c-5.352 0-10.35 2.672-13.31 7.125l-62.74 94.11L274.9 238.6C271.9 234.4 267.1 232 262 232c-5.109 0-9.914 2.441-12.93 6.574L176 336H160c-8.822 0-16-7.178-16-16V96c0-8.822 7.178-16 16-16H512c8.822 0 16 7.178 16 16V320zM224 112c-17.67 0-32 14.33-32 32s14.33 32 32 32c17.68 0 32-14.33 32-32S241.7 112 224 112zM456 480H120C53.83 480 0 426.2 0 360v-240C0 106.8 10.75 96 24 96S48 106.8 48 120v240c0 39.7 32.3 72 72 72h336c13.25 0 24 10.75 24 24S469.3 480 456 480z" />
                    </Svg>
                    <UploadBtn>컴퓨터에서 선택</UploadBtn>
                  </TabItem>
                </>
              )}
            </Container>
          </Overlay>
        )}
      </AnimatePresence>
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={onImgChange}
        ref={imgInput}
      />
    </>
  );
}

export default FeedUpload;
