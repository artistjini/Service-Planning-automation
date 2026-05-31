# ADR-011: blueprint 문서 자동 업데이트 (단방향 원칙 선택적 확장)

- Date: 2026-06-01
- Status: proposed
- Supersedes: ADR-003 (부분 — 조건부 쓰기 허용으로 범위 확장)

## Context

### 현재 상황 (ADR-003 단방향 원칙)
ADR-003에서 "파일 → UI" 단방향만 허용. extension은 .md 파일을 *읽기만* 함.

이 원칙의 이유:
1. **버그 추적 단순화** — 진실 원본이 파일 1곳이라 화면 이상 시 파일만 보면 됨
2. **신뢰성** — 도구가 사용자 모르게 파일을 바꾸면 안 됨
3. **정체성** — 이 extension은 "보여주는 도구", 편집 도구 아님
4. **교체 용이성** — 단방향이면 parser 교체 시 다른 도메인 영향 없음

### 새로운 필요
개발이 진행되면서 blueprint 문서(`state.md`, `DIGEST.md`)를 **수동으로 업데이트하는 반복 작업**이 생김.

사용자 통증:
- Phase 완료할 때마다 `state.md`의 `[◐]` → `[x]` 수동 변경
- 세션 마무리마다 `DIGEST.md`에 수동 기록
- Next action 업데이트를 자주 잊어버림
- 이 반복 작업이 인지 부하를 오히려 증가시킴

→ JBT #6 (blueprint 문서 자동 업데이트) 도입 필요.

### 핵심 긴장
> "읽기 전용 도구"라는 정체성을 지키면서, 반복 작업을 줄이는 선택적 쓰기를 허용할 수 있는가?

---

## Decision

**조건부 쓰기(Controlled Write) 패턴 채택.**

단방향 원칙을 폐기하는 게 아니라, **명확히 정의된 조건과 범위 안에서만** 쓰기를 허용한다.

### 허용 범위 (Write 가능)

| 파일 | 허용 조건 | 쓰기 내용 |
|---|---|---|
| `.blueprint/state.md` | 사용자가 사이드바에서 Phase 체크박스 클릭 | `[ ]` / `[◐]` / `[x]` 상태 변경 |
| `.blueprint/state.md` | Next action 인라인 편집 후 저장 | Next action 텍스트 교체 |
| `DIGEST.md` | 세션 마무리 버튼 클릭 | 새 항목 맨 위에 prepend |

### 금지 범위 (Write 불가)

| 파일 | 이유 |
|---|---|
| `docs/PRODUCT.md` | 기획 문서 — 의도적 수정만 허용 |
| `docs/DESIGN.md` | 디자인 결정 — 의도적 수정만 허용 |
| `docs/ARCHITECTURE.md` | 구조 결정 — ADR 거쳐야 함 |
| `src/**` | 코드 수정 절대 금지 |
| `docs/adr/**` | ADR은 항상 수동 작성 |

### 구현 원칙

1. **사용자 확인 우선** — 자동 변경 전 사이드바에 미리보기 표시. 사용자가 "적용" 클릭해야 실제 파일에 씀.
2. **원자적 쓰기(Atomic Write)** — 임시 파일에 먼저 쓰고 성공 시 교체. 실패 시 원본 보존.
3. **변경 로그** — 모든 자동 쓰기는 Output 채널에 기록 (`[AUTO-WRITE] state.md: Phase 3 → done`).
4. **opt-in 설정** — `settings.json`에 `blueprint.autoWrite: false` 기본값. 사용자가 명시적으로 켜야 활성화.
5. **undo 가능** — VS Code `undo` (Ctrl+Z)로 되돌릴 수 있도록 `WorkspaceEdit` API 사용.

### 데이터 흐름 변경

```
기존 (ADR-003):
파일(.md) → file-watcher → parser → sidebar / webview

V5 추가 흐름:
사용자 액션 (사이드바 클릭 / 버튼)
    ↓ 확인 프롬프트
    ↓ 사용자 승인
extension → WorkspaceEdit → 파일(.md) 수정
    ↓ file-watcher (기존 흐름)
sidebar / webview 자동 업데이트
```

