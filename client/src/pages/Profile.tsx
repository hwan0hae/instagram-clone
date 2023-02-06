import styled from "styled-components";
import { Link, Outlet, useMatch, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Svg } from "../components/layout/Feed/Feed";
import { useQuery } from "react-query";
import { getProfile } from "../utills/api";
import NotFound from "./NotFound";

const Wrapper = styled.div`
  width: clac(100% - 72px);
  position: relative;
  padding: 30px 20px;
  margin-left: 72px;
  display: flex;
  justify-content: center;

  @media screen and (min-width: 1250px) {
    width: calc(100%-244px);
    margin-left: 244px;
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
`;
const ProfileImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.borderLine};
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
`;
const ProfileId = styled.h2`
  font-size: 1.25rem;
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
  margin-right: 10px;
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
const ProfileIntroduction = styled.textarea`
  font-weight: 600;
  background-color: transparent;
  border: none;
  font-size: 14px;
  padding: 0;
  height: 120px;
  resize: none;
  color: ${(props) => props.theme.textColor};
`;
const StoryContainer = styled.div`
  padding: 0 16px;
  margin-bottom: 44px;
`;
const Storys = styled.ul`
  display: flex;
  padding: 0 12px;
  gap: 12px;
  overflow: hidden;
`;
const Story = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 15px;
  height: 130px;
  width: 115px;

  cursor: pointer;
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

export default function Profile() {
  const { id } = useParams();
  const { data, isLoading } = useQuery("profile", () =>
    getProfile(id as string)
  );
  // console.log(data> false > notfound);
  const homeMatch = useMatch(`/${id}`);
  const reelsMatch = useMatch(`/${id}/reels`);
  const savedMatch = useMatch(`/${id}/saved`);
  const taggedMatch = useMatch(`/${id}/tagged`);

  return (
    <>
      <Helmet>
        <title>{id}﹒Instagram</title>
        {/* meta태그 SEO 검색엔진 */}
      </Helmet>

      {isLoading ? null : (
        <>
          {data?.success ? (
            <Wrapper>
              <Container>
                <ProfileContainer>
                  <ProfileImgContainer>
                    <ProfileImg src={data?.profileImage} />
                  </ProfileImgContainer>
                  <ProfileInfo>
                    <ProfileHeader>
                      <ProfileId> {data?.id}</ProfileId>
                    </ProfileHeader>
                    <ProfileContent>
                      <ProfileName>{data?.name}</ProfileName>
                      <ProfileIntroduction
                        defaultValue={data?.introduction}
                        disabled
                      />
                    </ProfileContent>
                  </ProfileInfo>
                </ProfileContainer>
                <StoryContainer>
                  <Storys>
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
                  <Link to={`/${data?.id}`}>
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
                  <Link to={`/${data?.id}/reels`}>
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
                  <Link to={`/${data?.id}/saved`}>
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
                  <Link to={`/${data?.id}/tagged`}>
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
            </Wrapper>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </>
  );
}
