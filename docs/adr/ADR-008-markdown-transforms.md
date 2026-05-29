# ADR-008: 마크다운 자동 가공 (Anti-게으른 디자인)

- Date: 2026-05-24
- Status: accepted

## Context
사용자 통증: "마크다운 그대로 렌더된 .md 글 모음이 한눈에 안 들어옴, 대시보드 가공 필요". V0 webview는 markdown-it 기본 렌더만 → PRODUCT/DESIGN/ARCH 보기 답답.

특정 섹션은 *의미가 명확*하므로 자동 가공 가치:
- 색 hex 코드 → 시각적 swatch
- NON-GOALS 리스트 → 빨간 ✗ grid (사용자가 PRODUCT.md 최대 통증으로 박은 부분)
- ## 헤딩 → 작은 eyebrow + 카드 (대시보드 패턴)
- 디자인 시안 이미지 → Airbnb 풍 카드 그리드 + placeholder

## Decision
`src/webview/shared.ts`의 `renderMarkdown`에 4단계 후처리 파이프라인:

```
md.render(markdown)
  → injectColorSwatches    (hex/rgba → swatch)
  → transformNonGoals      (NON-GOALS ul → 빨간 ✗ grid)
  → transformDesignGallery (## 디자인 시안 → 카드 그리드 + placeholder)
  → transformHeadingsToCards (## 헤딩 → 글래스 카드 + eyebrow)
```

각 변환은 *패턴 기반 안전 후처리* — markdown-it 토큰 stream 안 건드림, HTML 정규식만. 매칭 실패 시 원본 그대로.

## Consequences
- Positive: 마크다운은 *원본 그대로 .md*로 유지. 작가가 표준 마크다운만 알면 됨. 가공은 webview 측에서.
- Positive: 사용자가 .md 어디에 쓰든 일관 가공. PRODUCT.md / DESIGN.md / ARCHITECTURE.md / roadmap.md / error.history.md 모두 적용.
- Positive: JBT #4 (산출물 시각화) + JBT #5 (디자인 시안 가시화) 부분 충족.
- Negative: 정규식 후처리는 *fragile* — 마크다운 구조가 예상과 다르면 미동작 (예: ## 헤딩 안에 inline HTML). V1에서 markdown-it 토큰 처리로 대체 검토.
- Negative: 사용자가 *원하는 가공*과 *우리 자동 가공*이 충돌할 수 있음 (예: 사용자가 ## 헤딩 그대로 보고 싶을 때)

## Alternatives considered
- A: markdown-it 플러그인 — 정식이지만 커스텀 토큰 처리 학습 비용. V1에서 검토.
- B: 사용자가 HTML 직접 박음 (markdown-it html: true) — XSS 위험 + 일관성 잃음
- C: 가공 없이 raw 마크다운 — 사용자 통증 미해결
- 채택: HTML 후처리 파이프라인 — V0+ 수준 적합, V1에서 토큰 처리로 진화 가능

## References
- `src/webview/shared.ts` (renderMarkdown + 4 transform 함수)
- `src/webview/styles.css` (`.ds-card`, `.non-goal-grid`, `.design-gallery`, `.color-token`)
