import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoginAtom, userAtom } from "../utills/atoms";
import { loginSuccess } from "../utills/api";

import Header from "../components/layout/Header/Header";
import Login from "./Login";
import Home from "./Home";
import MyPage from "./MyPage";
import MyPageFeed from "./MyPageFeed";
import MyPageReels from "./MyPageReels";
import MyPageSaved from "./MyPageSaved";
import MyPageTagged from "./MyPageTagged";
import Register from "./Register";
import Edit from "./Edit";

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
          <Header />

          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/:id" element={<MyPage />}>
              <Route index path="/:id" element={<MyPageFeed />} />
              <Route path="/:id/reels" element={<MyPageReels />} />
              <Route path="/:id/saved" element={<MyPageSaved />} />
              <Route path="/:id/tagged" element={<MyPageTagged />} />
            </Route>
            <Route path="/edit" element={<Edit />} />
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
