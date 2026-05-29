# ADR-009: CHECKPOINT를 phase 리스트에서 제외 → 사이드바 KPI 카드

- Date: 2026-05-24
- Status: accepted

## Context
V0+ schema에선 CHECKPOINT가 Phase 4로 박혀있었음. 그러나 다른 phase는 *순차 산출물 가진 단계*인 반면 CHECKPOINT는 *언제든 발동하는 cross-cutting trigger*. 결과:
- 진행도 계산이 모호 (CHECKPOINT가 "done"인 의미가 없음 — "1 run, 2 run..."이 의미)
- 사용자 시각에서 Phases 7-row 중 1개가 *다른 차원*이라 인지 부담
- "0 runs" 같은 부가 표시가 phase 라벨에 끼어들어 통일성 깨짐

## Decision
CHECKPOINT를 phase 리스트에서 **완전히 제외**. Phase 7개 → 6개 (PRODUCT/DESIGN/ARCHITECTURE/IMPLEMENT/SHIP/POST-SHIP).

CHECKPOINT 카운트는 사이드바의 **별도 KPI 카드**로 표시:
- `checkpoint_count` (총 횟수)
- `ships_since_checkpoint` (마지막 점검 후 ship 수 — 5 이상이면 카드 빨갛게)
- `last_check` (날짜)

state.md schema에서 `## Counters` 섹션은 그대로 유지 — KPI 카드가 그걸 읽음.

## Consequences
- Positive: 진행도 = 6개 phase 중 done 개수 (명확). 6/6 = 100%.
- Positive: CHECKPOINT가 *trigger 본연의 의미*로 복귀. ship 사이클 또는 정기 발동.
- Positive: 사이드바 정보 위계 명확 — Phases (순차), Checkpoint KPI (cross-cutting), Triggers (알람)
- Negative: Backward incompat — 옛 7-phase state.md는 parser가 호환 매핑 (Phase 5/6 → 4/5)
- Negative: 사용자가 옛 phase 번호 (4=CHECKPOINT) 기억하고 있으면 혼란. ADR로 명문화.

## Alternatives considered
- A: 7 phase 그대로 + 진행도 계산에서 CHECKPOINT 제외 — 사용자가 7-row 보는 인지부담 그대로
- B: CHECKPOINT를 사이드바 Triggers 카드에 통합 — Triggers와 의미 다름 (Triggers는 발동 *알람*, Checkpoint KPI는 *누적 상태*)
- 채택: 별도 KPI 카드 — 정보 위계 가장 깔끔

## References
- `src/types.ts` (PhaseId = 0|1|2|3|4|5, PHASE_NAMES 6개)
- `src/parser/state.ts` (CHECKPOINT 줄 skip + 옛 schema 호환 매핑)
- `src/sidebar/sidebar-view-provider.ts` (`renderCheckpointKpi`)
- `src/sidebar/sidebar-styles.css` (`.kpi-row`, `.kpi-block`)
- `.blueprint/state.md`, `plans/roadmap.md`, `~/.claude/skills/blueprint/templates/state.md.tmpl` (모두 갱신)
