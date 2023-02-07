import { Date } from "mongoose";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** 모달 오버레이에서 스크롤 방지 */
export const ModalScrollPrevent = (modal: boolean = true) => {
  useEffect(() => {
    if (!modal) return;

    document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, [modal]);
};
/** 첫 렌더링 막기 */
export const useDidMountEffect = (func: () => any, deps: Array<any>) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

/** 라우터 이동시 스크롤 0,0  */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/** 경과 시간 */
export const elapsedTime = (date: Date) => {
  console.log(date);
  // const start = new Date(date);
  const end = new Date();
  console.log(end);
  // const diff = (end - start) / 1000;

  const times = [
    { name: "년", milliSeconds: 60 * 60 * 24 * 365 },
    { name: "개월", milliSeconds: 60 * 60 * 24 * 30 },
    { name: "일", milliSeconds: 60 * 60 * 24 },
    { name: "시간", milliSeconds: 60 * 60 },
    { name: "분", milliSeconds: 60 },
  ];

  for (const value of times) {
    // const betweenTime = Math.floor(diff / value.milliSeconds);
    // if (betweenTime > 0) {
    //   return `${betweenTime}${value.name} 전`;
    // }
  }
  return "방금 전";
};
