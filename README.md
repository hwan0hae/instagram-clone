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

# 1월 19일 목요일

Client

- form submit valid check > error input focus
- Helmet 사용 페이지별 title 적용
- Router Edit 페이지 생성(진행)
- profile사진 변경 적용중

Sever

- refreshToken 만료시 로그아웃처리(accessToken값 제거) > 새로 로그인 해야함
  > > 서버 꺼지던 문제 err발생 시(만료) return으로 후 동작 막음

# 1월 20일 금요일

Client

- 프로필 이미지 UI 개선

Sever

- 프로필 사진 변경
- multer middleware 공부(image/video 등 formData 파싱)
- 프로필 사진 변경 시 사진 서버에 저장 후 경로 db에 저장 전에 있던 프로필 사진은 삭제처리
- 정적파일 불러오기 express.static (웹 경로 img 띄우기)
- 렌더링 loginSuccess 마다 login User 정보 프로필 사진 경로도 가져와서 뿌려줌
- 현재 사진 삭제 기능
- 사진 변경 or 삭제시 overlay close

# 1월 21일 토요일

Client

- Edit Page 구현
- profileUpload 컴포넌트화
- user 정보 소개 추가

Sever

- 프로필 사진 변경 코드 개선 및 오류 수정 (절대 경로 DB저장 변경 후 서버 사진 삭제 안되는 버그 수정)
- profile modify 기능 구현

# 1월 23일 월요일

공통

- 게시물 업로드 구현
- MyPage 내가 올린 Feed 가져오기 구현
- Home 모든 Feed 가져오기 구현

Client

- Header Hamburger 분해
- Nav > 만들기(게시물) 업로드 모달 구성
- MyPage Feed 1:1 비율 고정

Server

- feed DB 테이블 생성 및 컬렉션 저장
- 피드 최신순 데이터 건내주기

# 1월 24일 화요일

공통

- Stroy 모든 유저 출력 //

Client

- Home 컴포넌트화 및 구조 다시짜기
- Detail page 진행중(netflex > info 처럼 만들면됨)

# 1월 25일 수요일

Client

- react-hook-form 공부(피드 개별 인덱스 적용)
- Detail page 진행중
- Feed 댓글 기능 구현중 (피드별 이모지 기능 + 댓글 기능)

# 1월 26일 목요일

공통

- 댓글 기능 구현

Client

- 피드업로드 이슈 수정(업로드시 랜더링 안됨, 업로드 취소 후 같은 이미지 선택시 업로드 처리됨)

Server

- DB재설계(feed,comment)
- 비동기 공부

# 1월 27일 금요일

Client

- commentWrite 컴포넌트화
- Detail 진행중

Server

- 게시물 클릭시 정보 state로 보낼시 새로운 정보 가져오려면 다시 state 부터 올라와야하는 이슈 (피드 params로 개별 정보 api 받아오는걸로 처리)

# 1월 28일 토요일

-Client

- Detail 페이지 마무리
- Detail 모달형식 구현(백그라운드 Home, Mypage 등)
- 디테일 페이지에서 뒤에 스크롤 되는 이슈 해결

# 1월 31일 화요일

공통

- 좋아요 기능 구현

# 2월 1일 수요일

공통

- 좋아요리스트 구현
- 좋아요 기능 이슈 수정(좋아요 중첩)

# 2월 2일 목요일

Client

- 더블클릭시 좋아요 기능과 피드 가운데 하트 댐핑 구현
- 로그인시 좋아요 눌려져있음에도 하트 채워져있지않는 이슈 (버그 수정)

-- 해야 할 일 --

-

- 좋아요 빨리누를시 처리..?
- 댓글 삭제
- 피드 or 라우터 id 입력시 존재하는 아이디면 해당 페이지 구성하기 >> 페이지 이동시 top 맨위로

!! 라우터 \* >> url검색및 새로고침시 다 default 로 보내버리는 이슈

!! 푸터
------------------------------- 여깄는건 다해자 //

?? 로그인 / 회원가입 / 수정 submit 비활성화/활성화 기능
?? 팔로우 기능...?
?? 10개 뿌려주고 밑으로내리면 추가로 뿌려주고 그런기능

// Client(component, style) 코드 정리 및 Server(try catch) 등 정리

# 깃허브 정리

- 내용 정리 + 배포 주소 등
  https://velog.io/@laeyoung/%ED%95%98-Frontend-%EA%B0%9C%EB%B0%9C%EC%9E%90%ED%98%95%EB%93%A4
