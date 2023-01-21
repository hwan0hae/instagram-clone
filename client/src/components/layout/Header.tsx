import styled from "styled-components";
import { Link, useMatch } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useQueryClient } from "react-query";
import { isDarkAtom, isLoginAtom, userAtom } from "../../utills/atoms";
import { logout } from "../../utills/api";

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  background-color: ${(props) => props.theme.containerColor};
  width: 72px;
  border-right: 1px solid ${(props) => props.theme.containerLine};
  height: 100vh;
  padding: 8px 12px 20px 12px;
  z-index: 10;

  @media screen and (min-width: 1250px) {
    width: 244px;
  }
`;

const NavLogo = styled.div`
  margin: 12px 0 24px 0;

  @media screen and (min-width: 1250px) {
    .logo {
      transform-origin: bottom center;
      transition: scale 0.5s ease;
      scale: 0;
    }
    .logoText {
      opacity: 1;
      transition: opacity 0.5s ease;
    }
    .logoContainer {
      pointer-events: none;
    }
  }
  @media screen and (max-width: 1250px) {
    .logo {
      transform-origin: bottom center;
      transition: scale 0.5s ease;
      scale: 1;
    }
    .logoText {
      opacity: 0;
      transition: opacity 0.5s ease;
    }
  }
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  height: 82vh;
  position: relative;
`;

const NavTab = styled.div`
  display: flex;
  position: relative;
`;
const SvgContainer = styled.div`
  width: 48px;
  height: 48px;
  padding: 12px;
  border-radius: 25px;
  transition: background-color 0.3s ease;
  margin: 4px 0;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  :hover {
    background-color: ${(props) => props.theme.bgColor};
    svg,
    img {
      scale: 1.05;
    }

    div {
      transition-delay: 0.5s;
      opacity: 1;
      scale: 1;
    }
  }

  :active {
    svg,
    img {
      scale: 0.95;
      filter: brightness(0.7);
    }
  }
  @media screen and (min-width: 1250px) {
    width: 100%;
  }
`;
const NavMenuTip = styled.div`
  background-color: ${(props) => props.theme.menuColor};
  font-weight: 400;
  padding: 7px 12px;
  border-radius: 5px;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);
  position: fixed;
  left: 75px;

  opacity: 0;
  scale: 0;
  transform-origin: left center;
  transition: 0.5s ease;

  ::before {
    content: "";
    border-top: 13px solid ${(props) => props.theme.menuColor};
    border-left: 12px solid transparent;
    position: absolute;
    top: 12px;
    left: -12px;
  }
  @media screen and (min-width: 1250px) {
    display: none;
  }
`;
const NavMenuName = styled.div`
  background-color: transparent;
  font-size: 16px;
  font-weight: 600;
  margin-left: 1em;
  @media screen and (min-width: 1250px) {
    display: block;
  }

  @media screen and (max-width: 1250px) {
    display: none;
  }
`;
const Svg = styled.svg<{ clicked?: boolean }>`
  fill: ${(props) => (props.clicked ? props.theme.textColor : "transparent")};

  stroke: ${(props) => (props.clicked ? "transparent" : props.theme.textColor)};
  stroke-width: 18px;

  width: 24px;
  height: 24px;

  position: relative;
  background-color: transparent;
`;
const ProfileImg = styled.img<{ clicked?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  box-shadow: ${(props) =>
    props.clicked ? `0px 0px 1px 3px ${props.theme.textColor};` : "none"};

  cursor: pointer;
`;
const SvgLogoText = styled.svg`
  fill: ${(props) => props.theme.textColor};
  position: absolute;
  width: 103px;
  margin: 3px 0 0 12px;
  left: 0;
`;
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

