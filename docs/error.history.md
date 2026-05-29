# Error History — 대시보드 확장 프로그램

> 에러·트러블슈팅 일지. 발생한 시점·원인·해결을 시간순(역시간순)으로 기록.
> 같은 에러 재발 시 즉시 해결책 참조 가능.
>
> **기록 룰**: 새 에러는 *맨 위에* 추가. 해결 못 한 에러는 Status: OPEN.
> 형식 변경 시 아래 템플릿 같이 업데이트.

---

## 템플릿 (복사해서 사용)

```markdown
## YYYY-MM-DD HH:MM — {짧은 에러 제목}

- **Status**: RESOLVED | OPEN | IGNORED
- **Phase**: {발생한 Phase 또는 워크스테이지}
- **상황**: {언제·무엇 하다가 발생}
- **에러 메시지**:
  ```
  {원문 그대로}
  ```
- **원인**: {왜 발생했나}
- **해결**: {어떻게 풀었나 — 명령/파일/줄 단위로 구체적으로}
- **재발 방지**: {앞으로 피하려면}
- **참조**: {관련 PR, 커밋, 외부 링크}
```

---

## 2026-05-22 — Extension Development Host에서 우리 extension 활성화 안 됨

- **Status**: RESOLVED
- **Phase**: Phase 3 단위 6 (F5 테스트)
- **상황**: Antigravity에서 F5 눌러 EDH 띄움. 새 창이 환영 화면(Antigravity IDE 로고 + Open Folder 버튼)으로 떴고 우리 사이드바/extension 아이콘 활성화 안 됨.
- **에러 메시지**: 없음 (extension이 그냥 activate 안 됨)
- **원인**: `package.json` 의 `activationEvents: ["workspaceContains:.blueprint/state.md"]` 가 *워크스페이스 폴더가 열려 있을 때*만 트리거되는데, EDH가 폴더 없이 환영 화면 상태로 떠서 조건이 안 걸림.
- **해결**: `.vscode/launch.json` 의 `args` 마지막에 `"${workspaceFolder}"` 추가. EDH가 뜰 때 작업 폴더를 자동으로 워크스페이스로 열게 함.

  ```json
  "args": [
    "--extensionDevelopmentPath=${workspaceFolder}",
    "--disable-extensions",
    "${workspaceFolder}"
  ]
  ```
- **재발 방지**: VS Code extension 신규 프로젝트마다 launch.json에 워크스페이스 자동 오픈 박기. ARCHITECTURE.md V0 체크리스트에 launch.json 항목 명시함.
- **참조**: `.vscode/launch.json`

---

## 2026-05-22 — Google.securecoder activation 실패 (Antigravity 내장)

- **Status**: IGNORED (Antigravity 자체 문제, 우리 코드 무관)
- **Phase**: Phase 3 단위 6 (F5 테스트)
- **상황**: F5 눌러 EDH 띄울 때마다 우측 하단에 빨간 에러 다이얼로그 등장.
- **에러 메시지**:
  ```
  Activating extension 'Google.securecoder' failed: Cannot find module
  'c:\Users\snu90\AppData\Local\Programs\Antigravity IDE\resources\app\extensions\securecoder\out\extension.js'
  Require stack: -
  c:\Users\snu90\AppData\Local\Programs\Antigravity IDE\resources\app\out\vs\workbench\api\node\extensionHostProcess.js
  ```
- **원인**: Antigravity IDE의 내장 extension `Google.securecoder` 디렉터리에 `out/extension.js` 파일이 누락됨. Antigravity 설치 자체 문제. `--disable-extensions` 플래그를 launch.json에 박았지만 built-in extension은 해당 플래그로 안 꺼짐.
- **해결**: 우리가 고칠 수 없음. 매번 뜨는 다이얼로그를 X로 닫고 진행. 우리 extension 동작에는 *영향 없음*.
- **재발 방지**: Antigravity 재설치하면 깨끗해질 가능성 (확인 안 함). 지금은 그대로 두고 무시.
- **참조**: 없음

---

---

## 2026-05-22 — Antigravity 왼쪽 알림: Go 설치 요구 (다운로드 페이지 자동 오픈)

- **Status**: IGNORED (Antigravity 내장 기능 자체 요구, 우리 코드 무관)
- **Phase**: Phase 3 단위 8 (가운데 webview 작업 중)
- **상황**: 사용자가 작업 중 왼쪽 하단 알림 발생 → "다운로드" 클릭 → go.dev/dl 페이지 자동 오픈. 정확한 에러 메시지는 캡처 못 함.
- **에러 메시지**: (캡처 못 함 — go.dev/dl로 리다이렉트만 확인)
- **원인 추정**: Antigravity의 내장 Go 관련 기능 (Go language server, vscode-go extension, 또는 Antigravity built-in feature)이 Go 1.x 설치를 요구. 우리 extension은 TypeScript/Node.js 기반이라 Go 사용 0%.
- **해결**: 무시. Go 다운로드 *불필요*. 우리 사이드바/webview는 정상 동작.
- **재발 방지**: 에러 다시 뜨면 → 알림 내용 스크린샷 캡처 후 무시. 정말 거슬리면 Antigravity 설정에서 Go 관련 extension/feature 비활성화.
- **참조**: 없음

---

## 2026-05-24 — Go 바이너리 못 찾음 알림 재발 ("Failed to find go binary")

- **Status**: IGNORED (Antigravity 자체 문제 — 무관)
- **Phase**: V0.2 SHIP 후 dogfooding 중
- **상황**: 작업 중 화면에 빨간 알림 박스 — "Failed to find the 'go' binary in either GOROOT() or PATH". PATH 전체 보여줌. 우리 코드 전혀 무관.
- **에러 메시지**:
  ```
  Failed to find the "go" binary in either GOROOT() or PATH(...)
  Check PATH, or Install Go and reload the window.
  ```
- **원인**: 같은 (이전 Go 알림과 동일). Antigravity의 내장 Go 관련 기능 (vscode-go extension 등)이 Go 1.x 설치 요구. 우리 extension은 TypeScript 기반이라 Go 사용 0%.
- **해결**: 무시. X로 닫음. Go 설치 *불필요*.
- **재발 방지**: 영구. Antigravity 자체 설정에서 Go-related extension 끄는 옵션 있는지 검토 — 우선순위 낮음.
- **참조**: 위의 동일 에러 (2026-05-22) 참조

(과거 에러는 아래에 시간순으로 누적)
