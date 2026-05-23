# DESIGN — 대시보드 확장 프로그램

> 작성: 2026-05-22 / Phase 1 / Status: APPROVED
>
> 와이어프레임 ASCII는 제거함. *실제 동작하는 사이드바 + 가운데 webview*가 가장 정확한 디자인 미리보기.

## 디자인 철학
**Antigravity 다크 IDE 위에 떠있는 밝은 글래스 카드.** Notion + Apple 풍.
- VS Code 토큰 *사용 안 함* — 항상 같은 룩 (다크/라이트 테마 무관). 본인용 dogfooding 우선.
- 검은 IDE 배경 + 흰/옅은 그레이 webview/사이드바 = 강한 대비 + "이건 IDE랑 별개 콘텐츠" 시각 분리.
- 진짜 글래스 효과를 위해 페이지 배경에 컬러 blob (radial-gradient) 5개 + 카드에 `backdrop-filter: blur` + saturate.

## 5대 가시성 원칙
1. **한 번에 한 가지만 강조** — 현재 phase 이름이 압도적으로 큼 (28~56px)
2. **scannable** — 스크롤 없이 핵심 5초 안에 흡수
3. **여백 시원** — 카드 padding 14~32px (사이드바/webview), 카드 간 gap 14~24px
4. **데이터 = 시각, 장식 = 0** — 아이콘/이모지/장식 색 없음. 데이터에만 색 (state, trigger, hex swatch).
5. **폰트 두껍게** — 본문 500, 헤딩 700~800. 글래스 위에서 가독성.

## 색 (V0+ 확정)

| 용도 | 값 | 비고 |
|---|---|---|
| 페이지 배경 (그라데이션 시작) | `#f5f5f7` | Apple 옅은 그레이 |
| 페이지 배경 (그라데이션 끝) | `#ececef` | 살짝 더 어둡게 (위→아래) |
| 카드 배경 | `rgba(255, 255, 255, 0.55~0.7)` | 반투명 — backdrop-filter blur로 글래스 |
| 카드 보더 | `rgba(255, 255, 255, 0.5)` | 위쪽 inset highlight 효과 |
| 카드 그림자 (2~3단) | `0 1px 2px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07), 0 32px 60px rgba(0,0,0,0.05)` | near + mid + far |
| 텍스트 (메인) | `#1d1d1f` | Apple 다크 |
| 텍스트 (흐림, 라벨) | `#6e6e73` | Apple secondary |
| Accent (progress 시작, link, in_progress phase) | `#0066cc` | Apple blue |
| Trigger 빨강 | `#d70015` | Apple red |
| Done 초록 | `#34c759` | Apple green |
| Progress 그라데이션 | `#34c759 → #aacc00 → #ffcc00 → #ff9500 → #ff3b30` | 진행도 차오를수록 빨강 도달 |

페이지 배경에 컬러 blob 5개 (파랑/빨강/보라/초록/주황 radial-gradient, opacity 0.16~0.28) → backdrop-filter가 흐릿하게 만들어 글래스 효과.

## 입체감 룰
- **카드 radius**: 14~18px (Apple 풍)
- **카드 전환**: `transition: box-shadow 200ms ease, transform 200ms ease`
- **카드 hover**: `transform: translateY(-2px)` + 더 깊은 그림자
- **inset highlight (상단)**: `inset 0 1px 0 rgba(255,255,255,0.85)` — 위쪽 빛 받는 느낌
- **글래스 sheen (좌상단)**: 카드 `::before`에 `linear-gradient(135deg, rgba(255,255,255,0.4), transparent 50%)` 깔아 광택

## 타이포그래피

| 용도 | 크기 | weight | family |
|---|---|---|---|
| Page hero title (가운데 webview) | 52px | 800 | system |
| Sidebar hero phase title | 28px | 800 | system |
| Spec section h1 | 36px | 800 | system |
| Card heading (uppercase 라벨) | 11~13px | 700~800 | system, letter-spacing 0.12~0.16em |
| 본문 | 14~17px | 500 | system |
| Counter / progress 숫자 | monospace | 500~700 | `var(--vscode-editor-font-family)` |
| 폴더 경로, 파일 경로 | 11~12px | 600 | monospace |

`system` = `-apple-system, BlinkMacSystemFont, "Segoe UI", "Pretendard", system-ui, sans-serif`

## 레이아웃
- **사이드바**: padding 16px 12px, gap 14px (좁은 폭 대응)
- **가운데 webview**: max-width 1000px 중앙 정렬, padding 32px 48px
- **Spec section**: 카드 박스 없이 풀-너비 마크다운 + 섹션 간 회색 divider만
- **Tab nav**: 상단 sticky, 글래스 카드 (사용자가 스크롤해도 따라옴)

## UI Composition Decisions — 화면별 컴포넌트 → JBT 매핑

