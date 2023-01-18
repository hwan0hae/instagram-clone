import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Heeader from "../components/layout/Header";
import Login from "../components/Login";
import Home from "./Home";
import MyPage from "./MyPage";
import MypageFeed from "./MyPageFeed";
import MypageReels from "./MyPageReels";
import MypageSaved from "./MyPageSaved";
import MypageTagged from "./MyPageTagged";
import Register from "./Register";
import { useQuery } from "react-query";
import { loginSuccess } from "../utills/api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoginAtom, userAtom } from "../utills/atoms";
export default function Router() {
  const [isLogin, setIsLogin] = useRecoilState<boolean>(isLoginAtom);

  const setUser = useSetRecoilState(userAtom);
  const loginUser = useQuery("LoginSuccess", loginSuccess);

  useEffect(() => {
    if (loginUser.data?.isAuth) {
      setIsLogin(true);
      setUser(loginUser.data);
    } else {
      setIsLogin(false);
      setUser(null);
    }
  }, [loginUser, setIsLogin, setUser]);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {loginUser.isLoading ? null : isLogin ? (
        <>
          <Heeader />

          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/:id" element={<MyPage />}>
              <Route index path="/:id" element={<MypageFeed />} />
              <Route path="/:id/reels" element={<MypageReels />} />
              <Route path="/:id/saved" element={<MypageSaved />} />
              <Route path="/:id/tagged" element={<MypageTagged />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
