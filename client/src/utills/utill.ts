import { useEffect, useRef } from "react";
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
