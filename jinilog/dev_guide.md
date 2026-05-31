# 개발자 가이드 (Dev Guide)
# Blueprint Dashboard 확장 프로그램 — 초등학생도 이해하는 개발 교과서

> 이 가이드는 "코딩이 처음인 친구"도 읽을 수 있게 쉽게 썼어요.
> 어려운 말이 나오면 바로 옆에 쉬운 설명을 달았습니다. 🎓

---

## 목차
1. [프로젝트 목적](#1-프로젝트-목적)
2. [활용 방법](#2-활용-방법)
3. [코딩 기초 개념 설명](#3-코딩-기초-개념-설명)
4. [기능 개발 순서와 SOP](#4-기능-개발-순서와-sop)
5. [사용된 원본 소스와 출처](#5-사용된-원본-소스와-출처)
6. [전체 알고리즘 로직 (파이 구조)](#6-전체-알고리즘-로직-파이-구조)
7. [개발 히스토리 (시간순)](#7-개발-히스토리-시간순)
8. [에러와 해결 방법](#8-에러와-해결-방법)
9. [Key Takeaway · 주의사항 · 개발 팁](#9-key-takeaway--주의사항--개발-팁)

---

## 1. 프로젝트 목적

### 1-1. 한 줄 설명
**"AI와 함께 코딩할 때, '지금 어디까지 왔지?' 를 항상 눈에 보이게 해 주는 프로그램"**

### 1-2. 왜 만들었나요?

AI 도움(Claude 같은 AI)을 받아 프로그램을 만들 때, 가장 힘든 일이 있어요.
- 어제 어디까지 했는지 잊어버려요.
- 지금 내가 어떤 단계에 있는지 헷갈려요.
- 중요한 메모를 찾으려면 여러 파일을 열어야 해요.

이걸 해결하려고 만든 게 **Blueprint Dashboard** 예요!
마치 게임에서 **미니맵**처럼, 코딩 화면 옆에 작게 "진행 상황 지도"가 항상 떠 있는 거예요.

### 1-3. 무엇이 보이나요?

| 보이는 것 | 설명 |
|---|---|
| BLUEPRINT 섹션 | 지금 어떤 단계(Phase)인지, 몇 % 완료했는지 |
| PHASES 리스트 | 0번~6번 단계가 완료/진행중/대기 중 어떤 상태인지 |
| CURRENT FOCUS | 다음에 할 일이 뭔지 한 눈에 |
| Plan 탭 | 전체 로드맵 문서 |
| Spec 탭 | 제품 기획, 디자인, 아키텍처 문서 |
| Preview 탭 | 디자인 시안 HTML 미리보기 |
| Errors 탭 | 에러 기록 노트 |

> **📌 요약:** 이 프로그램은 "AI 코딩 도우미와 함께 일할 때, 진행 상황을 눈으로 볼 수 있게 해 주는 도구"예요. 게임의 미니맵처럼 옆에서 항상 현재 위치를 알려줍니다.

---

## 2. 활용 방법

### 2-1. 이 프로그램이 하는 일

```
📁 .blueprint/state.md (텍스트 파일)
         ↓ 읽기
🖥️ Antigravity IDE 사이드바
         ↓ 클릭
📊 가운데 화면에 자세한 내용
```

쉽게 말하면:
1. 여러분이 **`.blueprint/state.md`** 라는 메모 파일에 진행 상황을 씁니다.
2. 이 프로그램이 그 파일을 **자동으로 읽어서** 예쁘게 화면에 보여줍니다.
3. 파일이 바뀌면 **즉시 화면도 바뀝니다** (새로고침 안 해도 돼요!).

### 2-2. 어떤 상황에서 쓰나요?

- **혼자 앱/웹사이트/프로그램** 만들 때
- **AI(Claude)** 와 함께 코딩할 때
- **여러 날에 걸쳐** 프로젝트를 진행할 때
- 매일 작업 시작 전 **"어디까지 했지?"** 를 빠르게 확인하고 싶을 때

### 2-3. 안 하는 일 (NON-GOALS)

이 프로그램이 **절대 하지 않는** 것도 중요해요!

| 안 하는 것 | 이유 |
|---|---|
| AI에게 직접 물어보기 | 사용자가 직접 Claude와 채팅하는 것 |
| 파일 내용 수정 | 읽기만 함. 수정은 항상 사용자가 직접 |
| 팀 협업 기능 | 혼자 쓰는 개인 도구 |
| 마켓플레이스 배포 | Git으로 직접 설치 (내가 직접 쓰는 용도) |

> **📌 요약:** 이 프로그램은 "메모 파일을 읽어서 예쁘게 보여주는 도구"예요. AI가 아니라 사람이 메모를 쓰면, 프로그램이 자동으로 보여주는 단순하고 명확한 역할을 합니다.

---

## 3. 코딩 기초 개념 설명

이 프로젝트에서 쓴 코딩 개념들을 하나씩 설명할게요!

### 3-1. TypeScript — 더 안전한 JavaScript

**JavaScript**는 웹페이지를 움직이게 하는 언어예요.
**TypeScript**는 JavaScript에 "타입(type)"을 더한 버전이에요.

```typescript
// JavaScript — 타입이 없어서 실수하기 쉬움
let age = "열살";  // 숫자여야 하는데 글자를 넣어도 오류 없음!

// TypeScript — 타입을 미리 정해서 실수를 막아줌
let age: number = 10;  // 숫자(number)로 정했으니 글자 넣으면 오류!
age = "열살";  // ❌ 오류! TypeScript가 잡아줌
```

우리 프로젝트에서는 이런 타입들을 썼어요:

| 타입 이름 | 의미 | 예시 |
|---|---|---|
| `string` | 글자(문자열) | `"안녕"`, `"hello"` |
| `number` | 숫자 | `0`, `42`, `3.14` |
| `boolean` | 참/거짓 | `true`, `false` |
| `interface` | 객체의 설계도 | `{ name: string, age: number }` |

### 3-2. VS Code Extension — IDE에 기능 추가하기

VS Code(코딩 편집기)에 새 기능을 추가하는 방법이에요.
마치 스마트폰에 앱을 설치하는 것처럼, VS Code에 우리 프로그램을 "앱"처럼 설치해요.

- **활성화(activate)**: VS Code를 열면 우리 프로그램이 시작돼요
- **비활성화(deactivate)**: VS Code를 닫으면 프로그램도 종료돼요
- **.vsix 파일**: VS Code 앱을 설치하는 파일 (스마트폰 `.apk` 같은 것)

### 3-3. 파일 감시자(File Watcher) — 파일이 바뀌면 알려주는 경보기

```
📁 파일이 변경됨!
    ↓
🔔 "야, 파일 바뀌었어!" (이벤트 발생)
    ↓
🖥️ 화면 자동 업데이트
```

실제 코드로 보면:

```typescript
// 파일 감시 시작
watcher.onDidChange(uri => {
  // 파일이 바뀌면 이 코드가 실행돼요
  handleFileChange(uri);
});
```

**디바운스(Debounce)** 라는 개념도 써요.
파일을 저장할 때 컴퓨터가 "변경!" 신호를 수백 번 보낼 수 있어요.
디바운스는 200ms(0.2초) 동안 기다렸다가 마지막 신호만 처리해요.
마치 여러 번 눌러도 한 번만 벨소리가 나는 초인종처럼요!

```typescript
const DEBOUNCE_MS = 200;  // 0.2초 기다리기

// 연속으로 신호가 와도 마지막 것만 처리
const timer = setTimeout(() => {
  handleFileChange();  // 0.2초 후에만 실행
}, DEBOUNCE_MS);
```

### 3-4. 파서(Parser) — 글을 이해하는 번역가

**파서**는 사람이 쓴 텍스트를 프로그램이 이해할 수 있는 데이터로 변환해요.

예를 들어, `state.md` 파일에 이런 글이 있어요:
```
- [x] Phase 0: PRODUCT (2026-05-22)
- [ ] Phase 1: DESIGN
```

파서가 이걸 읽어서:
```typescript
{
  id: 0,
  name: "PRODUCT",
  status: "done",        // [x] → done
  completedAt: "2026-05-22"
}
```
이렇게 프로그램이 이해하는 데이터로 바꿔줘요.

**정규표현식(Regex)** 도 썼어요. 정규표현식은 글에서 원하는 패턴을 찾는 도구예요.
마치 "국어 시간에 밑줄 그은 것처럼" 텍스트에서 필요한 부분만 쏙 뽑아내요.

```typescript
// 이 패턴은 "- [x] Phase 0: PRODUCT (날짜)" 같은 줄을 찾아요
const re = /^-\s*\[([ x◐])\]\s*Phase\s+(\d+):\s*([A-Z\-]+)(?:\s*\((.*?)\))?/;
```

### 3-5. Webview — 앱 안의 웹페이지

VS Code 안에 **웹페이지(HTML/CSS)** 를 띄울 수 있어요.
우리 사이드바와 가운데 화면이 바로 이 방식이에요.

```
VS Code 앱
├── 사이드바 (Webview) = 미니 웹페이지
└── 가운데 화면 (Webview Panel) = 미니 웹페이지
```

**CSP(Content Security Policy)** 도 중요해요.
보안을 위해 Webview 안에서 실행할 수 있는 코드를 제한해요.
마치 "우리 집에서는 이것만 할 수 있어"라는 규칙을 정해두는 거예요.

### 3-6. 이벤트 버스 — 부서 간 메시지 시스템

프로그램 안에 여러 "부서"가 있어요:
- **parser** (파일 읽는 부서)
- **file-watcher** (파일 감시 부서)
- **sidebar** (사이드바 부서)
- **webview** (화면 부서)
- **extension** (총괄 부서)

이 부서들이 서로 직접 이야기하면 복잡해져요.
그래서 **이벤트 버스**라는 공통 채널을 만들어요.

```
파일 변경 → "file-changed" 이벤트 발생
              ↓ (이벤트 버스)
파서가 듣고 → "state-updated" 이벤트 발생
              ↓ (이벤트 버스)
사이드바 → 화면 업데이트
```

마치 학교 방송처럼: "전교생 여러분, 청소 시간입니다!" 한 번 방송하면
모든 반이 동시에 듣는 것처럼요.

### 3-7. 단방향 데이터 흐름

이 프로그램의 가장 중요한 규칙이에요:

```
파일(.md) → 파서 → UI 화면
```

**절대 반대 방향(UI → 파일)은 안 돼요!**
화면에서 직접 파일을 수정하지 않아요.
이렇게 하면 프로그램이 예측 가능하고 버그가 줄어요.

> **📌 요약:** 이 프로젝트에서 TypeScript(타입 안전), 파일 감시(File Watcher), 파서(텍스트 → 데이터 변환), Webview(앱 안의 웹페이지), 이벤트 버스(부서 간 통신), 단방향 데이터 흐름이라는 6가지 핵심 개념을 배울 수 있어요.

---

## 4. 기능 개발 순서와 SOP

### 4-1. 개발 단계 개요 (7단계)

| Phase | 이름 | 하는 일 |
|---|---|---|
| 0 | PRODUCT | 무엇을 만들지 계획 |
| 1 | DESIGN | 어떻게 생겼으면 좋겠는지 설계 |
| 2 | ARCHITECTURE | 코드 구조 설계 |
| 3 | IMPLEMENT | 실제 코드 작성 |
| 4 | REVIEW | 코드 검토 및 품질 점검 |
| 5 | SHIP | 패키징 및 배포 |
| 6 | POST-SHIP | 배포 후 개선 |

### 4-2. 각 단계별 SOP (Standard Operating Procedure)

#### Phase 0: PRODUCT — "무엇을 만들까?"

**표준 절차:**
1. `docs/PRODUCT.md` 파일 작성
2. 아래 항목을 모두 채우기:
   - **One-liner**: 한 문장으로 설명
   - **Target user**: 누가 쓸 건지
   - **Jobs-to-be-done**: 어떤 문제를 해결하는지
   - **NON-GOALS**: 절대 하지 않을 것
   - **Success metric**: 어떻게 성공을 측정할지
3. Claude(AI)와 함께 리뷰 후 승인

**실제 이 프로젝트 예시:**
```markdown
One-liner: state.md와 phase별 산출물을 사이드바에 영구 렌더링하여
           AI 코딩 워크플로의 인지 과부하를 줄이는 extension.

Target user: /blueprint 메타스킬을 쓰는 솔로 빌더

NON-GOALS:
- AI 호출 안 함
- 팀 협업 기능 없음
```

#### Phase 1: DESIGN — "어떻게 생겼으면 좋을까?"

**표준 절차:**
1. `docs/DESIGN.md` 파일 작성
2. 디자인 철학 정하기 (이 프로젝트: iOS Settings 스타일)
3. 색상 팔레트 정하기
4. 폰트 정하기
5. 레이아웃 구조 결정

**이 프로젝트에서 정한 것들:**
```
배경색: #f2f2f7 (iOS 회색)
강조색: #007aff (iOS 파란색)
완료색: #34c759 (iOS 초록색)
경고색: #ff3b30 (iOS 빨간색)
폰트: Pretendard (한국어 잘 보이는 폰트)
```

#### Phase 2: ARCHITECTURE — "코드를 어떻게 구조화할까?"

**표준 절차:**
1. `docs/ARCHITECTURE.md` 작성
2. 도메인(영역) 나누기 → 5개 도메인
3. 각 도메인의 역할 정하기
4. 도메인 간 통신 규칙 정하기 (이벤트 버스)
5. 폴더 구조 결정
6. 데이터 계약(타입) 설계

**5개 도메인:**
```
1. parser       → 파일 읽고 데이터로 변환
2. file-watcher → 파일 변경 감지
3. sidebar      → 사이드바 UI
4. webview      → 가운데 화면 UI
5. extension    → 전체 조율 (오케스트라 지휘자)
```

#### Phase 3: IMPLEMENT — "실제 코딩!"

**개발 순서:**
```
1단계: types.ts        → 공통 타입 정의 (설계도)
2단계: file-watcher    → 파일 감시 기능
3단계: parser/state.ts → state.md 파싱
4단계: sidebar         → 사이드바 UI
5단계: webview/panel   → 가운데 화면 UI
6단계: extension.ts    → 전체 연결
```

**왜 이 순서인가요?**
- 먼저 **타입(설계도)**를 만들어야 다른 코드들이 설계도에 맞게 만들어져요.
- **파일 감시**가 있어야 **파서**가 언제 읽을지 알아요.
- **파서**가 있어야 **사이드바**가 무엇을 보여줄지 알아요.
- 마지막으로 **extension**이 모든 걸 연결해요.

#### Phase 4: REVIEW — "잘 만들었나 확인!"

**점검 항목:**
- [ ] 파일이 바뀌면 화면이 업데이트 되는가?
- [ ] NON-GOALS에 있는 기능을 만들었나? (있으면 삭제!)
- [ ] 각 도메인이 서로 직접 import 하지 않는가?
- [ ] 성능은 괜찮은가? (파일 변경 → 화면 업데이트 50ms 이내)

#### Phase 5: SHIP — "배포!"

```bash
# 빌드
npm run build

# .vsix 파일 만들기 (설치 파일)
npm run package

# 결과: blueprint-dashboard-x.x.x.vsix 파일 생성
# 이 파일을 IDE에 드래그해서 설치!
```

> **📌 요약:** 개발은 항상 PRODUCT(계획) → DESIGN(디자인) → ARCHITECTURE(구조) → IMPLEMENT(코딩) → REVIEW(검토) → SHIP(배포) → POST-SHIP(개선) 순서로 해요. 코드보다 계획이 먼저예요!

---

## 5. 사용된 원본 소스와 출처

### 5-1. 라이브러리 (남이 만든 코드 도구)

| 라이브러리 | 역할 | 출처 |
|---|---|---|
| `markdown-it` | 마크다운 텍스트를 HTML로 변환 | https://github.com/markdown-it/markdown-it |
| `esbuild` | TypeScript/JS 파일을 하나로 합치고 압축 | https://esbuild.github.io |
| `@vscode/vsce` | .vsix 설치 파일 만들기 | https://github.com/microsoft/vscode-vsce |
| `typescript` | JavaScript + 타입 안전성 | https://www.typescriptlang.org |

### 5-2. 플랫폼 (사용한 기반 기술)

| 플랫폼 | 역할 | 출처 |
|---|---|---|
| VS Code Extension API | IDE 기능 확장 | https://code.visualstudio.com/api |
| Node.js `fs` 모듈 | 파일 읽기/쓰기 | Node.js 내장 (별도 설치 불필요) |
| Node.js `path` 모듈 | 파일 경로 처리 | Node.js 내장 |
| Node.js `EventEmitter` | 이벤트 시스템 | Node.js 내장 |

### 5-3. 디자인 영감

| 디자인 | 출처 |
|---|---|
| iOS Settings UI 스타일 | Apple Human Interface Guidelines |
| Pretendard 폰트 | https://github.com/orioncactus/pretendard |
| 색상 팔레트 (#007aff 등) | Apple iOS 시스템 컬러 |

### 5-4. 개발 방법론

| 방법론 | 출처 |
|---|---|
| DDD (Domain-Driven Design) | Eric Evans의 책 "Domain-Driven Design" |
| /blueprint 메타스킬 | Antigravity + Claude 워크플로 |
| ADR (Architecture Decision Record) | https://adr.github.io |

> **📌 요약:** 혼자 모든 것을 만들 필요가 없어요! markdown-it, esbuild 같은 좋은 도구들을 가져다 쓰면 빠르게 만들 수 있어요. 단, 항상 출처를 기록해두세요.

---

## 6. 전체 알고리즘 로직 (파이 구조)

### 6-1. 전체 흐름도

```
┌─────────────────────────────────────────────────────────┐
│                   사용자 (개발자)                         │
│            .blueprint/state.md 파일 수정                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              file-watcher (파일 감시자)                  │
│  1. 파일 변경 감지                                       │
│  2. 200ms 디바운스 (연속 저장 → 1회 처리)               │
│  3. 'file-changed' 이벤트 발생                          │
└──────────────────────┬──────────────────────────────────┘
                       │ 'file-changed' 이벤트
                       ▼
┌─────────────────────────────────────────────────────────┐
│              extension.ts (총괄 지휘자)                  │
│  handleFileChange() 호출                                │
│  어떤 파일이 바뀌었는지 분기:                            │
│  ├─ state.md      → reloadState()                      │
│  ├─ PRODUCT.md    → reloadArtifact('product')          │
│  ├─ DESIGN.md     → reloadArtifact('design')           │
│  ├─ roadmap.md    → reloadRoadmap()                    │
│  └─ error.history → reloadErrorHistory()               │
└──────────────┬───────────────────┬─────────────────────┘
               │                   │
               ▼                   ▼
┌─────────────────┐    ┌─────────────────────────────────┐
│ parser/state.ts │    │       webview/panel.ts          │
│ parseState()    │    │  setBlueprintState()            │
│ 텍스트 → 객체  │    │  setSpecArtifacts()             │
│ BlueprintState  │    │  탭별 HTML 생성                 │
└────────┬────────┘    └─────────────────┬───────────────┘
         │                               │
         ▼                               ▼
┌─────────────────────┐    ┌─────────────────────────────┐
│ sidebar (사이드바)  │    │   webview (가운데 화면)     │
│  BLUEPRINT 섹션     │    │   Plan / Spec / Preview     │
│  PHASES 리스트      │    │   Errors 탭                 │
│  CURRENT FOCUS      │    │   HTML 렌더링               │
└─────────────────────┘    └─────────────────────────────┘
               │                               │
               └──────────────┬────────────────┘
                              ▼
              ┌─────────────────────────────┐
              │       사용자 화면           │
              │  (IDE 사이드바 + 가운데 탭) │
              └─────────────────────────────┘
```

### 6-2. 파서(Parser) 알고리즘 상세

```
state.md 텍스트 입력
       ↓
splitSections()  ←── ## 헤딩 기준으로 섹션 분리
       ↓
 ┌─────────────────────────────────┐
 │  sections Map:                  │
 │  "progress"      → "- [x]..."  │
 │  "next action"   → "V1 개발..."│
 │  "counters"      → "- ships:1" │
 │  "triggers fired"→ "(empty)"   │
 │  "settings"      → "- strict:f"│
 │  "decisions log" → "- 날짜:..." │
 └─────────────────────────────────┘
       ↓
parsePhases()       → Phase[] 배열
parseNextAction()   → string
parseCounters()     → Counters 객체
parseTriggers()     → string[] 배열
parseSettings()     → Settings 객체
parseDecisions()    → DecisionEntry[] 배열
       ↓
BlueprintState 객체 반환 (immutable)
```

### 6-3. 화면 렌더링 알고리즘

```
BlueprintState 수신
       ↓
getProgress() → { done: 6, total: 7, percent: 85% }
       ↓
getActivePhase() → 현재 진행 중인 Phase 찾기
       ↓
HTML 문자열 생성:
  renderBlueprint()      → BLUEPRINT 섹션 HTML
  renderPhasesSection()  → PHASES 리스트 HTML
  renderCurrentFocusSection() → CURRENT FOCUS HTML
       ↓
webview.html = 생성된 HTML (즉시 화면에 반영)
```

### 6-4. 파이(Pie) 구조 — 레이어별 역할

```
        ┌──────────────────────────────────────────┐
        │           사용자 (파일 편집)               │  ← 최상위: 사람
        └─────────────────┬────────────────────────┘
                          │
        ┌─────────────────▼────────────────────────┐
        │         파일 시스템 (.md 파일들)           │  ← 데이터 원본
        └─────────────────┬────────────────────────┘
                          │
        ┌─────────────────▼────────────────────────┐
        │    file-watcher + parser 레이어           │  ← 데이터 처리
        │   (감지 → 읽기 → 구조화된 객체)            │
        └─────────────────┬────────────────────────┘
                          │
        ┌─────────────────▼────────────────────────┐
        │      extension.ts 레이어 (지휘자)          │  ← 로직 조율
        │   (이벤트 라우팅, 상태 관리, 명령 등록)     │
        └────────┬────────────────────┬─────────────┘
                 │                    │
        ┌────────▼───────┐  ┌─────────▼──────────┐
        │ sidebar 레이어  │  │   webview 레이어    │  ← UI 출력
        │ (사이드바 HTML) │  │ (가운데 화면 HTML)  │
        └────────────────┘  └────────────────────┘
```

> **📌 요약:** 프로그램은 "파일 감시 → 파싱(번역) → UI 업데이트"의 단순한 흐름을 따라요. 위에서 아래로, 파일에서 화면으로, 항상 한 방향으로만 데이터가 흘러요.

---

## 7. 개발 히스토리 (시간순)

### 2026-05-22 — Day 1: 기획과 설계

**오전: Phase 0 (PRODUCT)**
- `docs/PRODUCT.md` 작성
- 핵심 결정: "state.md → 사이드바만" (V0 최소 버전)
- NON-GOALS 확정 (AI 호출 없음, 단방향 등)

**오후: Phase 1 (DESIGN) + Phase 2 (ARCHITECTURE)**
- `docs/DESIGN.md` 작성 (디자인 방향)
- `docs/ARCHITECTURE.md` 작성
- ADR-001~007 작성 (7개의 중요 결정 기록)
- 5개 도메인 구조 확정

**주요 ADR (Architecture Decision Record) 결정:**

| ADR | 결정 내용 |
|---|---|
| 001 | TypeScript + VS Code Extension API 사용 |
| 002 | AI 호출 금지 — 시각화만 |
| 003 | 단방향 데이터 흐름 (.md → UI) |
| 004 | 이벤트 버스 기반 통신 |
| 005 | Generic 모드는 V4 이후 |
| 006 | 가운데 webview 멀티탭 4개 |
| 007 | 사이드바를 TreeView → WebviewView로 전환 |

### 2026-05-24 — Day 3: 구현과 첫 배포

**Phase 3: IMPLEMENT**
- 파일 구조 생성 (`src/`, `docs/`, `plans/` 등)
- `types.ts` 작성 (모든 타입 정의)
- `file-watcher/watcher.ts` 작성
- `parser/state.ts` 작성
- `sidebar/sidebar-view-provider.ts` 작성
- `webview/panel.ts` 와 4개 탭 페이지 작성
- `extension.ts` 작성 (모두 연결)

**Phase 4: REVIEW**
- ADR-008: 마크다운 자동 가공 파이프라인 추가
- ADR-009: CHECKPOINT를 Phase 목록에서 제외 → KPI 카드로

**Phase 5: SHIP (v0.1.0)**
- 첫 .vsix 파일 패키징
- Antigravity IDE 설치 테스트

### 2026-05-30 — Week 2: 디자인 개선

**v0.9.0 ~ v0.9.2**
- 디자인 목업 HTML 7종 작성
- `/blueprint` Phase 1 승인 루프 추가
- progress bar 100% 버그 수정

**v0.9.3**
- 사이드바 progress bar CSP 버그 수정
  - 원인: `unsafe-inline` 누락
  - 해결: CSP 헤더에 `'unsafe-inline'` 추가
- Preview 탭 카테고리 자동 그룹화

**v0.9.4 — 대규모 디자인 리뉴얼**
- 글래스모피즘(반투명 유리 효과) 폐기
- iOS Settings 플랫 디자인으로 전환
- Pretendard 폰트 번들 추가
- HTML 10종 전면 재작성

### 2026-06-01 — v0.9.5: 정리 및 GitHub 배포

**v0.9.5**
- 사이드바 3섹션 단순화 (BLUEPRINT / PHASES / CURRENT FOCUS)
- GitHub 저장소 신규 생성
- `.vscodeignore`에 `.claude/**` 추가 (보안: settings.local.json 유출 방지)
- GitHub Release v0.9.5 생성

**ADR-010 추가:**
- REVIEW를 정식 Phase로 추가 (Phase 4)
- 전체 Phase: 7개 (0~6)

> **📌 요약:** 이 프로젝트는 2주 만에 기획부터 배포까지 완료했어요. 처음 1~2일을 완전히 설계에 쏟고, 그 다음에 코딩을 했더니 훨씬 빠르고 깔끔하게 만들 수 있었어요.

---

## 8. 에러와 해결 방법

### 에러 #1 — Progress Bar가 0%로만 표시됨

**언제:** v0.9.2 개발 중
**증상:** 사이드바의 진행도 막대가 항상 0%로 보임

**원인 분석:**
```typescript
// 잘못된 코드 (progress bar width를 inline style로 설정)
<div class="bar-fill" style="width: ${percent}%"></div>

// CSP(보안 정책)가 inline style을 막고 있었음!
// CSP 설정: style-src 'self'  ← unsafe-inline이 없어서 막힘
```

**해결:**
```typescript
// CSP에 'unsafe-inline' 추가
const csp = `style-src ${webview.cspSource} 'unsafe-inline';`;
```

**배운 점:** VS Code Webview는 기본적으로 보안이 매우 강해서, inline style 하나도 명시적으로 허용해야 해요.

---

### 에러 #2 — 파일 변경 감지가 너무 자주 발생

**언제:** file-watcher 구현 중
**증상:** 파일 저장 시 화면이 수십 번 깜빡임

**원인:**
- 파일을 한 번 저장해도 OS가 변경 이벤트를 여러 번 보냄
- 임시 파일(`.tmp`)도 이벤트 발생

**해결:**
```typescript
// 1. 디바운스 적용 — 200ms 내 중복 이벤트 무시
const DEBOUNCE_MS = 200;
setTimeout(() => handleFileChange(), DEBOUNCE_MS);

// 2. 임시 파일 무시
if (rel.includes('.tmp.')) return;  // 무시
if (rel.endsWith('.swp')) return;   // vim 임시 파일 무시
```

---

### 에러 #3 — 구 버전 state.md와 호환성 문제

**언제:** v0.9.5 파서 작성 중
**증상:** 예전 형식으로 쓴 state.md가 파싱 안 됨

**원인:**
- v0.1 schema: Phase 4 = CHECKPOINT, Phase 5 = SHIP
- v0.5 schema: Phase 4 = REVIEW, Phase 5 = SHIP

**해결:**
```typescript
// 버전별 매핑 테이블
if (rawId === 4 && name === 'REVIEW') id = 4;  // 신규
if (rawId === 4 && name === 'SHIP')   id = 5;  // 구버전 호환
if (rawId === 5 && name === 'SHIP')   id = 5;  // v0.5
```

**배운 점:** 데이터 형식이 바뀌어도 구 버전을 읽을 수 있게 하는 것을 **하위 호환성(Backward Compatibility)** 이라고 해요. 실제 서비스에서는 매우 중요해요!

---

### 에러 #4 — .vsix 파일에 민감한 설정 파일 포함됨

**언제:** v0.9.5 패키징 시
**증상:** `.vsix` 안에 `.claude/settings.local.json` (API 키 포함 가능) 이 들어감

**원인:** `.vscodeignore`에 `.claude/**` 가 없었음

**해결:**
```
# .vscodeignore에 추가
.claude/**
*.local.json
```

**배운 점:** 배포 파일을 만들 때는 **항상 포함된 파일 목록을 확인**해야 해요. 민감한 정보(API 키, 비밀번호)가 들어가면 큰일 납니다!

---

### 에러 #5 — 사이드바가 표시 안 됨 (빈 화면)

**언제:** WebviewView 구현 초기
**증상:** 사이드바 클릭해도 아무것도 안 보임

**원인:**
```typescript
// package.json에 view 타입 잘못 설정
"type": "tree"   // ← 잘못됨

// 수정 후
"type": "webview"  // ← 맞음
```

**배운 점:** VS Code Extension의 `package.json` 설정은 매우 꼼꼼히 확인해야 해요. 작은 오타 하나로 기능 전체가 작동 안 할 수 있어요.

> **📌 요약:** 실제 개발에서는 에러가 항상 나요. 중요한 건 당황하지 않고 원인을 찾는 거예요. 에러 메시지를 읽고, 하나씩 가설을 세우고 테스트해 봐요. 그리고 해결 방법을 꼭 기록해두세요!

---

## 9. Key Takeaway · 주의사항 · 개발 팁

### 9-1. Key Takeaway (가장 중요한 교훈)

#### 💡 교훈 1: 코딩 전에 계획부터!
이 프로젝트에서 가장 중요한 교훈은 **설계를 먼저 하면 코딩이 훨씬 쉬워진다**는 거예요.
- PRODUCT.md → DESIGN.md → ARCHITECTURE.md를 먼저 쓰고 코딩 시작
- "뭘 만들지도 모르면서 코딩하면" 나중에 다 뜯어고쳐야 해요

#### 💡 교훈 2: 단방향 데이터 흐름
데이터가 **한 방향으로만** 흐르게 하면 버그를 찾기 쉬워요.
- ✅ 파일 → 파서 → UI
- ❌ UI → 파서 → 파일 (금지!)

#### 💡 교훈 3: 도메인 분리
코드를 역할별로 나누면 **수정이 쉬워요**.
- parser를 바꿔도 sidebar는 영향받지 않아요
- 마치 학교에서 각 선생님이 각자 과목만 담당하는 것처럼요

#### 💡 교훈 4: NON-GOALS가 더 중요할 수 있다
"**무엇을 하지 않을지**" 를 정하는 게 더 중요할 때가 많아요.
- AI 호출 안 함 → 프로그램이 단순해짐
- 팀 기능 없음 → 1인용에 집중 가능

#### 💡 교훈 5: 보안은 처음부터
- CSP(보안 정책)는 처음부터 올바르게 설정
- .vscodeignore로 민감한 파일 처음부터 제외

### 9-2. 주의사항

```
⚠️ 주의 1: package.json 설정 오타
   → VS Code Extension의 package.json은 한 글자 틀리면
     기능 전체가 작동 안 할 수 있어요

⚠️ 주의 2: CSP(Content Security Policy)
   → VS Code Webview에서 inline style, inline script를
     쓰려면 명시적으로 허용해야 해요

⚠️ 주의 3: 배포 전 파일 확인
   → .vsix에 민감한 파일이 포함되지 않았는지
     항상 확인하세요

⚠️ 주의 4: 구 버전 호환성
   → 데이터 형식이 바뀌면 구 버전 데이터를 읽을 수 있게
     항상 하위 호환 코드 작성

⚠️ 주의 5: 이벤트 정리(dispose)
   → 파일 감시자, 이벤트 리스너는 반드시 종료 시 dispose()
     안 하면 메모리 누수(leak) 발생
```

### 9-3. 개발 팁

#### 팁 1: 타입을 먼저 만들어라
```typescript
// 먼저 types.ts에 인터페이스를 정의하고
interface BlueprintState {
  project: string;
  phases: Phase[];
  // ...
}

// 그 다음 코드를 짜면 자동완성이 도와줘요!
```

#### 팁 2: 작게 시작해라 (V0 → V1 → V2)
한꺼번에 다 만들려 하지 마세요.
- V0: 가장 작은 핵심 기능만
- 그것이 잘 되면 V1 추가
- 이렇게 하면 항상 "돌아가는 버전"이 있어요

#### 팁 3: 에러 기록을 남겨라
```markdown
# Error Log
## 날짜: 언제
## 증상: 어떻게 안 되는지
## 원인: 왜 그런지
## 해결: 어떻게 고쳤는지
```
이렇게 기록하면 같은 에러를 두 번 찾지 않아도 돼요!

#### 팁 4: ADR로 결정을 기록하라
코드를 짜다 보면 "왜 이렇게 했지?" 싶을 때가 있어요.
그 때를 위해 **왜** 이 결정을 했는지 ADR로 남겨두세요.
미래의 나에게 주는 선물이에요!

#### 팁 5: dogfooding(직접 써봐라)
만든 것을 직접 사용해봐야 진짜 문제를 발견할 수 있어요.
이 프로젝트도 만들면서 직접 설치해서 쓰면서 개선했어요.

> **📌 요약:** 좋은 개발자가 되는 비결은 1) 계획 먼저 2) 작게 시작 3) 에러를 기록 4) 결정을 기록 5) 직접 써보기예요. 코딩 실력보다 이 습관이 더 중요해요!

---

## 부록: 전체 프로젝트 파일 구조

```
Service Planning automation/
├── src/                          ← 소스 코드
│   ├── extension.ts              ← 진입점 (프로그램 시작/종료)
│   ├── types.ts                  ← 모든 타입 정의
│   ├── file-watcher/
│   │   └── watcher.ts            ← 파일 변경 감지
│   ├── parser/
│   │   └── state.ts              ← state.md 파싱
│   ├── sidebar/
│   │   └── sidebar-view-provider.ts  ← 사이드바 UI
│   └── webview/
│       ├── panel.ts              ← 가운데 화면 패널
│       ├── shared.ts             ← 공통 유틸리티
│       └── pages/
│           ├── plan.ts           ← Plan 탭
│           ├── spec.ts           ← Spec 탭
│           ├── preview.ts        ← Preview 탭
│           └── errors.ts         ← Errors 탭
├── docs/                         ← 문서
│   ├── PRODUCT.md               ← 제품 기획
│   ├── DESIGN.md                ← 디자인 명세
│   ├── ARCHITECTURE.md          ← 아키텍처 명세
│   └── adr/                     ← 결정 기록
│       ├── ADR-006-multitab-webview.md
│       ├── ADR-007-sidebar-webview-migration.md
│       ├── ADR-008-markdown-transforms.md
│       ├── ADR-009-checkpoint-as-kpi.md
│       └── ADR-010-review-as-phase.md
├── .blueprint/
│   └── state.md                 ← 진행 상황 메모 (진실 원본)
├── plans/
│   └── roadmap.md               ← 로드맵
├── package.json                 ← 프로젝트 설정
├── tsconfig.json                ← TypeScript 설정
├── esbuild.config.js            ← 빌드 설정
├── DIGEST.md                    ← 세션별 요약 기록
└── jinilog/                     ← 이 가이드 폴더
    ├── dev_guide.md             ← 개발자 가이드 (지금 이 파일)
    ├── user_guide.md            ← 사용자 가이드
    └── dev_user_blog.md         ← 블로그 글
```

---

*이 가이드는 2026-06-01 기준으로 작성되었습니다.*
*프로젝트 버전: v0.9.5*
