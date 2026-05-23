# Roadmap — 대시보드 확장 프로그램

> Phase별 sub-task 체크리스트. 가운데 webview의 **Plan 페이지**가 이 파일 풀-너비 렌더 + state.md 현재 phase와 연동해 현재 위치 강조.
>
> 체크박스는 .md 직접 수정으로만 변경 (단방향 .md → UI).

## Phase 0 — PRODUCT
- [x] One-liner
- [x] Target user (페르소나 1명)
- [x] Jobs-to-be-done (5개)
- [x] NON-GOALS (7개)
- [x] Success metric
- [x] Narrowest wedge (V0+)
- [x] APPROVED (2026-05-22)

## Phase 1 — DESIGN
- [x] Visual direction (Notion + Apple 글래스 풍)
- [x] Color / Typography / Spacing
- [x] V0+ webview visual spec
- [x] UI Composition Decisions (Sidebar 6섹션, Center 4페이지)
- [x] APPROVED (2026-05-22)

## Phase 2 — ARCHITECTURE
- [x] Stack: TypeScript + VS Code Extension API + markdown-it + esbuild
- [x] Domain map: parser / file-watcher / sidebar / webview / extension
- [x] Inter-domain rule: 이벤트 버스, 직접 import 금지
- [x] 단방향 .md → UI, AI 호출 없음
- [x] ADR-001~005 (TypeScript, AI 호출 X, 단방향, 이벤트 버스, generic mode V4)
- [x] Performance budget
- [x] APPROVED (2026-05-22)

## Phase 3 — IMPLEMENT
- [x] 단위 1: 빌드 셋업 (package.json, tsconfig, esbuild, .gitignore)
- [x] 단위 2: 코어 로직 (types, parser, watcher)
- [x] 단위 3: 사이드바 (TreeView → Webview 전환)
- [x] 단위 4: 웹뷰 V0 (panel, renderer, styles)
- [x] 단위 5: extension.ts orchestrator
- [x] 단위 6: 빌드 + .vsix 설치 검증
- [x] 단위 7: 사이드바 디자인 iteration (Notion + 글래스, 6섹션 재구조)
- [ ] **단위 8: 가운데 webview 4페이지 멀티탭** ← 현재
  - [x] 8a: roadmap.md + 블루프린트 스킬 템플릿 + DESIGN UI Composition
  - [ ] 8b: panel.ts 멀티탭 재작성 (탭 라우팅)
  - [ ] 8c: Plan 페이지 (roadmap.md + state.md 현재 위치)
  - [ ] 8d: Spec 페이지 (PRODUCT/DESIGN/ARCH 풀-너비 + 디자인 시각화)
  - [ ] 8e: Preview 페이지 (Claude push HTML)
  - [ ] 8f: Errors 페이지 (error.history.md 렌더 / 없으면 생성)
  - [ ] 8g: styles.css 4페이지 + 탭 시스템
  - [ ] 8h: extension.ts blueprint.preview 명령 추가
  - [ ] 8i: 빌드 + .vsix 재설치
- [ ] 단위 9: V0+ 최종 동작 검증 (4페이지 다 동작, 디자인 일관성)

## Phase 4 — CHECKPOINT
- [ ] /code-review 실행
- [ ] ADR 누적 검토 (필요 시 ADR-006 박음)
- [ ] checkpoint-2026-XX-XX.md 작성

## Phase 5 — SHIP
- [ ] /qa (V0+ 동작 검증)
- [ ] /review (diff)
- [ ] /ship — 최종 .vsix 패키지 (v0.1.0)
- [ ] CHANGELOG.md 작성

## Phase 6 — POST-SHIP
- [ ] /document-release (README, ARCHITECTURE.md 동기화)
- [ ] /retro (회고: V0+에서 배운 것, V1에서 잡을 마찰점)
- [ ] dogfooding 1주
- [ ] V1 계획 (디자인 시각화 자동 hex/폰트 추출, mermaid 다이어그램 등)
