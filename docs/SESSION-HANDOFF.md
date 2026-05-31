# Session Handoff — Blueprint Dashboard 확장 프로그램

> 작성: 2026-06-01 / Antigravity 환경 이전용 인수인계 문서

---

## 프로젝트 한 줄 요약

`.blueprint/state.md` + `docs/*.md`를 Antigravity 사이드바에 실시간 시각화하는 VS Code 확장 프로그램.  
AI 호출 없음, 단방향 (파일 → UI), 솔로 빌더용.

---

## 현재 버전: v0.9.5

### 설치 방법
```
extensions 패널 → ··· → Install from VSIX → blueprint-dashboard-0.9.5.vsix
```
또는 터미널:
```
antigravity-ide --install-extension blueprint-dashboard-0.9.5.vsix
```

### 설치 확인
```
antigravity-ide --list-extensions --show-versions
# snu90.blueprint-dashboard@0.9.5 가 보이면 성공
```

---

## 이번 세션에서 한 일 (2026-06-01)

### 1. 사이드바 정보 위계 정리 (핵심 작업)

**Before (v0.9.4):** 6개 섹션 — Hero + Phases + Current Focus + Triggers + Active File + Checkpoints + Recent Changes  
**After (v0.9.5):** 3개 섹션만 — **BLUEPRINT / PHASES / CURRENT FOCUS**

변경 파일:
- `src/sidebar/sidebar-view-provider.ts` — dead code 전부 제거, HTML 구조 재작성
- `src/sidebar/sidebar-styles.css` — 글래스모피즘 override 제거, 플랫 iOS Settings 단일 CSS로 통합

제거된 것:
- `renderCheckpointKpi()`, `renderTriggers()`, `renderActiveFile()`, `renderRecentChanges()`
- `isIgnoredPath()`, `categorize()`, `formatRelativeTime()`, `shortPath()`
- `.card`, `.card-heading`, `.triggers-*`, `.active-file-*`, `.recent-*`, `.kpi-*` CSS 클래스

### 2. 새 사이드바 구조 (목업 sidebar.html 기반)

```
BLUEPRINT              ← kick 라벨
┌─────────────────────┐
│ Workspace           │
│ c:\...\프로젝트명    │ ← row: 폴더 경로
├─────────────────────┤
│ PHASE 6             │
│ POST-SHIP           │ ← row: 현재 phase + progress bar
│ ████████░░ 86%      │
└─────────────────────┘

PHASES                 ← kick 라벨
┌─────────────────────┐
│ ✓ P0  PRODUCT  05-22│
│ ✓ P1  DESIGN   05-22│
│ ● P2  ARCHITECTURE  │ ← in_progress (파란 점)
│ ○ P3  IMPLEMENT     │ ← pending (빈 원)
│ ...                 │
└─────────────────────┘

CURRENT FOCUS          ← kick 라벨
┌─────────────────────┐
│ PHASE 2 · ARCH...   │
│ 다음 할 일 텍스트    │ ← state.md next action
└─────────────────────┘
```

### 3. .vsix 패키징

- `blueprint-dashboard-0.9.5.vsix` 생성 완료 (2.05 MB)
- `package.json` 버전 0.9.4 → 0.9.5 업데이트
- `CHANGELOG.md` v0.9.5 항목 추가

---

## 전체 릴리스 이력

| 버전 | 날짜 | 핵심 내용 |
|------|------|-----------|
| v0.1.0 | 05-24 | Phase 0~6 완료, 첫 SHIP |
| v0.2.0 | 05-24 | CHECKPOINT KPI 카드화 (ADR-009) |
| v0.3.0 | 05-24 | Preview 자동 목록 + Spec 3종 목업 |
| v0.4.0 | 05-24 | Spec 폴더 탐색기 구조 |
| v0.5.0 | 05-24 | Phase 4 REVIEW 정식 도입 |
| v0.6.0 | 05-24 | Spec 트리 + adr/ + design-gallery |
| v0.7.0 | 05-24 | iframe 썸네일 + sidebar.html 목업 |
| v0.8.0 | 05-24 | 사이드바 4섹션 정리 + RECENT CHANGES 라벨 매핑 |
| v0.9.0 | 05-30 | 디자인 목업 HTML 7종 + Phase 4 REVIEW 자동 규칙 |
| v0.9.1 | 05-30 | `/blueprint` Phase 1 디자인 승인 루프 |
| v0.9.2 | 05-30 | progress bar 100% 버그 수정 |
| v0.9.3 | 05-30 | CSP `unsafe-inline` 누락 버그 수정 (progress bar 안 보이던 문제) |
| v0.9.4 | 05-30 | 플랫 iOS Settings 시안 전면 적용, Pretendard 번들 |
| **v0.9.5** | **06-01** | **사이드바 3섹션 단순화, iOS Settings 구조 완성** |

---

## 주요 아키텍처 결정 (ADR 요약)

| # | 결정 |
|---|------|
| 001 | TypeScript + VS Code Extension API |
| 002 | AI 호출 일절 금지 — 시각화만 |
| 003 | 단방향 데이터 (파일 → UI, UI → 파일 X) |
| 004 | 이벤트 버스 기반 도메인 간 통신 |
| 007 | 사이드바 TreeView → WebviewViewProvider 전환 |
| 008 | 마크다운 자동 가공 파이프라인 |
| 009 | CHECKPOINT = phase 리스트 제외, KPI 카드 |
| 010 | REVIEW = IMPLEMENT~SHIP 사이 정식 phase |

---

## 다음에 할 일

1. **설치 테스트** — Antigravity에서 v0.9.5 사이드바 3섹션 렌더 확인
2. **Phase row 클릭** → 가운데 webview 열리는지 확인
3. **V1 범위** (PRODUCT.md 기준):
   - 활동바 trigger 배지 (빨간 점) — `triggers` 배열이 비어있지 않을 때
   - 가운데 webview 4페이지 품질 개선 (Plan / Spec / Preview / Errors)

---

## 파일 구조 (핵심만)

```
Service Planning automation/
├── src/
│   ├── sidebar/
│   │   ├── sidebar-view-provider.ts   ← 사이드바 HTML 렌더러
│   │   └── sidebar-styles.css         ← iOS Settings 플랫 스타일
│   ├── webview/
│   │   ├── panel.ts
│   │   ├── pages/                     ← Plan / Spec / Preview / Errors
│   │   └── styles.css
│   ├── parser/
│   │   └── state.ts                   ← .blueprint/state.md 파서
│   ├── extension.ts                   ← activate / 이벤트 버스
│   └── types.ts                       ← 공유 타입
├── docs/
│   ├── PRODUCT.md                     ← NON-GOALS 포함
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   └── design/screenshots/            ← 목업 HTML 10종
├── .blueprint/state.md                ← 현재 phase 상태 (진실 원본)
├── blueprint-dashboard-0.9.5.vsix     ← 설치 파일
├── DIGEST.md                          ← 세션 요약 (역시간순)
└── CLAUDE.md                          ← 작업 규칙
```

---

## 빌드 명령

```bash
npm run build        # esbuild 번들
npx tsc --noEmit     # 타입 체크
npx vsce package     # .vsix 패키징
```
