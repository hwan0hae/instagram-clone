import { AnimatePresence, motion } from "framer-motion";
import { ObjectId } from "mongoose";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getLikeList, IGetLikeList } from "../../../utills/api";
import { ModalScrollPrevent } from "../../../utills/utill";
import { Svg, SvgBtn } from "./Feed";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;
const Modal = styled(motion.div)`
  background-color: ${(props) => props.theme.menuColor};
  width: 400px;
  height: 400px;
  margin: 40px;
  border-radius: 15px;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);
  border-radius: 15px;

  overflow: hidden;
  z-index: 999;
`;
const TitleContainer = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.borderLine};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Title = styled.div`
  padding: 12px;
  font-size: 16px;
  text-align: center;
  font-weight: 400;
`;
const Close = styled.div`
  position: absolute;
  right: 0;
`;
const ListContainer = styled.div`
  overflow: auto;
`;
const ListItem = styled.div`
  padding: 8px 16px;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 44px;
  height: 44px;
  border: 1px solid ${(props) => props.theme.containerLine};
  border-radius: 50%;
  margin-right: 16px;

  cursor: pointer;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const ProfileId = styled.div`
  padding: 0;
  font-size: 1em;
  font-weight: 600;

  color: ${(props) => props.theme.textColor};
`;
const ProfileName = styled.div`
  padding: 0;
  font-size: 1em;
  font-weight: 500;

  color: ${(props) => props.theme.textLightColor};
`;

interface ILikeList {
  feedId: ObjectId;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function LikeList({ feedId, modalVisible, setModalVisible }: ILikeList) {
  const ModalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<IGetLikeList>("likeList", () =>
    getLikeList(feedId)
  );
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ModalRef.current && !ModalRef.current.contains(e.target as Node)) {
        setModalVisible(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [ModalRef, setModalVisible]);

  ModalScrollPrevent(modalVisible);
  return (
    <>
      <AnimatePresence>
        <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Modal ref={ModalRef} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
            <TitleContainer>
              <Title>좋아요</Title>

              <Close>
                <SvgBtn onClick={() => setModalVisible(false)}>
                  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                  </Svg>
                </SvgBtn>
              </Close>
            </TitleContainer>

            {isLoading ? null : (
              <ListContainer>
                {data?.likeList.map((list, index) => (
                  <ListItem key={index}>
                    <ProfileImg
                      onClick={() => navigate(`/${list.id}`)}
                      src={list.profileImage}
                    />
                    <Column>
                      <Link to={`/${list.id}`}>
                        <ProfileId>{list.id}</ProfileId>
                      </Link>
                      <ProfileName>{list.name}</ProfileName>
                    </Column>
                  </ListItem>
                ))}
              </ListContainer>
            )}
          </Modal>
        </Overlay>
      </AnimatePresence>
    </>
  );
}

export default LikeList;

//데이터를 가지고보냄 > 데이터로 조회 리스폰해줌
