import { useEffect } from "react";
import disableScroll from "disable-scroll";

export const ModalScrollPrevent = () => {
  // 모달 오버레이에서 스크롤 방지
  useEffect(() => {
    disableScroll.on(); // prevent scrolling
    return disableScroll.off(); // re-enable scroll
  }, []);
};
