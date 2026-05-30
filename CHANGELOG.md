# Changelog

모든 주목할 만한 변경사항은 이 파일에 기록됩니다.

형식: [Keep a Changelog](https://keepachangelog.com/) + [Semantic Versioning](https://semver.org/).

## [0.6.0] — 2026-05-30

### Added (Spec 트리 확장)
- **adr/ 폴더** 트리에 자동 표시 — `docs/adr/*.md` 파일들 listing. 각 파일을 클릭하면 우측에 풀-너비 마크다운 렌더 (📜 아이콘).
- **design/screenshots/ 폴더** 트리에 자동 표시 — 폴더 자체 클릭 시 우측에 *큰 아이콘 그리드* (Windows 탐색기 풍, 색깔 그라데이션 placeholder + 파일명).
- 그리드 카드 클릭 → 그 자리(Spec 페이지 내부)에서 iframe srcdoc 미리보기. "← 그리드로" 버튼으로 복귀.
- file-watcher: `docs/adr/*.md` 변경 시 Spec extras 자동 reload.

### Changed
- `SpecArtifacts` 타입에 `adrFiles`, `designHtmlFiles` (각 파일에 content 포함) 필드 추가.
- `SpecFolderKey` 에 `adr`, `design-gallery` 추가 (Phase 7개와 무관 — Spec UI 내부 enum).
- `extension.ts`: `reloadSpecExtras` — adr/ + design/screenshots/ 파일 listing 수집 (content 포함, lazy 아님).

## [0.5.0] — 2026-05-30

### Changed (Breaking schema)
- **Phase 7개로 복귀** — `PRODUCT / DESIGN / ARCHITECTURE / IMPLEMENT / **REVIEW** / SHIP / POST-SHIP`. REVIEW가 IMPLEMENT와 SHIP 사이 정식 phase. ADR-010.
- `parser/state.ts` 호환 매핑 — v0.1 / v0.2~v0.4 / v0.5 schema 다 인식.

### Added
- **Preview 페이지 큰 아이콘 그리드** — Windows 탐색기 풍. 색깔 그라데이션 placeholder + 파일명 + 경로. 클릭하면 풀-너비 viewer. "← 그리드로" 버튼으로 복귀.

### Notes
- /blueprint 스킬의 Phase 4 REVIEW 자동 호출 룰은 별도 작업 (다음 버전).
- 진짜 썸네일 (iframe srcdoc scaled)은 V0.6에서.

## [0.4.0] — 2026-05-30

### Changed (Major UX)
- **Spec 페이지 완전 재구조** — 단순 탭 전환 → **폴더 탐색기 풍** (시안 1 채택).
  - 좌측: 트리 (PRODUCT/DESIGN/ARCHITECTURE 폴더 → 각 ## 섹션을 file로)
  - 우측: 선택한 섹션 풀-너비 마크다운 렌더 (## 카드 변환 안 함 — 이미 섹션 단위)
  - 클릭 → postMessage('spec-select') → panel이 active 갱신 → refresh
  - 폴더 토글은 클라이언트 측 DOM (서버 round-trip 없음)
- 섹션 아이콘 자동 매핑: NON-GOALS=🚫, 색=🎨, 타이포=🔤, 디자인 시안=🖼️, Stack=⚙️, Domain map=🗺️, Performance=⚡, ADR=📋

### Added
- `shared.ts` — `extractSections`, `renderMarkdownSection` (## 카드 변환 제외 버전), `MarkdownSection` 타입

### Files updated
- `src/webview/pages/spec.ts` (완전 재작성)
- `src/webview/panel.ts` (specActive 상태, spec-select 메시지 처리)
- `src/webview/styles.css` (`.spec-explorer`, `.spec-tree-pane`, `.spec-row` 등)

## [0.3.0] — 2026-05-24

### Added
- **Preview 페이지 자동 listing**: 좌측에 `docs/design/**/*.html` 파일들 자동 표시. 클릭으로 미리보기. 채팅 명령 (`프리뷰에 X 띄와봐`)도 그대로 동작.
- **시안 3개** 추가: `docs/design/screenshots/spec-mockup-{1-explorer,2-notion,3-columns}.html` — Spec 페이지 폴더 탐색기 UX 시안.

### Changed
- `setPreviewContent(html, sourcePath, autoSwitch)` — 사이드 클릭 시 탭 전환 없이 콘텐츠만 교체. 채팅 명령 시엔 자동 탭 전환.
- file-watcher: `docs/design/**/*.html` 변경 시 design files listing도 자동 reload.

## [0.2.0] — 2026-05-24

### Changed (Breaking)
- **CHECKPOINT를 phase 리스트에서 제외** — phase 7개 → 6개 (PRODUCT/DESIGN/ARCHITECTURE/IMPLEMENT/SHIP/POST-SHIP). ADR-009.
- 사이드바에 **별도 CHECKPOINTS KPI 카드** — runs / ships since / last check. `ships_since_checkpoint >= 5`면 빨간 카드로 점검 알림.
- 진행도 계산 = 6개 phase 기준 (이전 7개).

### Added
- ADR-009 (CHECKPOINT as KPI)
- `parser/state.ts`에 옛 7-phase state.md 호환 매핑 (Phase 5/6 → 4/5 자동 변환)

### Files updated
- `src/types.ts`, `src/parser/state.ts`, `src/sidebar/*`, `src/webview/panel.ts`
- `.blueprint/state.md`, `~/.claude/skills/blueprint/templates/state.md.tmpl`

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
