import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { userAtom } from "../utills/atoms";

const Wrapper = styled.div`
  width: calc(100vw - 72px);
  position: relative;
  left: 72px;
  display: flex;
  justify-content: center;
`;
const Container = styled.div`
  width: 470px;
`;
const StoryBox = styled.div`
  background-color: ${(props) => props.theme.containerColor};
  border: 1px solid ${(props) => props.theme.containerLine};
  margin: 16px 0;
  padding: 16px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  position: relative;
`;
const StoryItems = styled.ul`
  display: flex;
  padding: 0 12px;
  gap: 12px;
  overflow: hidden;
`;
const StroyItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;
`;
const ProfillImg = styled.img`
  width: 66px;
  height: 66px;
  border: 1px solid ${(props) => props.theme.containerLine};
  border-radius: 50%;
  background-color: white;

  cursor: pointer;
`;
const ProfillId = styled.div`
  padding: 0 2px;
  font-size: 12px;

  color: ${(props) => props.theme.textColor};
  font-weight: 500;
  cursor: pointer;
`;
const NextBtn = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: black;
  position: absolute;
  right: 22px;

  cursor: pointer;
`;
const PrevBtn = styled(NextBtn)`
  left: 22px;
`;
const FeedBox = styled.div`
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
const FeedTitle = styled.div`
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
  background-color: ${(props) => props.theme.containerColor};

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
const FeedImg = styled.div`
  height: 587.5px;
  background-color: gray;
`;
const FeedBody = styled.div``;
const FeedSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 4px;
  padding: 0px 0px 6px 4px;
  justify-content: space-between;
`;
const FeedLikeCount = styled.div`
  padding: 0 12px;
  font-weight: 600;
`;
const FeedComments = styled.div`
  padding: 16px 12px;
  font-weight: 500;
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
const FeedInput = styled.input`
  background-color: transparent;
  border: none;
  width: 85%;
  color: ${(props) => props.theme.textColor};
`;
const FeedSubmit = styled.div`
  color: ${(props) => props.theme.blue.lightBlue};
  font-weight: 500;
`;
export default function Home() {
  const [onTabClicked, setOnTabClicked] = useState<boolean>(false);
  const TabItemsRef = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userAtom);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        TabItemsRef.current &&
        !TabItemsRef.current.contains(e.target as Node)
      ) {
        console.log(!TabItemsRef.current.contains);
        setOnTabClicked(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [TabItemsRef]);

  return (
    <Wrapper>
      <Container>
        <StoryBox>
          <NextBtn />
          <PrevBtn />
          <StoryItems>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
            <StroyItem>
              <ProfillImg />
              <ProfillId>ㅎㅎㅎ</ProfillId>
            </StroyItem>
          </StoryItems>
        </StoryBox>
        <FeedBox>
          <FeedHeader>
            <FeedTitle>
              <ProfillImg style={{ width: "32px", height: "32px" }} />
              <ProfillId style={{ marginLeft: "10px", fontWeight: 600 }}>
                {user?.id}
              </ProfillId>
            </FeedTitle>
            <SvgBtn onClick={() => setOnTabClicked(true)}>
              <Svg
                style={{ scale: "0.7" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
              </Svg>
            </SvgBtn>
          </FeedHeader>

          <FeedBody>
            <FeedImg />
            <FeedSection>
              <div>
                <SvgBtn>
                  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                  </Svg>
                </SvgBtn>
                <SvgBtn>
                  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.98c0 9.836 11.02 15.55 19.12 9.7l124.9-93.68h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z" />
                  </Svg>
                </SvgBtn>
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
            <FeedLikeCount>
              <span style={{ cursor: "pointer" }}>
                좋아요 <span>0</span>개
              </span>
            </FeedLikeCount>
            <FeedComments></FeedComments>
          </FeedBody>
          <FeedFooter>
            <FeedForm>
              <FeedImoticon>
                <Svg
                  style={{ scale: "0.9" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 352C293.2 352 319.2 334.5 334.4 318.1C343.3 308.4 358.5 307.7 368.3 316.7C378 325.7 378.6 340.9 369.6 350.6C347.7 374.5 309.7 400 256 400C202.3 400 164.3 374.5 142.4 350.6C133.4 340.9 133.1 325.7 143.7 316.7C153.5 307.7 168.7 308.4 177.6 318.1C192.8 334.5 218.8 352 256 352zM208.4 208C208.4 225.7 194 240 176.4 240C158.7 240 144.4 225.7 144.4 208C144.4 190.3 158.7 176 176.4 176C194 176 208.4 190.3 208.4 208zM304.4 208C304.4 190.3 318.7 176 336.4 176C354 176 368.4 190.3 368.4 208C368.4 225.7 354 240 336.4 240C318.7 240 304.4 225.7 304.4 208zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
                </Svg>
              </FeedImoticon>
              <FeedInput placeholder="댓글 달기..." />
              <FeedSubmit>게시</FeedSubmit>
            </FeedForm>
          </FeedFooter>
        </FeedBox>
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
      </Container>
    </Wrapper>
  );
}
