import { useQuery } from "react-query";
import styled from "styled-components";
import { getMyFeed, IGetFeed } from "../utills/api";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../utills/atoms";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import Detail from "./Detail";

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
`;
const Feed = styled.img`
  width: 100%;
  height: 100%;
`;

export default function MyPageFeed() {
  const navigate = useNavigate();
  const feedPathMatch: PathMatch<string> | null = useMatch(`/p/:id`);
  const { data, isLoading } = useQuery<IGetFeed[]>("myFeed", getMyFeed);
  const isDarkMode = useRecoilValue<boolean>(isDarkAtom);
  // const [detailClicked, setDetailClicked] =
  //   useRecoilState<boolean>(detailClickedAtom);
  return (
    <>
      <Container>
        {isLoading ? (
          <PacmanLoader color={isDarkMode ? "white" : "black"} size="50px" />
        ) : (
          <FeedContainer>
            {data?.map((feed, index) => (
              <FeedBox key={index} onClick={() => navigate(`/p/${feed._id}`)}>
                <Feed src={feed.content.feedImage} />
              </FeedBox>
            ))}
          </FeedContainer>
        )}
      </Container>
      {feedPathMatch ? <Detail /> : null}
    </>
  );
}