export default function Header() {
  const user = useRecoilValue(userAtom);
  const homeMatch = useMatch("/");
  const myPageMatch = useMatch(`/${user?.id}`);
  const myPageMatch2 = useMatch(`/${user?.id}/:a`);
  const queryClient = useQueryClient();
  const tabMenuRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const setIsDarkMode = useSetRecoilState(isDarkAtom);
  const setUser = useSetRecoilState(userAtom);
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const [tabMenuVisible, setTabMenuVisible] = useState<boolean>(false);
  const tabToggleFn = () => setTabMenuVisible((prev) => !prev);

  useEffect(() => {
    //TabMenu 외부영역 클릭시
    const handleClick = (e: MouseEvent) => {
      if (
        tabMenuRef.current &&
        !tabMenuRef.current.contains(e.target as Node) &&
        !tabRef.current?.contains(e.target as Node)
      ) {
        setTabMenuVisible(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [tabMenuRef]);

  const onLogout = async () => {
    setIsLogin(false);
    setUser(null);
    logout();
    queryClient.invalidateQueries("LoginSuccess");
  };

  return (
    <>
      <Nav>
        <NavLogo>
          <Link to="/">
            <SvgContainer className="logoContainer">
              <Svg
                className="logo"
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </Svg>

              <SvgLogoText
                className="logoText"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 122.88 34.86"
              >
                <path d="M6.32,0.12C3.81,1.17,1.04,4.15,0.17,7.88c-1.11,4.73,3.5,6.73,3.87,6.07c0.44-0.77-0.83-1.03-1.09-3.49 C2.62,7.3,4.1,3.76,5.95,2.21c0.34-0.29,0.33,0.11,0.33,0.86c0,1.33-0.07,13.26-0.07,15.75c0,3.37-0.14,4.43-0.39,5.49 c-0.25,1.07-0.66,1.79-0.35,2.06c0.34,0.31,1.82-0.43,2.67-1.62c1.02-1.43,1.38-3.14,1.44-5c0.08-2.24,0.07-5.8,0.08-7.83 c0-1.86,0.03-7.31-0.03-10.59C9.61,0.52,7.38-0.32,6.32,0.12L6.32,0.12L6.32,0.12z M95.63,15.89c-0.08,1.75-0.47,3.12-0.95,4.09 c-0.93,1.87-2.87,2.45-3.69-0.24c-0.45-1.46-0.47-3.91-0.15-5.96c0.33-2.08,1.24-3.66,2.76-3.51 C95.1,10.41,95.79,12.33,95.63,15.89L95.63,15.89L95.63,15.89z M70.46,26.76c-0.02,2.91-0.48,5.46-1.46,6.2 c-1.39,1.05-3.27,0.26-2.88-1.86c0.34-1.88,1.97-3.8,4.34-6.14C70.46,24.96,70.47,25.49,70.46,26.76L70.46,26.76L70.46,26.76z M70.08,15.88c-0.08,1.6-0.5,3.2-0.95,4.1c-0.93,1.87-2.88,2.45-3.69-0.24c-0.55-1.84-0.42-4.22-0.15-5.72 c0.35-1.95,1.21-3.75,2.76-3.75C69.55,10.27,70.29,11.92,70.08,15.88L70.08,15.88L70.08,15.88z M55.5,15.85 c-0.09,1.69-0.42,3.1-0.95,4.13c-0.96,1.86-2.85,2.45-3.69-0.24c-0.6-1.93-0.4-4.57-0.15-6c0.37-2.12,1.3-3.61,2.76-3.47 C54.96,10.42,55.69,12.33,55.5,15.85L55.5,15.85L55.5,15.85z M122.32,17.82c-0.37,0-0.53,0.38-0.67,1.01 c-0.48,2.2-0.98,2.7-1.63,2.7c-0.72,0-1.37-1.09-1.54-3.27c-0.13-1.72-0.11-4.87,0.06-8.02c0.03-0.65-0.14-1.28-1.88-1.91 c-0.75-0.27-1.83-0.67-2.37,0.63c-1.52,3.68-2.12,6.6-2.26,7.78c-0.01,0.06-0.08,0.07-0.1-0.07c-0.09-0.95-0.29-2.68-0.31-6.3 c0-0.71-0.15-1.31-0.94-1.8c-0.51-0.32-2.04-0.89-2.6-0.21c-0.48,0.55-1.04,2.03-1.61,3.79c-0.47,1.43-0.8,2.39-0.8,2.39 s0.01-3.85,0.01-5.31c0-0.55-0.38-0.73-0.49-0.77c-0.51-0.15-1.52-0.4-1.95-0.4c-0.53,0-0.66,0.3-0.66,0.73 c0,0.06-0.08,5.07-0.08,8.58c0,0.15,0,0.32,0,0.5c-0.29,1.61-1.24,3.8-2.28,3.8c-1.03,0-1.52-0.92-1.52-5.09 c0-2.44,0.07-3.5,0.11-5.26c0.02-1.02,0.06-1.8,0.06-1.97c-0.01-0.54-0.95-0.82-1.38-0.92c-0.44-0.1-0.82-0.14-1.12-0.12 c-0.42,0.02-0.72,0.3-0.72,0.68c0,0.2,0,0.59,0,0.59c-0.54-0.85-1.42-1.45-2-1.62c-1.56-0.47-3.2-0.05-4.43,1.67 c-0.98,1.37-1.57,2.92-1.8,5.15c-0.17,1.63-0.11,3.28,0.19,4.68c-0.36,1.58-1.04,2.22-1.78,2.22c-1.08,0-1.86-1.76-1.77-4.79 c0.06-2,0.46-3.4,0.9-5.43c0.19-0.86,0.03-1.32-0.34-1.75c-0.35-0.4-1.09-0.6-2.16-0.35c-0.76,0.18-1.85,0.37-2.84,0.52 c0,0,0.06-0.24,0.11-0.66c0.26-2.21-2.15-2.03-2.91-1.33c-0.46,0.42-0.77,0.92-0.89,1.81c-0.19,1.42,0.97,2.09,0.97,2.09 c-0.38,1.74-1.31,4.01-2.27,5.65c-0.51,0.88-0.91,1.53-1.42,2.23c0-0.26,0-0.52,0-0.77c-0.01-3.66,0.04-6.53,0.06-7.57 c0.02-1.02,0.06-1.78,0.06-1.95c-0.01-0.4-0.24-0.55-0.72-0.74c-0.43-0.17-0.93-0.28-1.45-0.32C70.5,8.24,70.1,8.59,70.11,9 c0,0.08,0,0.56,0,0.56c-0.54-0.85-1.42-1.45-2-1.62c-1.56-0.46-3.2-0.05-4.43,1.67c-0.98,1.37-1.62,3.29-1.8,5.13 c-0.17,1.72-0.14,3.17,0.09,4.4c-0.25,1.23-0.96,2.52-1.77,2.52c-1.03,0-1.62-0.92-1.62-5.09c0-2.44,0.07-3.5,0.11-5.26 c0.02-1.02,0.06-1.8,0.06-1.97c-0.01-0.54-0.95-0.82-1.38-0.92c-0.46-0.11-0.85-0.14-1.15-0.12c-0.4,0.03-0.68,0.39-0.68,0.65v0.62 c-0.54-0.85-1.42-1.45-2-1.62c-1.56-0.46-3.19-0.05-4.43,1.67c-0.81,1.12-1.46,2.36-1.8,5.11c-0.1,0.79-0.14,1.54-0.13,2.23 c-0.32,1.97-1.75,4.25-2.91,4.25c-0.68,0-1.33-1.32-1.33-4.14c0-3.76,0.23-9.1,0.27-9.62c0,0,1.47-0.02,1.76-0.03 c0.73-0.01,1.4,0.01,2.38-0.04c0.49-0.02,0.96-1.79,0.46-2c-0.23-0.1-1.85-0.19-2.5-0.2c-0.54-0.01-2.05-0.12-2.05-0.12 s0.14-3.55,0.17-3.92c0.03-0.31-0.38-0.47-0.61-0.57c-0.56-0.24-1.07-0.35-1.67-0.48c-0.83-0.17-1.2,0-1.27,0.69 c-0.11,1.06-0.17,4.16-0.17,4.16c-0.61,0-2.68-0.12-3.28-0.12c-0.56,0-1.17,2.42-0.39,2.45c0.9,0.03,2.46,0.06,3.49,0.1 c0,0-0.05,5.44-0.05,7.11c0,0.18,0,0.35,0,0.52c-0.57,2.97-2.58,4.57-2.58,4.57c0.43-1.96-0.45-3.44-2.04-4.69 c-0.58-0.46-1.74-1.33-3.03-2.29c0,0,0.75-0.74,1.41-2.22c0.47-1.05,0.49-2.25-0.66-2.52c-1.9-0.44-3.48,0.96-3.94,2.45 c-0.36,1.16-0.17,2.02,0.54,2.91c0.05,0.06,0.11,0.13,0.17,0.2c-0.43,0.83-1.02,1.94-1.52,2.81c-1.39,2.4-2.44,4.3-3.23,4.3 c-0.63,0-0.63-1.93-0.63-3.74c0-1.56,0.11-3.9,0.21-6.32c0.03-0.8-0.37-1.26-1.04-1.67c-0.41-0.25-1.28-0.75-1.78-0.75 c-0.76,0-2.93,0.1-4.99,6.06c-0.26,0.75-0.77,2.12-0.77,2.12l0.04-7.16c0-0.17-0.09-0.33-0.29-0.44c-0.35-0.19-1.27-0.57-2.1-0.57 c-0.39,0-0.59,0.18-0.59,0.55L12.57,19.8c0,0.85,0.02,1.84,0.11,2.28c0.08,0.43,0.22,0.79,0.39,1s0.36,0.37,0.68,0.44 c0.3,0.06,1.93,0.27,2.02-0.35c0.1-0.75,0.11-1.56,0.96-4.58c1.33-4.7,3.08-6.99,3.89-7.8c0.14-0.14,0.31-0.15,0.3,0.08 c-0.04,1.03-0.16,3.6-0.24,5.79c-0.22,5.85,0.84,6.94,2.36,6.94c1.16,0,2.8-1.16,4.56-4.08c1.1-1.82,2.16-3.61,2.93-4.9 c0.53,0.49,1.13,1.02,1.73,1.59c1.39,1.32,1.85,2.57,1.54,3.76c-0.23,0.91-1.1,1.84-2.65,0.93c-0.45-0.27-0.65-0.47-1.1-0.77 c-0.24-0.16-0.62-0.21-0.84-0.04c-0.58,0.44-0.91,1-1.1,1.68c-0.18,0.67,0.49,1.03,1.18,1.34c0.6,0.27,1.89,0.51,2.71,0.54 c3.2,0.11,5.77-1.55,7.56-5.81c0.32,3.68,1.68,5.77,4.05,5.77c1.58,0,3.17-2.04,3.86-4.05c0.2,0.82,0.49,1.53,0.87,2.13 c1.82,2.89,5.36,2.27,7.13-0.19c0.55-0.76,0.63-1.03,0.63-1.03c0.26,2.31,2.12,3.12,3.19,3.12c1.2,0,2.43-0.56,3.29-2.51 c0.1,0.21,0.21,0.41,0.33,0.6c1.82,2.89,5.36,2.26,7.13-0.19c0.08-0.11,0.16-0.22,0.22-0.31l0.05,1.52c0,0-1.01,0.93-1.63,1.5 c-2.74,2.51-4.82,4.42-4.97,6.63c-0.2,2.83,2.1,3.88,3.83,4.02c1.84,0.15,3.42-0.87,4.39-2.3c0.85-1.25,1.41-3.95,1.37-6.62 c-0.02-1.07-0.04-2.42-0.06-3.88c0.96-1.12,2.04-2.53,3.04-4.18c1.09-1.8,2.25-4.22,2.85-6.1c0,0,1.01,0.01,2.09-0.06 c0.35-0.02,0.45,0.05,0.38,0.3c-0.08,0.31-1.36,5.27-0.19,8.58c0.8,2.26,2.62,2.99,3.69,2.99c1.26,0,2.46-0.95,3.11-2.36 c0.08,0.16,0.16,0.31,0.25,0.45c1.82,2.89,5.34,2.26,7.13-0.19c0.4-0.55,0.63-1.03,0.63-1.03c0.38,2.4,2.25,3.14,3.31,3.14 c1.11,0,2.17-0.46,3.02-2.48c0.04,0.89,0.09,1.62,0.18,1.85c0.05,0.14,0.37,0.32,0.6,0.4c1.02,0.38,2.05,0.2,2.44,0.12 c0.27-0.05,0.47-0.27,0.5-0.82c0.07-1.45,0.03-3.88,0.47-5.68c0.74-3.03,1.42-4.21,1.75-4.79c0.18-0.33,0.39-0.38,0.4-0.04 c0.02,0.7,0.05,2.75,0.33,5.5c0.21,2.03,0.49,3.22,0.7,3.6c0.61,1.08,1.37,1.13,1.99,1.13c0.39,0,1.21-0.11,1.14-0.8 c-0.04-0.34,0.03-2.41,0.75-5.4c0.47-1.95,1.26-3.71,1.55-4.35c0.11-0.24,0.15-0.05,0.15-0.01c-0.06,1.34-0.19,5.73,0.35,8.13 c0.74,3.25,2.89,3.62,3.63,3.62c1.59,0,2.9-1.21,3.34-4.41C122.95,18.42,122.79,17.82,122.32,17.82L122.32,17.82L122.32,17.82z M122.32,17.82L122.32,17.82L122.32,17.82L122.32,17.82z" />
              </SvgLogoText>
            </SvgContainer>
          </Link>
        </NavLogo>
        <NavMenu>
          <Link to="/">
            <SvgContainer>
              <NavMenuTip>홈</NavMenuTip>
              <Svg
                clicked={Boolean(homeMatch)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
              </Svg>
              <NavMenuName>홈</NavMenuName>
            </SvgContainer>
          </Link>
          <Link to="/">
            <SvgContainer>
              <NavMenuTip>검색</NavMenuTip>
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
              </Svg>
              <NavMenuName>검색</NavMenuName>
            </SvgContainer>
          </Link>
          <Link to="/">
            <SvgContainer>
              <NavMenuTip>탐색 탭</NavMenuTip>
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M306.7 325.1L162.4 380.6C142.1 388.1 123.9 369 131.4 349.6L186.9 205.3C190.1 196.8 196.8 190.1 205.3 186.9L349.6 131.4C369 123.9 388.1 142.1 380.6 162.4L325.1 306.7C321.9 315.2 315.2 321.9 306.7 325.1V325.1zM255.1 224C238.3 224 223.1 238.3 223.1 256C223.1 273.7 238.3 288 255.1 288C273.7 288 288 273.7 288 256C288 238.3 273.7 224 255.1 224V224zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
              </Svg>
              <NavMenuName>탐색 탭</NavMenuName>
            </SvgContainer>
          </Link>
          <Link to="/">
            <SvgContainer>
              <NavMenuTip>릴스</NavMenuTip>
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
              </Svg>
              <NavMenuName>릴스</NavMenuName>
            </SvgContainer>
          </Link>
          <Link to="/">
            <SvgContainer>
              <NavMenuTip>메시지</NavMenuTip>
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
              </Svg>
              <NavMenuName>메시지</NavMenuName>
            </SvgContainer>
          </Link>
          <Link to="/">
            <SvgContainer>
              <NavMenuTip>알림</NavMenuTip>
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
              </Svg>
              <NavMenuName>알림</NavMenuName>
            </SvgContainer>
          </Link>
          <Link to="/">
            <SvgContainer>
              <NavMenuTip>만들기</NavMenuTip>
              <Svg
                clicked={true}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
              </Svg>
              <NavMenuName>만들기</NavMenuName>
            </SvgContainer>
          </Link>
          <Link to={`/${user?.id}`}>
            <SvgContainer>
              <NavMenuTip>프로필</NavMenuTip>
              <ProfileImg
                src={user?.profileImage}
                clicked={Boolean(myPageMatch || myPageMatch2)}
              />

              <NavMenuName>프로필</NavMenuName>
            </SvgContainer>
          </Link>
        </NavMenu>
        <NavTab>
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
        </NavTab>
      </Nav>
      <AnimatePresence>
        {tabMenuVisible && (
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
