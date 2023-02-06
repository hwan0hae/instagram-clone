import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
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
import Detail from "./Detail";
import Profile from "./Profile";
import ProfileFeed from "./ProfileFeed";
import NotFound from "./NotFound";
import { ScrollToTop } from "../utills/utill";

export default function Router() {
  const location = useLocation();
  const state = location.state as {
    backgroundLocation?: Location;
    scroll?: string;
  };
  const [isLogin, setIsLogin] = useRecoilState<boolean>(isLoginAtom);
  const [user, setUser] = useRecoilState(userAtom);

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
    <>
      {loginUser.isLoading ? null : isLogin ? (
        <>
          {state?.backgroundLocation || state?.scroll ? null : <ScrollToTop />}
          <Header />

          <Routes location={state?.backgroundLocation || location}>
            <Route path="/" element={<Home />} />

            <Route path={`/${user?.id}`} element={<MyPage />}>
              <Route index element={<MyPageFeed />} />
              <Route path="reels" element={<MyPageReels />} />
              <Route path="saved" element={<MyPageSaved />} />
              <Route path="tagged" element={<MyPageTagged />} />
            </Route>

            <Route path="/edit" element={<Edit />} />

            <Route path=":id" element={<Profile />}>
              <Route index element={<ProfileFeed />} />
              <Route path="reels" element={<MyPageReels />} />
              <Route path="saved" element={<MyPageSaved />} />
              <Route path="tagged" element={<MyPageTagged />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>

          {state?.backgroundLocation && (
            <Routes>
              <Route path="/feed/:feedId" element={<Detail />} />
            </Routes>
          )}
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

//:id 파라메터구해서 해당 정보 가져오기 뿌려주기 > auth가 맞으면 내 페이지 인것으로
