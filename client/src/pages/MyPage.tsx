import styled from "styled-components";
import { Link, Outlet, useMatch } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { onProfileImgClickedAtom, userAtom } from "../utills/atoms";
import { Helmet } from "react-helmet-async";
import ImgUpload from "../components/layout/ImgUpload/ImgUpload";
import { Svg, SvgBtn } from "../components/layout/Feed/Feed";
import { useState } from "react";
import Following from "../components/layout/Follow/Following";
import { ObjectId } from "mongoose";
import Follower from "../components/layout/Follow/Follower";

const Wrapper = styled.div`
  width: calc(100% - 72px);
  position: relative;
  padding: 30px 20px;
  margin-left: 72px;
  display: flex;
  justify-content: center;

  @media screen and (min-width: 1250px) {
    width: calc(100%-244px);
    margin-left: 244px;
  }
  /** 모바일용 */
  @media screen and (max-width: 760px) {
    width: 100%;
    margin-left: 0;
    padding: 20px 0;
    top: 60px;
  }
`;
const Container = styled.div`
  width: 100%;
  max-width: 935px;
`;
const ProfileContainer = styled.div`
  margin-bottom: 44px;
  width: 100%;
  display: flex;
  flex-direction: row;
`;
const ProfileImgContainer = styled.div`
  width: 33%;
  padding: 16px 32px;

  margin-right: 30px;
  /** 모바일용 */
  @media screen and (max-width: 760px) {
    width: auto;
    margin-right: 16px;
    padding: 16px;
  }
`;
const ProfileImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.borderLine};

  cursor: pointer;

  /** 모바일용 */
  @media screen and (max-width: 760px) {
    width: 87px;
    height: 87px;
  }
`;
const ProfileInfo = styled.div`
  width: 100%;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 3px 0;
  align-items: center;
  gap: 10px;

  /** 모바일용 */
  @media screen and (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const ProfileId = styled.h2`
  font-size: 1.25rem;
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
  margin-right: 10px;
`;
const ProfileBtn = styled.button`
  background-color: #fafafa;
  color: black;
  height: 32px;
  padding: 7px 16px;
  border: none;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);
  border-radius: 5px;
  font-weight: 600;

  cursor: pointer;
  :hover {
    filter: brightness(0.8);
  }
`;
const Setting = styled.div`
  /** 모바일용 */
  @media screen and (max-width: 760px) {
    display: none;
  }
`;
const ProfileRowBox = styled.ul`
  list-style: none;
  display: flex;
  gap: 48px;
  margin: 16px 0;
`;

const RowItem = styled.li`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};

  cursor: pointer;
`;
const ProfileContent = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.textColor};
`;
const ProfileName = styled.span`
  font-weight: 600;
`;
const ProfileIntroduction = styled.pre`
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
`;
const StoryContainer = styled.div`
  padding: 0 16px;
  margin-bottom: 44px;
  /** 모바일용 */
  @media screen and (max-width: 760px) {
    margin-bottom: 12px;
    padding: 0;
  }
`;
const Storys = styled.ul`
  display: flex;
  padding: 0 12px;
  gap: 12px;
  overflow: hidden;

  /** 모바일용 */
  @media screen and (max-width: 760px) {
    padding: 0;
    gap: 0;
  }
`;
const Story = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 15px;
  height: 130px;
  width: 115px;

  cursor: pointer;

  /** 모바일용 */
  @media screen and (max-width: 760px) {
    scale: 0.8;
    padding: 0;
  }
`;

const StoryImgContainer = styled.div`
  width: 77px;
  height: 77px;
  border-radius: 50%;
  border: 3px solid ${(props) => props.theme.containerColor};
  box-shadow: 0px 0px 1px 0.5px rgba(128, 128, 128, 1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StoryTitle = styled.div`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  overflow: hidden;
  padding-top: 15px;
