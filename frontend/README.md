# 월말 잔고 프런트엔드

Figma에서 내보낸 React 19 + TypeScript + Vite + Tailwind CSS 화면입니다.

## 개발 실행

```powershell
cd frontend
npm install
npm run dev
```

접속: http://localhost:3000

`/api` 요청은 `http://localhost:8080`으로 프록시합니다.

## 빌드

```powershell
npm run typecheck
npm run build
```

결과는 `frontend/build`에 생성됩니다. 프로젝트 루트에서 `./gradlew.bat bootRun`을 실행하면 기존 Gradle 설정이 npm 설치와 빌드를 수행하고 결과를 Spring Boot 정적 리소스에 포함합니다. 접속 주소는 http://localhost:8080 입니다.

## 현재 구현 범위

- 로그인, 회원가입, 홈, 마이페이지 및 계좌·정기 구독·할부 화면
- 데모 로그인: `demo` / `1234`
- 로그인과 CRUD는 React 메모리 상태를 사용하는 시연 기능입니다. 서버 인증 및 DB 저장은 아직 연결되지 않았으며 새로고침하면 변경사항이 초기화됩니다.
- Figma 전용 개발·배포 플러그인은 로컬 실행에 필요한 Vite 설정으로 교체했습니다.
