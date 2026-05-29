# ADR-006: 가운데 Webview 4페이지 멀티탭 구조

- Date: 2026-05-22
- Status: accepted

## Context
V0 webview는 단일 페이지로 state hero + counters + triggers + decisions + 산출물 .md 렌더를 한 곳에 담았음. 사용자 인터뷰 후 *역할별로 분리된 페이지*가 인지부하 더 줄여준다고 판단:
- Plan = 큰 그림 + 위치
- Spec = 산출물 풀-너비
- Preview = Claude push한 디자인 시안
- Errors = 에러 일지

## Decision
가운데 webview를 **4페이지 멀티탭**으로 재구조. 상단 탭 nav 클릭으로 전환. panel.ts가 라우팅 + 각 페이지 데이터 캐싱. 페이지별 renderer는 `src/webview/pages/*.ts`로 분리.

## Consequences
- Positive: 페이지별 디자인 자유. PRODUCT/DESIGN/ARCH 산출물에 각각 다른 가공 적용 가능. 사용자가 "지금 무엇을 볼지" 의도해서 선택 → 인지부하 ↓
- Positive: Errors 탭이 별도 → 에러 회고가 쉬워짐
- Negative: 단일 페이지 대비 코드 분기 늘어남 (페이지 5개 renderer)
- Neutral: 사이드바와 정확한 역할 분리 (사이드바 = state 압축, 가운데 = 콘텐츠)

## Alternatives considered
- A: 단일 페이지 + 섹션 anchor — 스크롤 길어 답답
- B: 별도 webview 4개 — 탭 전환 비용 (lazy load 등) 복잡, 사용자가 어디 있는지 잃기 쉬움
- 채택: 단일 webview + 메모리 캐시 + 탭 라우팅. 가장 단순 + 사용자 시점 일관성

## References
- `src/webview/panel.ts` (orchestrator)
- `src/webview/pages/{plan,spec,preview,errors}.ts`
- DESIGN.md `## UI Composition Decisions` 화면 2