`;
const FeedNav = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 600;
  border-top: 1px solid ${(props) => props.theme.containerLine};
  padding: 0 100px;
  align-items: center;
  justify-content: space-evenly;

  /** 모바일용 */
  @media screen and (max-width: 760px) {
    padding: 0;
  }
`;
const NavItem = styled.div<{ clicked: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
  font-size: 12px;
  color: ${(props) =>
    props.clicked ? props.theme.textColor : props.theme.textLightColor};

  svg {
    fill: ${(props) =>
      props.clicked ? props.theme.textColor : props.theme.textLightColor};
  }

  border-top: ${(props) =>
    props.clicked
      ? `1px solid ${props.theme.textColor}`
      : "1px solid transparent"};

  :active {
    filter: brightness(0.8);
  }
`;

export default function MyPage() {
  const user = useRecoilValue(userAtom);
  const homeMatch = useMatch(`/${user?.id}`);
  const reelsMatch = useMatch(`/${user?.id}/reels`);
  const savedMatch = useMatch(`/${user?.id}/saved`);
  const taggedMatch = useMatch(`/${user?.id}/tagged`);
  const [followList, setFollowList] = useState<string | null>(null);
  const setOnProfileImgClicked = useSetRecoilState<boolean>(
    onProfileImgClickedAtom
  );
  return (
    <>
      <Wrapper>
        <Helmet>
          <title>
            {user?.name}(@{user?.id})﹒Instagram
          </title>
          {/* meta태그 SEO 검색엔진 */}
        </Helmet>
        <Container>
          <ProfileContainer>
            <ProfileImgContainer>
              <ProfileImg
                src={user?.profileImage}
                onClick={() => setOnProfileImgClicked(true)}
              />
            </ProfileImgContainer>
            <ProfileInfo>
              <ProfileHeader>
                <ProfileId> {user?.id}</ProfileId>
                <Link to="/edit">
                  <ProfileBtn>프로필 편집</ProfileBtn>
                </Link>
                <ProfileBtn>광고 도구</ProfileBtn>
                <Setting>
                  <Link to="/edit">
                    <SvgBtn style={{ backgroundColor: "transparent" }}>
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 35.8-80 80s35.8 80 80 80z" />
                      </Svg>
                    </SvgBtn>
                  </Link>
                </Setting>
              </ProfileHeader>
              <ProfileRowBox>
                <RowItem onClick={() => setFollowList("follower")}>
                  팔로워 {user?.follower.length}
                </RowItem>
                <RowItem onClick={() => setFollowList("following")}>
                  팔로우 {user?.following.length}
                </RowItem>
              </ProfileRowBox>
              <ProfileContent>
                <ProfileName>{user?.name}</ProfileName>
                <ProfileIntroduction>{user?.introduction}</ProfileIntroduction>
              </ProfileContent>
            </ProfileInfo>
          </ProfileContainer>
          <StoryContainer>
            <Storys>
              <Story>
                <StoryImgContainer />
                <StoryTitle>마시멜롱</StoryTitle>
              </Story>
              <Story>
                <StoryImgContainer>
                  <Svg
                    style={{ fill: "gray", scale: "1.5" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                  </Svg>
                </StoryImgContainer>

                <StoryTitle>신규</StoryTitle>
              </Story>
            </Storys>
          </StoryContainer>
          <FeedNav>
            <Link to={`/${user?.id}`}>
              <NavItem clicked={Boolean(homeMatch)}>
                <Svg
                  style={{ scale: "0.6" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm88 64v64H64V96h88zm56 0h88v64H208V96zm240 0v64H360V96h88zM64 224h88v64H64V224zm232 0v64H208V224h88zm64 0h88v64H360V224zM152 352v64H64V352h88zm56 0h88v64H208V352zm240 0v64H360V352h88z" />
                </Svg>
                <span>게시물</span>
              </NavItem>
            </Link>
            <Link to={`/${user?.id}/reels`}>
              <NavItem clicked={Boolean(reelsMatch)}>
                <Svg
                  style={{ scale: "0.7" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                </Svg>
                <span>릴스</span>
              </NavItem>
            </Link>
            <Link to={`/${user?.id}/saved`}>
              <NavItem clicked={Boolean(savedMatch)}>
                <Svg
                  style={{ scale: "0.6" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M336 0h-288C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93C357.2 519.1 384 504.6 384 479.9V48C384 21.49 362.5 0 336 0zM336 452L192 368l-144 84V54C48 50.63 50.63 48 53.1 48h276C333.4 48 336 50.63 336 54V452z" />
                </Svg>
                <span>저장됨</span>
              </NavItem>
            </Link>
            <Link to={`/${user?.id}/tagged`}>
              <NavItem clicked={Boolean(taggedMatch)}>
                <Svg
                  style={{ scale: "0.7" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c10 0 18.8-4.9 24.2-12.5l-99.2-99.2c-14.9-14.9-23.3-35.1-23.3-56.1v-33c-15.9-4.7-32.8-7.2-50.3-7.2H178.3zM384 224c-17.7 0-32 14.3-32 32v82.7c0 17 6.7 33.3 18.7 45.3L478.1 491.3c18.7 18.7 49.1 18.7 67.9 0l73.4-73.4c18.7-18.7 18.7-49.1 0-67.9L512 242.7c-12-12-28.3-18.7-45.3-18.7H384zm72 80c0 13.3-10.7 24-24 24s-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24z" />
                </Svg>
                <span>태그됨</span>
              </NavItem>
            </Link>
          </FeedNav>
          <Outlet />
        </Container>
        <ImgUpload />
      </Wrapper>
      {followList === "following" && (
        <Following id={user?._id as ObjectId} setModalVisible={setFollowList} />
      )}
      {followList === "follower" && (
        <Follower id={user?._id as ObjectId} setModalVisible={setFollowList} />
      )}
    </>
  );
}
