# boiler-plate

## config

비밀정보 보호는 gitignore에서 올릴때 배제되게 해야한다.

### package.json

배포할 때 어떤 라이브러리가 포함되느냐 차이이다.

- dependencies
  설치된 라이브러리 포함

- devDependencies (개발자용)
  개발할 때 필요한 라이브러리기 때문에 배포할 때 포함되지 않는다.

- type:"module"
  es module을 사용하여 import, export 사용 가능

# 1월 12일 목요일

Clinet

- Login시 Recoil(상태 관리 라이브러리) 통하여 로그인 유무 및 로그인 유저 정보 관리
- Router에서 useEffect로 수시로(렌더링) loginSucces 쿼리를 통해 로그인 유무 확인(cookie-accessToken) 체크하여 인증 / 권한(로그인)에 따라 알맞은 페이지 로더
- 엑세스 토큰 만료시 로그아웃 처리 (현재) > 리프레시 토큰 이용 해서 갱신 해야함 (할일)
- 엑세스 토큰 만료 or 로그아웃시 Login 페이지로 이동
- 없는페이지 접속시 리다이랙션('/') 처리 로그인 유무에 따라 (Home or Login)페이지 이동
- Login시 Login한 User정보로 페이지 구현(진행중)

Server

- jwt 공부 및 테스트(accessToken, refreshToken)
- jwt 사용하여 토큰 생성
- login 요청시 DB확인 후 브라우저 쿠키에 accessToken, refreshToken 저장
- loginSuccess 요청시 password을 제외한 User 정보 response
- logout 요청 처리

# 1월 15일 일요일

Client

- apiController를 만들어서 api(loginSuccess) 응답에서 error 발생시 응답 전에 intercept하여 error별 처리 해줌 (TokenExpiredError시 refreshToken 요청하여 accessToken 갱신 해옴)

Server

- LoginSuccess 통신 Error별 예외처리(try-catch, throw)
- LoginSuccess 통신 isAuth(payload) 통해 Client 인가 여부 확인
- 로그인시 refreshToken DB 저장

# 1월 16일 월요일

- 크몽 EventForm 페이지 구성
- 세금 공부 (세금계산서, 원천세 등)

# 1월 17일 화요일

- 내용 복습 및 정리

Server

- no accessToken은 에러처리 X.
- refreshToken 갱신시 쿠키와 DB 토큰 비교 확인

# 1월 18일 목요일

Client

- form submit valid check > error input focus
- Helmet 사용 페이지별 title 적용
- Router Edit 페이지 생성(진행)
- profile사진 변경 적용중

Sever

- refreshToken 만료시 로그아웃처리(accessToken값 제거) > 새로 로그인 해야함
  > > 서버 꺼지던 문제 err발생 시(만료) return으로 후 동작 막음

# 1월 19일 금요일

Client

- 프로필 이미지 UI 적용

Sever

- 프로필 사진 변경
- multer middleware 공부(image/video 등 formData 파싱)
- 프로필 사진 변경 시 사진 서버에 저장 후 경로 db에 저장 전에 있던 프로필 사진은 삭제처리
- 정적파일 불러오기 express.static (웹 경로 img 띄우기)
- 렌더링 loginSuccess 마다 login User 정보 프로필 사진 경로도 가져와서 뿌려줌

-- 해야 할 일 --

// 라우터 \* >> url검색및 새로고침시 다 default 로 보내버리는 이슈
// 코드 try catch 등 정리
게시물

# 깃허브 정리

https://velog.io/@laeyoung/%ED%95%98-Frontend-%EA%B0%9C%EB%B0%9C%EC%9E%90%ED%98%95%EB%93%A4