---

## Consequences

### Positive
- 반복적인 수동 업데이트 작업 제거 → 인지 부하 감소 (JBT #1, #2 강화)
- Phase 완료를 사이드바에서 바로 체크 → 워크플로 끊김 최소화
- DIGEST 자동 기록 → 세션 마무리 루틴 정착
- opt-in 방식이라 원하지 않는 사용자는 기존 단방향 유지 가능

### Negative
- 단방향 원칙 예외 추가 → 진실 원본이 "파일만" 이라는 보장 약화
- `WorkspaceEdit` + 확인 프롬프트 UI 구현 복잡도 증가
- 쓰기 실패 시 예외 처리 필요 (파일 잠금, 권한 오류 등)
- 자동 쓰기가 Claude 채팅과 충돌 가능 — 동시에 같은 파일 수정 시 race condition

### Mitigations
- race condition → debounce + 파일 저장 전 최신 내용 다시 읽기(read-before-write)
- 복잡도 → V5를 별도 도메인(`writer/`)으로 분리, 다른 도메인에 영향 없음
- 보장 약화 → opt-in 기본값 + 변경 로그로 투명성 확보

---

## Alternatives Considered

### A: 완전 양방향 — UI에서 자유롭게 파일 수정
- 모든 .md 파일을 webview에서 직접 편집
- 거부 이유: 정체성 완전 파괴. "편집기 안의 편집기" 가 됨. 유지보수 폭발.

### B: /blueprint 스킬 트리거 — extension이 직접 안 쓰고 Claude 호출
- extension → `/blueprint update` 슬래시 명령 자동 실행 → Claude가 파일 수정
- 거부 이유: ADR-002 (AI 호출 금지) 위반. 네트워크 의존성 생김.

### C: 클립보드 복사 — 자동 생성한 텍스트를 클립보드에 올려서 사용자가 붙여넣기
- extension은 쓰지 않고 사용자가 최종 붙여넣기
- 보류: 자동화 효과 반감. V5 이전 단계 임시 방편으로는 고려 가능.

### D (채택): 조건부 쓰기 + 사용자 확인 + opt-in
- 범위를 최소화하고, 투명성을 최대화하며, 사용자가 제어권 유지.

---

## Implementation Notes (V5 진입 시 참고)

### 새 도메인: `writer/`
```
src/
└── writer/
    ├── state-writer.ts     ← state.md Phase 상태 / Next action 쓰기
    ├── digest-writer.ts    ← DIGEST.md 새 항목 prepend
    └── write-guard.ts      ← opt-in 체크, read-before-write, 변경 로그
```

### 이벤트 흐름 추가
```typescript
// types.ts에 추가
type EventBus = {
  // 기존 이벤트 유지
  on(event: 'state-updated', ...): void;
  // 신규
  on(event: 'write-requested', handler: (req: WriteRequest) => void): void;
  on(event: 'write-confirmed', handler: (req: WriteRequest) => void): void;
};

interface WriteRequest {
  file: 'state' | 'digest';
  change: string;       // 변경 내용 미리보기 (사용자에게 표시)
  patch: () => void;    // 실제 파일 수정 함수
}
```

### 설정 추가
```json
// .vscode/settings.json
{
  "blueprint.autoWrite": false,        // opt-in (기본 꺼짐)
  "blueprint.autoWriteConfirm": true   // 쓰기 전 확인 프롬프트
}
```

---

## References
- ADR-002: AI 호출 금지 (이 ADR과 독립 — writer/는 AI 호출 0)
- ADR-003: 단방향 데이터 흐름 (이 ADR이 부분 확장)
- ADR-004: 이벤트 버스 (writer/ 도메인도 동일 버스 사용)
- `docs/PRODUCT.md` JBT #6, Versions V5
- VS Code API: `vscode.workspace.applyEdit`, `WorkspaceEdit`
