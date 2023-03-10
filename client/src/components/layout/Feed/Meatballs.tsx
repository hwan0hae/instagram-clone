import { AnimatePresence, motion } from "framer-motion";
import { ObjectId } from "mongoose";
import { useEffect, useRef, useState } from "react";
import { useIsMutating, useMutation, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { feedDelete, IGetFeed, unFollow } from "../../../utills/api";
import { userAtom } from "../../../utills/atoms";
import { ModalScrollPrevent } from "../../../utills/utill";
import { Svg, SvgBtn } from "./Feed";

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
  z-index: 10;
`;
export const Modal = styled(motion.div)`
  background-color: ${(props) => props.theme.menuColor};
  width: 400px;
  margin: 40px;
  border-radius: 15px;
  box-shadow: -2px 3px 3px rgba(0, 0, 0, 0.1), -5px 5px 10px rgba(0, 0, 0, 0.03);

  overflow: hidden;
  z-index: 999;
`;

const Item = styled.div<{ color?: string }>`
  text-align: center;
  font-size: 16px;
  padding: 12px;
  font-weight: 400;
  cursor: pointer;

  color: ${(props) =>
    props.color === "red" ? props.theme.red : props.theme.textColor};

  &:not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.borderLine};
  }
  :hover {
    background-color: ${(props) => props.theme.bgColor};
  }
`;

function Meatballs({ feed }: { feed: IGetFeed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMutating = useIsMutating();
  const queryClient = useQueryClient();
  const user = useRecoilValue(userAtom);
  const [onTabClicked, setOnTabClicked] = useState<boolean>(false);
  const TabItemsRef = useRef<HTMLDivElement>(null);
  const feedDeleteMutation = useMutation(
    (feedId: ObjectId) => feedDelete(feedId),
    {
      onSettled: () => {
        setOnTabClicked(false);
        queryClient.invalidateQueries(["page_feed_list"]);
        queryClient.invalidateQueries("feed");
        queryClient.invalidateQueries("myFeed");
      },
    }
  );
  const unFollowMutation = useMutation((id: ObjectId) => unFollow(id), {
    onSettled: () => {
      queryClient.invalidateQueries("LoginSuccess");
    },
  });

  const FeedDeleteFn = (feedId: ObjectId) => {
    if (!isMutating) {
      if (location.state?.backgroundLocation) {
        navigate(location.state?.backgroundLocation.pathname, {
          state: { scroll: "fixed" },
        });
      }

      feedDeleteMutation.mutate(feedId);
    }
  };
  const unFollowFn = () => {
    if (!isMutating) {
      setOnTabClicked(false);
      unFollowMutation.mutate(feed.writer);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        TabItemsRef.current &&
        !TabItemsRef.current.contains(e.target as Node)
      ) {
        setOnTabClicked(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [TabItemsRef]);

  ModalScrollPrevent(location.state?.backgroundLocation ? false : onTabClicked);

  return (
    <>
      <SvgBtn onClick={() => setOnTabClicked(true)}>
        <Svg
          style={{ scale: "0.7" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
        </Svg>
      </SvgBtn>
      <AnimatePresence>
        {onTabClicked && (
          <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Modal
              ref={TabItemsRef}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {feed.writer === user?._id ? (
                <>
                  <Item color="red" onClick={() => FeedDeleteFn(feed._id)}>
                    ??????
                  </Item>
                </>
              ) : (
                <>
                  <Item color="red">??????</Item>
                  <Item color="red" onClick={unFollowFn}>
                    ????????? ??????
                  </Item>
                </>
              )}

              {location.state?.backgroundLocation ? null : (
                <Item
                  onClick={() =>
                    navigate(`/feed/${feed._id}`, {
                      state: { backgroundLocation: location },
                    })
                  }
                >
                  ???????????? ??????
                </Item>
              )}
              <Item>??????????????? ??????</Item>
              <Item>?????? ??????...</Item>
              <Item>?????? ??????</Item>
              <Item>?????????</Item>
              <Item onClick={() => setOnTabClicked(false)}>??????</Item>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}

export default Meatballs;
