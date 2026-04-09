# 배포 가이드

## Firebase App Hosting 배포

### 1. Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 2. Firebase 로그인
```bash
firebase login
```

### 3. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com)에서 새 프로젝트 생성
2. `.firebaserc` 파일의 `YOUR_FIREBASE_PROJECT_ID`를 실제 프로젝트 ID로 변경

### 4. App Hosting 활성화 및 환경변수 설정

Firebase Console에서 환경변수를 설정하거나 CLI를 사용:

```bash
firebase apphosting:secrets:set NAVER_CLIENT_ID
firebase apphosting:secrets:set NAVER_CLIENT_SECRET
firebase apphosting:secrets:set OPENAI_API_KEY
```

또는 Firebase Console → App Hosting → 백엔드 설정 → 환경변수에서 직접 입력

### 5. 배포

```bash
firebase deploy
```

## 로컬 개발 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 주의사항

- `.env.local` 파일은 절대 git에 커밋하지 마세요 (`.gitignore`에 포함됨)
- Firebase 배포 시 환경변수는 Firebase Secret Manager를 통해 안전하게 관리됩니다
- `OPENAI_API_KEY`는 서버 사이드(Route Handler)에서만 사용되어 클라이언트에 노출되지 않습니다
