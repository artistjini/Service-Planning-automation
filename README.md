# Blueprint Dashboard

`/blueprint` 메타스킬의 진행도·트리거·산출물을 Antigravity 사이드바·webview에 영구 시각화하는 extension.

## 사용

1. 워크스페이스에 `.blueprint/state.md` 가 있어야 함
2. Antigravity 활동바 좌측의 [체크리스트] 아이콘 클릭
3. 사이드바에서 Phase 항목 클릭 → 가운데 webview에 산출물 HTML 렌더

## 동작

- `.blueprint/state.md` 와 `docs/*.md` 변경 자동 감지 (debounce 200ms)
- 사이드바 TreeView: phase 진행도, next action, triggers, counters, decisions
- Webview: getdesign.md 스타일 (Notion + Apple 글래스 풍)

## V0+ 범위

state.md → 사이드바 + 가운데 webview. 디자인 시안 자동 시각화 / 코드 locator는 V1~V3.
