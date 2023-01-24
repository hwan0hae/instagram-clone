import { useQuery } from "react-query";
import styled from "styled-components";
import { getMyFeed, IGetFeed } from "../utills/api";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../utills/atoms";

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

  cursor: pointer;
`;

export default function MypageFeed() {
  const { data, isLoading } = useQuery<IGetFeed[]>("myFeed", getMyFeed);
  console.log(data);
  const isDarkMode = useRecoilValue(isDarkAtom);
  return (
    <Container>
      {isLoading ? (
        <PacmanLoader color={isDarkMode ? "white" : "black"} size="50px" />
      ) : (
        <FeedContainer>
          {data?.map((feed, index) => (
            <FeedBox key={index}>
              <Feed src={feed.content.feedImage} />
            </FeedBox>
          ))}
        </FeedContainer>
      )}
    </Container>
  );
}
