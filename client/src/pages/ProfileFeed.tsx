import { useQuery } from "react-query";
import styled from "styled-components";
import { getMyFeed, getProfileFeed, IGetFeed } from "../utills/api";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../utills/atoms";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  padding-bottom: 224px;
`;
const FeedContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 3%;
  flex-wrap: wrap;
`;
const FeedBox = styled.div`
  width: 31%;
  aspect-ratio: 1 / 1;
  margin-bottom: 28px;
  line-height: 0;
  position: relative;
  cursor: pointer;

  :hover {
    div {
      opacity: 1;
    }
  }
`;
const Feed = styled.img`
  width: 100%;
  height: 100%;
`;

const FeedOverlay = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;
const ItemBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Svg = styled.svg`
  fill: white;
  stroke: white;
  stroke-width: 1px;

  width: 18px;
  height: 18px;

  background-color: transparent;
`;

const Item = styled.div`
  color: white;
  font-weight: 800;
  font-size: 18px;
`;
export default function ProfileFeed() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<IGetFeed[]>("profileFeed", () =>
    getProfileFeed(id as string)
  );
  const isDarkMode = useRecoilValue<boolean>(isDarkAtom);

  return (
    <>
      <Container>
        {isLoading ? (
          <PacmanLoader color={isDarkMode ? "white" : "black"} size="50px" />
        ) : (
          <FeedContainer>
            {data?.map((feed, index) => (
              <FeedBox
                key={index}
                onClick={() =>
                  navigate(`/feed/${feed._id}`, {
                    state: { backgroundLocation: location },
                  })
                }
              >
                <Feed src={feed.content.feedImage} />
                <FeedOverlay>
                  <ItemBox>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </Svg>
                    <Item>{feed.likeList.length}</Item>
                  </ItemBox>
                  <ItemBox>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
                    </Svg>
                    <Item>{feed.comments.length}</Item>
                  </ItemBox>
                </FeedOverlay>
              </FeedBox>
            ))}
          </FeedContainer>
        )}
      </Container>
    </>
  );
}
