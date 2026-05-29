# ADR-007: 사이드바 TreeView → Webview 전환

- Date: 2026-05-22
- Status: accepted

## Context
V0 사이드바는 VS Code native `TreeView`로 구현 (`vscode.window.registerTreeDataProvider`). 장점은 IDE 표준 룩 + 작은 의존성. 단점은 *디자인 자유도 0* — VS Code 토큰을 강제로 따라 색/폰트/간격 다 IDE 종속. 사용자가 "다크 IDE 대비 밝은 글래스 카드" 디자인 요구 → TreeView로 불가능.

## Decision
사이드바를 `WebviewViewProvider` (사이드바 안 webview view) 로 전환. HTML 직접 렌더로 자유 디자인. Notion + Apple 글래스 풍 + 컬러 blob 배경 + backdrop-filter blur 적용.

## Consequences
- Positive: 디자인 100% 자유. 컬러 swatch, progress 그라데이션, 글래스 카드 모두 가능.
- Positive: 사이드바와 가운데 webview가 *동일 디자인 시스템* 공유 → 일관성
- Negative: 약간의 런타임 비용 (HTML 파싱·렌더). 실측 < 50ms refresh. 사용자 체감 0.
- Negative: 사이드바 폭이 좁아 콘텐츠 밀도 한계 — 사용자가 폭 조정 가능하지만 default 좁음
- Neutral: 사용자 데이터 흐름은 동일 (state.md → parser → provider → view)

## Alternatives considered
- A: TreeView 유지 + ThemeIcon 색만 — 디자인 한계 명확. 사용자 거부.
- B: 사이드바 view 없이 가운데 webview만 — 사이드바의 "항상 보임" 가치 잃음. JBT #1 (세션 간 망각) 미해결.
- 채택: WebviewViewProvider — 자유도 + "항상 보임" 둘 다 챙김

## References
- `src/sidebar/sidebar-view-provider.ts` (WebviewViewProvider 구현)
- `src/sidebar/sidebar-styles.css` (Notion+iOS 글래스 풍)
- 삭제됨: `src/sidebar/tree-data-provider.ts` (V0 잔재)