> 데이터 구조(state.md 섹션 등) → UI 1:1 매핑 금지. 모든 컴포넌트는 JBT 또는 명시적 통증과 매핑. 매핑 안 되는 컴포넌트는 제거.

### 화면 1: Sidebar (좁은 패널, 항상 보임)

| 컴포넌트 | 어느 JBT? | 결정 |
|---|---|---|
| Hero (폴더 경로 + 현재 phase + progress) | JBT #1 (세션 간 망각) | 필수 |
| Phases 7개 리스트 | JBT #1 (전체 흐름에서 위치) | 필수 |
| Current focus (state.md next action) | JBT #2 (세션 내 분산) | 필수 |
| Triggers | JBT #3 (트리거 알림) | 필수 |
| Active file (활성 에디터 경로) | (PRODUCT.md 통증 #2 "코딩 어디") | 필수 |
| Recent changes (최근 .md/code 변경) | (활동 가시화) | 보조 |
| ~~프로젝트명 큰 타이틀~~ | (폴더 경로와 중복) | **제거** |
| ~~Counters 4개~~ | (JBT 매핑 없음) | **제거 (노이즈)** |
| ~~Decisions log~~ | (Recent changes로 흡수) | **제거 (중복)** |

### 화면 2: Center Webview (큰 캔버스, 의도해서 봄)

탭 4개 (사용자 클릭으로 전환):

| # | 페이지 | 어느 JBT? | 데이터 소스 |
|---|---|---|---|
| 1 | **Plan** (첫 탭) | 큰 그림 + 현재 위치 | `plans/roadmap.md` + `.blueprint/state.md` |
| 2 | **Spec** | JBT #4 (산출물 시각화) | `docs/PRODUCT.md`, `DESIGN.md`, `ARCHITECTURE.md` |
| 3 | **Preview** | JBT #5 (디자인 시안) | Claude push (`blueprint.preview` 명령으로 임시 표시, 적립 X) |
| 4 | **Errors** | (인지과부하 ↓) | `docs/error.history.md` (없으면 생성 버튼) |

상호작용:
- 사이드바 Phase 클릭 → 자동으로 Spec 탭 + 해당 .md 섹션으로 이동
- 채팅 "프리뷰에 띄와봐 X.html" → Preview 탭 자동 이동 + 콘텐츠 교체
- Spec 페이지 스크롤 → 상단 anchor nav (PRODUCT/DESIGN/ARCH)가 현재 보이는 섹션 자동 active

### 자동 시각화 (V0+ 적용)
- **색 swatch**: `<code>#hex</code>` 또는 `<code>rgba(...)</code>` 패턴 감지 → 옆에 16px 색깔 박스 자동 삽입 (Spec 페이지 어디든)
- **체크박스**: `- [ ]` / `- [x]` → 시각적 둥근 박스 (Plan 페이지)

V1 이후: 폰트 family 자동 샘플 렌더, mermaid 다이어그램, `docs/design/*.html` 갤러리.

## 디자인 시안 (스크린샷)

> 캡처 방법: `Win+Shift+S` (Windows 캡처 도구) → 영역 선택 → 클립보드 → 캡처 도구에서 저장.
> 또는 OS 단축키로 직접 파일 저장.
>
> 저장 위치: `docs/design/screenshots/` 폴더. 파일명 아래와 일치시키면 자동 표시.
>
> 시안이 없으면 (파일 없을 때) 그냥 빈 자리. 캡처 후 추가하면 webview에 자동 렌더링.

### Sidebar (왼쪽 패널, 항상 보임)
![Sidebar — 항상 보이는 process state](design/screenshots/sidebar.png)

### Center webview — Plan 탭
![Plan 페이지 — roadmap + 현재 위치 마킹](design/screenshots/webview-plan.png)

### Center webview — Spec 탭 (PRODUCT)
![Spec/PRODUCT — 카드형 가공](design/screenshots/webview-spec-product.png)

### Center webview — Spec 탭 (DESIGN)
![Spec/DESIGN — 색 swatch 자동 시각화](design/screenshots/webview-spec-design.png)

### Center webview — Spec 탭 (ARCHITECTURE)
![Spec/ARCHITECTURE — 도메인 맵](design/screenshots/webview-spec-architecture.png)

### Center webview — Preview 탭
![Preview — Claude push한 디자인 HTML](design/screenshots/webview-preview.png)

### Center webview — Errors 탭
![Errors — error.history.md 렌더](design/screenshots/webview-errors.png)

## User flow (핵심)

```
세션 시작
  → Antigravity 열림
  → extension activate (workspaceContains:.blueprint/state.md)
  → 사이드바에 phase progress 자동 표시
  → 사용자 코드 편집
  → 필요할 때 사이드바 phase 클릭 → 가운데 webview 열림 (Spec 탭)
  → state.md / docs/*.md 변경 감지 → 사이드바·webview 자동 reload
  → trigger 발동 시 사이드바 trigger 카드 빨간 글래스 강조
```
