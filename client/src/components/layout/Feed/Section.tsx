import { ObjectId } from "mongoose";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Svg, SvgBtn } from "./Feed";

const FeedSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${(props) => props.theme.borderLine};
`;
const FeedSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 6px;
  padding: 6px 0 0 6px;
  justify-content: space-between;
`;
const FeedLikeCount = styled.div`
  font-weight: 600;
  padding: 0px 12px;
  margin-bottom: 12px;
`;

interface ISection {
  feedId: ObjectId;
}

function Section({ feedId }: ISection) {
  return (
    <FeedSectionContainer>
      <FeedSection>
        <div>
          <SvgBtn>
            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
            </Svg>
          </SvgBtn>
          <Link to={`/feed/${feedId}`}>
            <SvgBtn>
              <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.98c0 9.836 11.02 15.55 19.12 9.7l124.9-93.68h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z" />
              </Svg>
            </SvgBtn>
          </Link>
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
        <span>
          좋아요 <span>0</span>개
        </span>
      </FeedLikeCount>
    </FeedSectionContainer>
  );
}

export default Section;
