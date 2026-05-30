# SETUP — 다른 컴퓨터에서 처음부터 쓰기

이 저장소 하나만 clone 하면 **Blueprint Dashboard 확장 + `/blueprint` 워크플로**를 새 머신에서 그대로 굴릴 수 있다.
추출·fork 없이, gstack은 받는 사람이 직접 설치한다. (gstack은 공개 MIT repo라 재배포 의무 없음.)

구성 요소 3개:

| # | 무엇 | 어디서 | 비고 |
|---|---|---|---|
| 1 | **gstack** | 공개 GitHub repo | `/blueprint`가 위임하는 스킬들(office-hours, autoplan, qa, ship...). 바이너리+크로미움 포함 → 직접 설치 필요 |
| 2 | **blueprint 스킬** | 이 repo `skills/blueprint/` | `~/.claude/skills/`로 복사하면 `/blueprint` 등록됨 |
| 3 | **확장(.vsix)** | 이 repo 루트 | 사이드바 계기판 (state.md·산출물 시각화 뷰어, AI 호출 없음) |

---

## 3단계 설치

### 1) gstack 설치 (30초, 한 번만)

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack && ./setup
```

> 이미 gstack을 쓰던 머신이면 건너뛴다.
> `./setup`이 CLAUDE.md에 gstack 섹션 추가를 제안할 수 있는데, `/blueprint`가 오케스트레이션을 맡으므로 선택 사항이다.

### 2) blueprint 스킬 설치

이 repo의 `skills/blueprint/` 폴더를 `~/.claude/skills/`로 복사한다.

**PowerShell (Windows):**
```powershell
Copy-Item -Recurse -Force ".\skills\blueprint" "$env:USERPROFILE\.claude\skills\blueprint"
```

**bash (macOS/Linux):**
```bash
cp -r ./skills/blueprint ~/.claude/skills/blueprint
```

> blueprint는 `~/.claude/skills/blueprint/templates/` 경로를 INIT 시 참조하므로, 반드시 이 위치로 복사해야 한다.

### 3) 확장 설치

```bash
code --install-extension blueprint-dashboard-0.8.0.vsix
```

> Antigravity/VSCode를 재시작하면 활동바에 **Blueprint** 아이콘이 뜬다.

---

## 확인

1. Claude Code에서 `/blueprint` 입력 → INIT/RESUME 모드가 떠야 함 (gstack 스킬 위임 동작).
2. 워크스페이스에 `.blueprint/state.md`가 있으면 → 사이드바 계기판에 phase 진행도가 보임.
3. 없으면 → "감지 안 됨" 안내 (정상. `/blueprint`로 새로 만들면 채워짐).

---

## 의존성 메모 (왜 이렇게 나눴나)

- **확장은 gstack을 호출하지 않는다.** 순수 뷰어(단방향: `.blueprint/state.md` → UI). `/blueprint` 스킬만 gstack에 위임한다.
- **gstack 스킬은 `.md`만 떠올 수 없다.** 모든 SKILL.md가 `~/.claude/skills/gstack/bin/*` 바이너리 + 222M 크로미움에 묶여 있어서, 설치본이 있어야 동작한다 → 그래서 직접 설치 방식.
- **blueprint를 포크/추출하지 않은 이유:** gstack이 상류에서 유지·튜닝되므로 위임이 가장 안정적이고 유지보수 부담이 없다.

업데이트하려면: 이 repo `git pull` 후 2)·3) 다시 실행. gstack은 `/gstack-upgrade`.
