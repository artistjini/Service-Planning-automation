# Changelog

모든 주목할 만한 변경사항은 이 파일에 기록됩니다.

형식: [Keep a Changelog](https://keepachangelog.com/) + [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-05-24

V0+ 첫 정식 출시. Antigravity에서 사용자 본인 dogfooding 완료.

### Added
- **사이드바 (WebviewView 기반)** — 6섹션: Hero(폴더 경로 + 현재 phase + progress), Phases 7-row, Current focus, Triggers, Active file, Recent changes
- **가운데 webview — 4페이지 멀티탭**:
  - Plan — `plans/roadmap.md` 풀-너비 + state.md 현재 위치 강조
  - Spec — PRODUCT/DESIGN/ARCHITECTURE.md (탭 전환 형태, 스크롤 X)
  - Preview — Claude `blueprint.preview` 명령으로 push한 HTML (1개만)
  - Errors — `docs/error.history.md` 풀-너비 (없으면 생성 버튼)
- **마크다운 자동 가공**: hex/rgba 색 자동 swatch, NON-GOALS 빨간 ✗ grid, ## 헤딩 글래스 카드, 디자인 시안 자동 그리드 (placeholder 포함)
- **File watcher** — `.blueprint/state.md`, `docs/**/*.md`, `docs/design/screenshots/**/*.{png,jpg,...}`, `plans/**/*.md`, `src/**/*` 자동 감지 + debounce 200ms
- **명령 3개**: `blueprint.showDashboard`, `blueprint.refresh`, `blueprint.preview`
- **디자인 시스템**: Notion + Apple 글래스 풍 (컬러 blob 배경 + backdrop-filter blur + Apple 색 + iOS progress 그라데이션)

### Architecture
- TypeScript + esbuild + markdown-it + VS Code Extension API
- 도메인 5개: parser / file-watcher / sidebar / webview / extension
- 단방향 데이터 흐름 (.md → UI), AI 호출 0
- ADR-001~008 박음

### Known limitations
- Antigravity 채팅이 첫 Editor Group을 차지 → webview는 사용자 시점 오른쪽 default. 드래그로 위치 자유 조정.
- 자동 가공이 HTML 정규식 후처리 — 마크다운 구조가 예상과 다르면 미동작. V1에서 markdown-it 토큰 처리 검토.
- 디자인 시안 (`docs/design/screenshots/`) 폴더 빈 상태. 사용자가 직접 캡처 저장 필요.

[0.1.0]: https://github.com/snu9026-Chris/SERVICE-PLANNING/releases/tag/v0.1.0
