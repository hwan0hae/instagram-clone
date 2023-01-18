import axios from "axios";

//axios 요청이 길어질 때 요청을 중단하고, timeout 처리를 하고 싶다면 요청 config에 timeout 설정을 해주어야 합니다.
const instance = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "" : "http://localhost:3000",
  timeout: 1000,
});

/**
 1. 요청 인터셉터
 2개의 콜백 함수를 받습니다.
 */
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // 요청 에러 직전 호출됩니다.
    return Promise.reject(error);
  }
);

/**
 2. 응답 인터셉터
 2개의 콜백 함수를 받습니다.
 */
instance.interceptors.response.use(
  (response) => {
    /*
        http status가 200인 경우
        응답 성공 직전 호출됩니다.
        .then() 으로 이어집니다.
    */

    return response;
  },

  async (error) => {
    /*
        http status가 200이 아닌 경우
        응답 에러 직전 호출됩니다.
        .catch() 으로 이어집니다.
    */

    const {
      config,
      response: { status, data },
    } = error;
    if (status === 401) {
      if (data.name === "TokenExpiredError") {
        const originalRequest = config;
        // token refresh 요청

        const { data } = await axios.get(
          `/api/users/refreshtoken` // token refresh api
        );

        // 401로 요청 실패했던 요청 새로운 accessToken으로 재요청
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
