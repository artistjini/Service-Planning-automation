# Blueprint Dashboard

> Antigravity 확장 프로그램. `/blueprint` 메타스킬의 진행도·트리거·산출물을 사이드바·webview에 영구 시각화.
> AI 코딩 워크플로의 인지 과부하를 줄임.

**Current version**: v0.9.5 (2026-06-01)
**원작자**: Chris (문토 수업 공유) · **설치·배포·분석**: Jini (@artistjini)

---

## 무엇을 하나

- **왼쪽 사이드바** (3섹션):
  - **BLUEPRINT** — 현재 Phase + 진행도 progress bar
  - **PHASES** — Phase 0~6 완료/진행/대기 상태 리스트 (클릭 → 가운데 webview)
  - **CURRENT FOCUS** — `state.md`의 Next action 항상 표시
- **가운데 webview** (4탭):
  - **Plan** — `plans/roadmap.md` 풀너비 렌더
  - **Spec** — PRODUCT / DESIGN / ARCHITECTURE.md 탭 전환
  - **Preview** — 디자인 HTML 시안 미리보기
  - **Errors** — `docs/error.history.md` 에러 일지

## 데이터 흐름

**단방향**: `.md → UI`. extension은 .md를 *읽기만*. AI 호출 0.

```
.md 파일 변경
    ↓ file-watcher (debounce 200ms)
    ↓ parser
사이드바 + webview 자동 업데이트
```

## 설치

1. [Releases](https://github.com/artistjini/Service-Planning-automation/releases) 에서 최신 `.vsix` 다운로드
2. Antigravity → Extensions → `...` → `Install from VSIX` → 파일 선택
3. 사이드바에 나침반 🧭 아이콘이 생기면 완료

## 사용

1. 워크스페이스에 `.blueprint/state.md` 가 있어야 활성화
   (없으면 Claude 채팅에서 `/blueprint` 실행)
2. 좌측 나침반 아이콘 클릭 → 사이드바 확인
3. PHASES 항목 클릭 → 가운데 webview 열림
4. 상단 탭으로 Plan / Spec / Preview / Errors 전환

## 개발 환경 세팅

```bash
git clone https://github.com/artistjini/Service-Planning-automation.git
cd Service-Planning-automation
npm install
npm run build
npx vsce package --skip-license --no-dependencies
# 생성된 .vsix를 Antigravity에 설치
```

## 디렉터리

```
.blueprint/state.md        ← 진행 상황 메모 (진실 원본)
docs/
  PRODUCT.md               ← 제품 기획 (one-liner, NON-GOALS)
  DESIGN.md                ← 색·폰트·디자인 철학
  ARCHITECTURE.md          ← 스택·도메인·ADR
  adr/ADR-*.md             ← 아키텍처 결정 기록 (001~010)
  error.history.md         ← 에러 일지
plans/
  roadmap.md               ← Phase별 서브태스크 체크리스트
src/
  parser/                  ← state.md 파싱
  file-watcher/            ← .md 파일 watch + debounce
  sidebar/                 ← 사이드바 WebviewView
  webview/                 ← 가운데 4탭 패널
  extension.ts             ← orchestrator (전체 wire-up)
  types.ts                 ← 공유 타입 정의
jinilog/                   ← 학습 기록 및 가이드 모음
  dev_guide.md             ← 개발자 교과서
  user_guide.md            ← 사용자 설명서
  dev_user_blog.md         ← 분석 블로그
  guide_write_prompt.md    ← 가이드 작성 프롬프트
```

## 스택

| 레이어 | 선택 | 이유 |
|---|---|---|
| 언어 | TypeScript | 타입 안전 + VS Code 표준 |
| 플랫폼 | VS Code Extension API | Antigravity 호환 |
| 마크다운 파서 | markdown-it | 안정적, 플러그인 풍부 |
| 빌드 | esbuild | 빠른 번들링 |
| 패키징 | @vscode/vsce | .vsix 표준 |

## 버전 히스토리

| 버전 | 날짜 | 주요 내용 |
|---|---|---|
| v0.1.0 | 2026-05-24 | Phase 0~6 전 과정 완료, 첫 SHIP |
| v0.9.0~0.9.2 | 2026-05-30 | 디자인 목업 7종, progress bar 버그 수정 |
| v0.9.3 | 2026-05-30 | CSP `unsafe-inline` 버그 수정 |
| v0.9.4 | 2026-05-30 | iOS Settings 플랫 디자인 전면 적용 |
| v0.9.5 | 2026-06-01 | 사이드바 3섹션 단순화, GitHub 배포, 학습 가이드 추가 |

## 다음 (V1)

- 활동바 Trigger 배지 (빨간 점 알림)
- markdown-it 토큰 처리 안정화
- (선택) Mermaid 다이어그램 시각화

## 학습 가이드

이 프로젝트를 분석한 학습 기록은 [`jinilog/`](./jinilog/) 폴더를 참고하세요.

## License

Private (dogfooding 단계). 정식 배포 시 결정.
