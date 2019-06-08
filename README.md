# KakaoNode
Node.js based SNS service project

<br>

##### 버전(계속 추가 예정)

version 1 : 회원가입 및 로그인을 통해 게시글 업로드

version 2 : 카카오톡 로그인 기능 추가(api 활용)

version 3 : 닉네임 수정, 좋아요 기능 추가

<br>

##### 프로젝트 개요

동료들과 한주간 식단정보 공유(이미지)

주요 공지사항 및 다양한 뉴스기사 정보 공유

실제 SNS처럼 해시태그(#abc) 기능을 통한 필요한 정보만 따로 검색 서비스

<br>

**개발 기간** : 2019.05.29 ~ 2019.06.07

**개발 환경** : Visual Studio Code, Node, MySQL Workbench, Redis, AWS

**사용 언어** : Javascript, Pug, SQL

<br>

<br>

Express의 Sequelize를 활용한 데이터베이스 모델을 생성 및 모델들 간의 관계 형성 이해

세션이 종료되도 로그인을 유지하기 위한 Redis를 연동해보면서 데이터를 포함한 자료구조 저장 기능 학습

아마존 웹 서비스(AWS) EC2 배포를 통해 웹 서버 구축 방법 이해

<br>

#### 메인 화면 (로그인 전)

---

![main2.JPG](https://github.com/kim6394/KakaoNode/blob/master/screenshot/main2.JPG?raw=true)

로그인은 local과 kakao 모두 가능하도록 구현

(kakao api 활용)

<br>

#### 메인 화면(로그인 후)

---

![main.JPG](https://github.com/kim6394/KakaoNode/blob/master/screenshot/main.JPG?raw=true)

- 이미지 첨부와 글 작성
- 자신이 작성한 글만 삭제 가능
- 다른 사람 팔로우하기/끊기
- 태그를 통한 게시글 검색
- 내 팔로잉/팔로워 count 표시

<br>

#### 회원가입

---

![join.JPG](https://github.com/kim6394/KakaoNode/blob/master/screenshot/join.JPG?raw=true)

비밀번호는 암호화 관리(bcrypt) - 외부유출 금지

<br>

<br>

#### 내 프로필

---

![profile.JPG](https://github.com/kim6394/KakaoNode/blob/master/screenshot/profile.JPG?raw=true)

- 현재 로그인된 아이디의 팔로잉/팔로워 목록 확인

- 현재 로그인된 아이디의 닉네임 수정
