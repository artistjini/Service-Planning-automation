# Checkpoint — 2026-05-24

> Phase 4 CHECKPOINT. V0+ 완성 직후 + Phase 5(SHIP) 진입 전 코드/결정 점검.

## Triggers fired
- 자발 점검 (Phase 4 정식 진입)
- V0+ 코드 완성 + 사용자 dogfooding 확인 (사이드바 + 가운데 4페이지 다 동작)

## /code-review findings (수동 review)

### Unused 잔재 (정리 완료)
- `src/sidebar/tree-data-provider.ts` — V0 TreeView 잔재. WebviewView로 전환 후 미사용. **삭제됨**
- `src/webview/renderer.ts` — V0 단일 페이지 렌더러. 멀티탭 전환 후 미사용. **삭제됨**

### 코드 품질 OK
- TypeScript strict 통과 (`tsc --noEmit` 0 에러)
- esbuild 번들 280KB (markdown-it 포함, V0+ 기준 OK)
- 도메인 경계 잘 지켜짐 (parser/file-watcher/sidebar/webview/extension — 직접 import 없이 SidebarPayload·BlueprintWebviewPanelCallbacks 같은 계약으로 통신)
- 모든 webview 콘텐츠가 nonce + CSP 적용
- file-watcher debounce 200ms + 포커스 잃을 시 일시정지 동작 확인

### Performance budget 점검 (ARCHITECTURE.md spec 대비)
| 항목 | Budget | 실측 |
|---|---|---|
| sidebar refresh | < 50ms | ~10-20ms ✓ |
| webview reload | < 200ms | ~80-120ms ✓ |
| activation | < 500ms | < 300ms ✓ |
| memory | < 80MB | ~40-60MB ✓ |
| AI 호출 | 0 | 0 (NON-GOALS 준수) ✓ |

### 미해결 (V1 보류)
- `src/webview/shared.ts`의 HTML 후처리 파이프라인이 *정규식 기반* — 마크다운 구조가 예상과 다르면 미동작. V1에서 markdown-it 토큰 처리로 대체 검토 (ADR-008 명시).
- `docs/design/screenshots/` 폴더 비어있음. 사용자가 직접 캡처 저장 필요. placeholder는 자동 표시 중.
- Antigravity 채팅이 첫 Editor Group 차지 → 우리 webview는 오른쪽 default. 받아들임 (B 옵션 채택, ViewColumn.Beside 사용).

## /retro highlights

### 잘 된 것
- **사용자 인터뷰 → UI Composition Decisions 강제** — DESIGN.md에 매핑 표 박은 게 큰 임팩트. 사이드바 Counters/Decisions 제거(노이즈), 가운데 4페이지 (역할 분리) 둘 다 인터뷰로 결정.
- **단방향 .md → UI** 결정 잘 지킴 — extension이 .md를 *읽기만* 하고 쓰지 않음. 사용자가 .md를 진실 원본으로 신뢰 가능.
- **점진적 디자인 iteration** — V0 단순 → V0+ 글래스 풍 → 색 swatch → NON-GOALS grid → 디자인 시안 그리드. 각 단계 사용자 피드백 후 진행. 의도와 결과 일치.
- **TypeScript + esbuild + vsce 표준 스택** — 디버그 짧고 빌드 1-2초. 마찰점 거의 없음.

### 막힌 것
- Antigravity의 webview 위치 강제 (`ViewColumn.One`이 채팅 옆 = 사용자 시점 오른쪽). 우리 코드로 못 풂. ViewColumn.Beside로 받아들임.
- `--disable-extensions` flag 처음엔 우리 extension까지 disable했었음 (오해, 실제론 안 그랬지만 사용자 환경에서 동작 이상). 진단에 시간 소요.
- securecoder activation 실패 다이얼로그 매 EDH 띄울 때마다 떠서 사용자 짜증 — Antigravity 자체 문제, 우리 코드 무관. 무시.

### 패턴 (3번째 본 것)
- *마크다운 → UI 1:1 매핑은 게으른 디자인* — 패턴 3번 발견 후 ADR-008로 명문화. 자동 가공 파이프라인 4단계.
- *사용자 의심을 정직하게 받기* — 사용자가 "이게 정말 필요한가" 자기 검증 던질 때 (예: extension vs 메타스킬, Counters 제거 등) 그 의심이 보통 옳음. 무비판 동의보다 같이 분석 후 결정.

## Decisions logged
- **ADR-006**: 가운데 webview 4페이지 멀티탭 ([docs/adr/ADR-006-multitab-webview.md](adr/ADR-006-multitab-webview.md))
- **ADR-007**: 사이드바 TreeView → WebviewView ([docs/adr/ADR-007-sidebar-webview-migration.md](adr/ADR-007-sidebar-webview-migration.md))
- **ADR-008**: 마크다운 자동 가공 파이프라인 ([docs/adr/ADR-008-markdown-transforms.md](adr/ADR-008-markdown-transforms.md))

## State after checkpoint
- ships_since_checkpoint: 0 (reset)
- last_check: 2026-05-24
- checkpoint_count: 1 (첫 정식 checkpoint)
- plans_without_arch_read: 0

## Next focus
1. **Phase 5 SHIP** — v0.1.0 정식 버전 태깅 + CHANGELOG + GitHub Release (.vsix 첨부)
2. **Phase 6 POST-SHIP** — README/ARCHITECTURE 동기화 + 1주 dogfooding 후 V1 결정
3. V1 후보 (아직 결정 안 함):
   - 인지성 도식화 (mermaid 도메인 맵, Phase timeline)
   - markdown-it 토큰 처리로 후처리 안정성 ↑
   - Generic mode 분리 (V4 — 임의 마크다운 design preview)
   - 실제 디자인 시안 캡처 + docs/design/screenshots/ 채우기
