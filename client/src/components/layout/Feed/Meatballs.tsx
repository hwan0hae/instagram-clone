import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Svg, SvgBtn } from "./Feed";

export const Overlay = styled(motion.div)`
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
export const TabItems = styled(motion.div)`
  background-color: ${(props) => props.theme.menuColor};
  width: 400px;
  margin: 40px;
  border-radius: 15px;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);

  overflow: hidden;
  z-index: 999;
`;

const TabItem = styled.div`
  text-align: center;
  font-size: 16px;
  padding: 12px;
  font-weight: 400;
  cursor: pointer;

  :first-child {
    border-radius: 15px 15px 0 0;
  }
  :last-child {
    border-radius: 0 0 15px 15px;
  }
  :first-child,
  :nth-child(2) {
    color: ${(props) => props.theme.red};
  }
  &:not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.borderLine};
  }
  :hover {
    background-color: ${(props) => props.theme.bgColor};
  }
`;
function Meatballs() {
  const [onTabClicked, setOnTabClicked] = useState<boolean>(false);
  const TabItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        TabItemsRef.current &&
        !TabItemsRef.current.contains(e.target as Node)
      ) {
        setOnTabClicked(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [TabItemsRef]);

  return (
    <>
      <SvgBtn onClick={() => setOnTabClicked(true)}>
        <Svg
          style={{ scale: "0.7" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
        </Svg>
      </SvgBtn>
      <AnimatePresence>
        {onTabClicked && (
          <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TabItems
              ref={TabItemsRef}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              <TabItem>신고</TabItem>
              <TabItem>팔로우 취소</TabItem>
              <TabItem>즐겨찾기에 추가</TabItem>
              <TabItem>게시물로 이동</TabItem>
              <TabItem>공유 대상...</TabItem>
              <TabItem>링크 복사</TabItem>
              <TabItem>퍼가기</TabItem>
              <TabItem onClick={() => setOnTabClicked(false)}>취소</TabItem>
            </TabItems>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}

export default Meatballs;
