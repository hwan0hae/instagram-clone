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

-- 해야 할 일 --
// 이렇게 로직을짜도 되는것인가 .... 확인 필요
//헤더 hover text 애니메이션 사라지지 않는 버그 있음 체크 필요
// 엑세스 토큰 만료시 로그아웃 될것인데.. 갱신 어떻게 할 것인가 ? > refreshtoken db저장?
// React Ref를 이용하여 Dom객체에 직접 접근 -> 페이지가 로딩될때 아이디 입력창이 자동으로 Focus됨
