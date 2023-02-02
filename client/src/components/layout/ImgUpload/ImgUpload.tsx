import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import { onProfileImgClickedAtom } from "../../../utills/atoms";
import { Overlay, Modal } from "../Feed/Meatballs";
import { ModalScrollPrevent } from "../../../utills/utill";

const TabItem = styled.div`
  text-align: center;
  padding: 16px 0;
  font-weight: 400;

  cursor: pointer;

  :first-child {
    font-size: 18px;
    padding: 32px 0;
    border-radius: 15px 15px 0 0;
    font-weight: 600;
    cursor: default;
  }
  :last-child {
    border-radius: 0 0 15px 15px;
  }
  &:not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.borderLine};
    :hover {
      background-color: ${(props) => props.theme.bgColor};
    }
  }
  :nth-child(2) {
    color: ${(props) => props.theme.blue.darkBlue};
    font-weight: 700;
  }
  :nth-child(3) {
    color: ${(props) => props.theme.red};
    font-weight: 700;
  }
`;

const FILE_SIZE_MAX_LIMIT = 5 * 1024 * 1024; // 5MB

function ImgUpload() {
  const [onProfileImgClicked, setOnProfileImgClicked] = useRecoilState<boolean>(
    onProfileImgClickedAtom
  );
  const queryClient = useQueryClient();
  const TabItemsRef = useRef<HTMLDivElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);

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

    const formData = new FormData();
    formData.append("file", files);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const response = await axios.post(
      "/api/users/profileupload",
      formData,
      config
    );

    if (response.data.success) {
      //작업 성공시 로직

      setOnProfileImgClicked(false);
      queryClient.invalidateQueries("LoginSuccess");
    } else {
      console.log(response.data.message);
    }
  };

  const onImageDelete = async () => {
    const response = await axios.get("/api/users/profiledelete");
    if (response.data.success) {
      setOnProfileImgClicked(false);
      queryClient.invalidateQueries("LoginSuccess");
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
        setOnProfileImgClicked(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [TabItemsRef, setOnProfileImgClicked]);

  ModalScrollPrevent(onProfileImgClicked);

  return (
    <>
      <AnimatePresence>
        {onProfileImgClicked && (
          <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Modal
              ref={TabItemsRef}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              <TabItem>프로필 사진 바꾸기</TabItem>
              <TabItem
                onClick={() => {
                  imgInput.current?.click();
                }}
              >
                사진 업로드
              </TabItem>
              <TabItem onClick={onImageDelete}>현재 사진 삭제</TabItem>
              <TabItem onClick={() => setOnProfileImgClicked(false)}>
                취소
              </TabItem>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        className="ImgInput"
        onChange={onImgChange}
        ref={imgInput}
      />
    </>
  );
}

export default ImgUpload;
