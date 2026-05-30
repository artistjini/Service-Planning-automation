# ADR-010: REVIEW를 phase로 박음 (IMPLEMENT와 SHIP 사이)

- Date: 2026-05-30
- Status: accepted

## Context
v0.4까지는 코드리뷰가 *사용자가 채팅에서 수동으로* `/code-review` 호출하는 흐름. 사용자 PRODUCT 의도 분석:
> "코드리뷰를 하나의 phase로 넣어서 빌드 과정에서 따로 부르지 않아도 자동으로 거치는 과정이 되게 해야하지 않나?"

즉 review가 *워크플로의 필수 단계*가 되어 SHIP 전에 *건너뛸 수 없는 게이트*가 되어야.

NON-GOALS 충돌 해결 — 책임 분리:
- AI 호출 자체는 `/blueprint` 스킬(Claude)이 담당 — Phase 4 진입 시 자동으로 `/code-review` 호출 + 결과 `docs/reviews/YYYY-MM-DD.md` 저장
- 우리 extension은 *AI 호출 0 유지*. `docs/reviews/` watch + 시각화만.

## Decision
Phase 7개 schema 채택 (v0.5+):

| # | Phase | 역할 |
|---|---|---|
| 0 | PRODUCT | NON-GOALS + JBT |
| 1 | DESIGN | UI Composition Decisions |
| 2 | ARCHITECTURE | 도메인 + ADR |
| 3 | IMPLEMENT | 코딩 |
| **4** | **REVIEW** | `/code-review` 결과 누적 |
| 5 | SHIP | 정식 출시 (REVIEW done이 hard gate) |
| 6 | POST-SHIP | dogfooding + 다음 cycle |

REVIEW 산출물: `docs/reviews/{YYYY-MM-DD}-{type}.md` (예: `2026-05-30-code-review.md`).

## Consequences
- Positive: review를 *빠뜨릴 수 없는 워크플로 단계*로 박음. 사용자 의도 직접 충족.
- Positive: review 결과 .md 누적 → 회고·트렌드 분석 가능 (V1+)
- Positive: SHIP 전 hard gate로 품질 안정성 ↑
- Negative: phase 6 → 7로 복귀. v0.1 schema와 *비슷하지만 다름* (CHECKPOINT 자리에 REVIEW)
- Negative: parser 호환 매핑 다시 복잡 — v0.1/v0.2-v0.4/v0.5 세 schema 동시 인식
- Neutral: /blueprint 스킬 갱신 필요 — Phase 4 진입 시 /code-review 자동 호출 룰 (별도 작업)

## Alternatives considered
- A: phase 6개 유지 + 사이드바 "Reviews" KPI 추가 (CHECKPOINT처럼) — review가 *cross-cutting*이라 가정. 하지만 사용자가 *필수 phase*로 명시.
- B: SHIP phase 안에 review 통합 — 진입 직전 자동 호출. 단점: review와 ship이 같은 phase라 진행도 모호.
- C (채택): REVIEW를 정식 phase로. 명확한 위계.

## References
- `src/types.ts` (PhaseId 0~6, REVIEW=4)
- `src/parser/state.ts` (v0.1/v0.2-v0.4/v0.5 호환 매핑)
- `.blueprint/state.md`, `plans/roadmap.md`
- 별도 작업: `~/.claude/skills/blueprint/SKILL.md` Phase 4 REVIEW 룰 + auto `/code-review` 호출
