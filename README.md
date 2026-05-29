# Blueprint Dashboard

> Antigravity 확장 프로그램. `/blueprint` 메타스킬의 진행도·트리거·산출물을 사이드바·webview에 영구 시각화. AI 코딩 워크플로의 인지 과부하를 줄임.

**Current version**: v0.1.0 (2026-05-24)

## 무엇을 하나
- **왼쪽 사이드바**: 현재 phase, progress bar, next action, triggers, active file, recent changes 항상 표시
- **가운데 webview** (4페이지 멀티탭):
  - **Plan** — `plans/roadmap.md` 풀-너비 + 현재 위치 마킹
  - **Spec** — PRODUCT/DESIGN/ARCHITECTURE 산출물 (탭 전환)
  - **Preview** — Claude가 push한 디자인 HTML 임시 표시
  - **Errors** — `docs/error.history.md`

## 자동 가공
- `<code>#ff385c</code>` 같은 hex 패턴 → 옆에 색깔 swatch 자동 삽입
- `## NON-GOALS` 다음 ul → 빨간 ✗ grid (Anti-게으른 디자인)
- `## 헤딩` → 글래스 카드 + 작은 eyebrow 라벨
- `## 디자인 시안` 다음 h3+img → Airbnb 풍 카드 그리드 (이미지 없으면 placeholder)

## 설치
1. https://github.com/snu9026-Chris/SERVICE-PLANNING/raw/main/blueprint-dashboard-0.1.0.vsix 다운로드
2. Antigravity → `Ctrl+Shift+P` → "VSIX에서 설치" → 다운받은 파일

## 사용
1. 워크스페이스에 `.blueprint/state.md` 가 있어야 활성화 (없으면 `/blueprint` 스킬로 init)
2. Activity bar의 [체크리스트] 아이콘 클릭 → 사이드바 펼침
3. 사이드바 Phase 항목 클릭 → 가운데 webview 열림
4. webview 상단 탭으로 Plan / Spec / Preview / Errors 전환

## 데이터 흐름
**단방향**: `.md → UI`. extension은 .md를 *읽기만*. AI 호출 0.
- `.blueprint/state.md`, `docs/*.md`, `plans/*.md` 변경 → 자동 reload (debounce 200ms)
- 사용자가 .md를 진실 원본으로 신뢰 가능

## 개발 (다른 컴퓨터에서 이어 작업)
```bash
git clone https://github.com/snu9026-Chris/SERVICE-PLANNING.git
cd SERVICE-PLANNING
npm install
npm run build
npx vsce package --skip-license --no-dependencies
# 생성된 .vsix를 Antigravity에 설치
```

## 디렉터리
```
.blueprint/state.md    ← 현재 phase / counters / triggers
docs/
  PRODUCT.md           ← 무엇/왜 (one-liner, JBT, NON-GOALS)
  DESIGN.md            ← 색/폰트/UI Composition Decisions
  ARCHITECTURE.md      ← 스택/도메인/ADR
  adr/ADR-*.md         ← 결정 기록
  error.history.md     ← 에러 일지
plans/
  roadmap.md           ← phase별 sub-task 체크리스트
src/
  parser/              ← state.md 파싱
  file-watcher/        ← .md/소스 watch + debounce
  sidebar/             ← Webview view (좁은 사이드바)
  webview/             ← 가운데 4페이지 멀티탭
  extension.ts         ← orchestrator
```

## 다음 (V1)
- 인지성 도식화 (mermaid 도메인 맵, Phase timeline)
- markdown-it 토큰 처리로 가공 안정성 ↑
- Generic mode (임의 마크다운 design preview 분리 배포 검토)
- 실제 디자인 시안 갤러리 (`docs/design/screenshots/` 채움)

## License
Private (V0+ dogfooding 단계). V1 정식 배포 시 결정.
