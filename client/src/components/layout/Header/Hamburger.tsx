import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { logout } from "../../../utills/api";
import { isDarkAtom, isLoginAtom, userAtom } from "../../../utills/atoms";
import { NavMenuName, NavMenuTip, Svg, SvgContainer } from "./Header";

const TabMenu = styled(motion.div)`
  background-color: ${(props) => props.theme.menuColor};
  width: 240px;
  border-radius: 5px;
  position: fixed;
  left: 12px;
  bottom: 90px;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);
  z-index: 11;
`;
const TabMenuVar = {
  start: {
    y: 20,
    opacity: 0,
  },
  end: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      type: "tween",
    },
  },
};

const TabItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding: 10px 16px;
  font-weight: 400;

  cursor: pointer;

  :first-child {
    border-radius: 5px 5px 0 0;
  }
  :last-child {
    border-radius: 0 0 5px 5px;
  }
  &:not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.borderLine};
  }
  :nth-child(6) {
    border-top: 6px solid ${(props) => props.theme.borderLine};
  }
  :hover {
    background-color: ${(props) => props.theme.bgColor};
  }
`;

function Hamburger() {
  const queryClient = useQueryClient();
  const setIsDarkMode = useSetRecoilState(isDarkAtom);
  const tabMenuRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const setUser = useSetRecoilState(userAtom);
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const [hamburgerVisible, setHamburgerVisible] = useState<boolean>(false);

  const tabToggleFn = () => setHamburgerVisible((prev) => !prev);
  const onLogout = async () => {
    setHamburgerVisible(false);
    setIsLogin(false);
    setUser(null);
    logout();
    queryClient.invalidateQueries("LoginSuccess");
  };

  useEffect(() => {
    //TabMenu 외부영역 클릭시
    const handleClick = (e: MouseEvent) => {
      if (
        tabMenuRef.current &&
        !tabMenuRef.current.contains(e.target as Node) &&
        !tabRef.current?.contains(e.target as Node)
      ) {
        setHamburgerVisible(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [tabMenuRef]);

  return (
    <>
      <SvgContainer onClick={tabToggleFn} ref={tabRef}>
        <NavMenuTip>더 보기</NavMenuTip>
        <Svg
          clicked={true}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </Svg>
        <NavMenuName>더 보기</NavMenuName>
      </SvgContainer>
      <AnimatePresence>
        {hamburgerVisible && (
          <TabMenu
            ref={tabMenuRef}
            variants={TabMenuVar}
            initial="start"
            animate="end"
            exit="exit"
          >
            <Link to={"/edit"}>
              <TabItem>
                설정
                <Svg
                  clicked={true}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 35.8-80 80s35.8 80 80 80z" />
                </Svg>
              </TabItem>
            </Link>
            <TabItem>
              저장됨
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path d="M336 0h-288C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93C357.2 519.1 384 504.6 384 479.9V48C384 21.49 362.5 0 336 0zM336 452L192 368l-144 84V54C48 50.63 50.63 48 53.1 48h276C333.4 48 336 50.63 336 54V452z" />
              </Svg>
            </TabItem>
            <TabItem onClick={() => setIsDarkMode((prev) => !prev)}>
              모드 전환
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z" />
              </Svg>
            </TabItem>
            <TabItem>
              내 활동
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z" />
              </Svg>
            </TabItem>
            <TabItem>
              문제 신고
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32z" />
              </Svg>
            </TabItem>
            <TabItem>계정 전환</TabItem>
            <TabItem onClick={onLogout}>로그아웃</TabItem>
          </TabMenu>
        )}
      </AnimatePresence>
    </>
  );
}

export default Hamburger;
