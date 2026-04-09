# 뉴스 AI 분석 서비스 v0.01

네이버 뉴스 API와 OpenAI GPT-5.4를 결합한 실시간 뉴스 AI 분석 웹 서비스입니다.
주석으로 심심해서 남깁니다. 

## 주요 기능

### 탭 구성
| 탭 | 설명 |
|---|---|
| 🔴 실시간 핫이슈 | 최신 뉴스 60초 자동 갱신 |
| ☀️ 일간 핫이슈 | 오늘의 주요 이슈 (메인 화면) |
| 📅 주간 핫이슈 | 이번 주 화제 뉴스 |
| 📂 카테고리별 | 정치/경제/IT·과학/스포츠/사회/문화·연예 |
| ✨ AI 브리핑 | GPT-5.4 데일리 뉴스 요약 (5분 캐시) |
| 🔍 키워드 검색 | 원하는 토픽 뉴스 검색 |
| 🔖 북마크 | 관심 뉴스 저장 (localStorage) |

### AI 분석 기능 (GPT-5.4)
- **키워드 추출** - 중요도 기반 키워드 선별 및 시각화
- **감정 분석** - 맥락 기반 감정 판단 (긍정/부정/중립 + 세부 감정)
- **마인드맵** - 중심 토픽 → 서브 토픽 → 세부 키워드 구조
- **카테고리 분류** - 자동 주제 태깅
- **트렌드 인사이트** - 이슈 배경/맥락/전망 심층 분석
- **댓글 여론 분석** - 예상 여론 반응 패턴 분석
- **관심도 측정** - 사회적 관심도 지수 (0~100)

### 헤드라인 카드 (1~3위)
- 뉴스 원문에서 OG 이미지 자동 추출 표시
- 1위는 대형 카드, 2·3위는 중형 카드로 시각적 구분

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 14 (App Router) |
| UI | Tailwind CSS + shadcn/ui |
| AI | OpenAI GPT-5.4 |
| 뉴스 | 네이버 검색 API |
| 캐시 | Firebase Firestore |
| 배포 | Firebase App Hosting |

## 프로젝트 구조

```
├── app/
│   ├── page.tsx              # 메인 페이지 (탭 라우팅)
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── news/             # 네이버 뉴스 검색 (서버 전용)
│       ├── analyze/          # OpenAI 분석 (서버 전용)
│       ├── digest/           # AI 데일리 브리핑 + Firebase 캐시
│       └── og-image/         # OG 이미지 스크래핑 (서버 전용)
├── components/
│   ├── Header.tsx
│   ├── TabNav.tsx
│   ├── NewsFeed.tsx          # 메인 뉴스 피드
│   ├── HeadlineCard.tsx      # 1~3위 헤드라인 카드
│   ├── NewsCard.tsx          # 일반 뉴스 카드
│   ├── AnalysisPanel.tsx     # AI 분석 결과 패널
│   ├── KeywordCloud.tsx
│   ├── SentimentBadge.tsx
│   ├── MindMap.tsx
│   ├── TrendInsight.tsx
│   ├── CommentAnalysis.tsx
│   ├── InterestMeter.tsx
│   ├── DigestTab.tsx
│   ├── CategoryTab.tsx
│   ├── SearchTab.tsx
│   └── BookmarkTab.tsx
└── lib/
    ├── types.ts              # 공통 타입 정의
    ├── naver.ts              # 네이버 API 클라이언트
    ├── openai.ts             # OpenAI 클라이언트
    ├── firebase.ts           # Firebase 초기화
    └── bookmark.ts           # 북마크 (localStorage)
```

## 보안

모든 API 키는 서버 사이드에서만 사용됩니다. 클라이언트에 키가 절대 노출되지 않습니다.

```
# 환경변수 (.env.local - 절대 커밋 금지)
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
OPENAI_API_KEY=...
```

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/YOUR_USERNAME/news-v.0.01.git
cd news-v.0.01
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
NAVER_CLIENT_ID=네이버_클라이언트_ID
NAVER_CLIENT_SECRET=네이버_시크릿
OPENAI_API_KEY=OpenAI_API_키
```

> **네이버 API**: [네이버 개발자 센터](https://developers.naver.com)에서 뉴스 검색 API 신청
> **OpenAI API**: [OpenAI Platform](https://platform.openai.com)에서 발급

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속

## Firebase 배포

자세한 배포 방법은 [DEPLOY.md](./DEPLOY.md)를 참고하세요.

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 배포
firebase deploy
```

## AI 브리핑 캐시 구조

```
Firestore
└── digest/
    └── latest
        ├── content: string     (브리핑 내용)
        └── generatedAt: number (생성 타임스탬프)
```

- 5분 이내 요청 시 캐시된 결과 반환 (GPT 호출 없음)
- 5분 경과 시 자동으로 새 브리핑 생성 및 갱신
- 강제 재생성은 브리핑 탭의 재생성 버튼 클릭

## 라이선스

MIT
