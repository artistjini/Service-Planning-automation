# Blueprint State — 대시보드 확장 프로그램

## Progress
- [x] Phase 0: PRODUCT (2026-05-22)
- [x] Phase 1: DESIGN (2026-05-22)
- [x] Phase 2: ARCHITECTURE (2026-05-22)
- [ ] Phase 3: IMPLEMENT ← 진입 가능
- [ ] Phase 4: CHECKPOINT (0 runs)
- [ ] Phase 5: SHIP (0 ships)
- [ ] Phase 6: POST-SHIP

## Next action
Phase 3 V0 코딩 시작. ARCHITECTURE.md의 V0 체크리스트 따라 package.json → extension.ts → watcher → parser → tree-data-provider.

## Decisions log
- 2026-05-22: 산출물 = Antigravity extension, 시각화·알림 레이어 (단방향 .md → UI, AI 호출 X)
- 2026-05-22: V0 = state.md → 사이드바 TreeView만 (1-2일). V1부터 webview 추가.
- 2026-05-22: 모드 = 신규(init) + 수정(retrofit) 2가지. retrofit은 V4 이후.
- 2026-05-22: ADR-001~005 박음 (TypeScript, AI 호출 X, 단방향, 이벤트 버스, generic mode V4 분리)

## Counters
- ships_since_checkpoint: 0
- last_check: 2026-05-21
- checkpoint_count: 0
- plans_without_arch_read: 0

## Triggers fired
(empty)

## Settings
- strict_mode: false
- quiet_until: (empty)

