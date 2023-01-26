import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { allUser, IAllUser } from "../../../utills/api";
import { ProfileId } from "./Feed";

const StoryContainer = styled.div`
  background-color: ${(props) => props.theme.containerColor};
  border: 1px solid ${(props) => props.theme.containerLine};
  margin: 16px 0;
  padding: 16px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  position: relative;

  overflow: hidden;
`;
const StoryBox = styled.ul`
  display: flex;
  padding: 1px 12px;
  gap: 12px;

  overflow: hidden;
`;
const StroyItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid ${(props) => props.theme.containerLine};
  border-radius: 50%;
  background-color: white;
  border: 4px solid ${(props) => props.theme.containerColor};
  box-shadow: 0px 0px 1px 0.5px rgba(128, 128, 128, 1);
`;

function StoryHeader() {
  const { data, isLoading } = useQuery<IAllUser[]>("allUser", allUser);
  return (
    <StoryContainer>
      {isLoading
        ? null
        : data?.map((user, index) => (
            <StoryBox key={index}>
              <StroyItem>
                <Link to={`/${user.id}`}>
                  <ProfileImg
                    src={user.profileImage}
                    style={{ width: 66, height: 66 }}
                  />
                </Link>
                <Link to={`/${user.id}`}>
                  <ProfileId style={{ fontSize: 12 }}>{user.id}</ProfileId>
                </Link>
              </StroyItem>
            </StoryBox>
          ))}
    </StoryContainer>
  );
}

export default StoryHeader;
