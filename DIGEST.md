# DIGEST — 대시보드 확장 프로그램

## 2026-06-01
- 사이드바 3섹션 단순화 (v0.9.5) — BLUEPRINT / PHASES / CURRENT FOCUS만 남김, iOS Settings 구조 적용
- GitHub 저장소 신규 생성 (artistjini/Service-Planning-automation) + remote URL 수정 후 push
- .vsix 패키징 (blueprint-dashboard-0.9.5.vsix, 2.05 MB) + Antigravity IDE 설치 테스트 통과
- 핵심 결정: .claude/** .vscodeignore 추가로 settings.local.json 유출 차단
- 다음에 이어갈 것: 추가 기능 개발 (마켓플레이스 배포는 NON-GOALS 영구 제외)
- ⚠️ 유의사항: *.vsix는 빌드 결과물이지만 V0+ dogfooding 기간 동안 의도적으로 git에 포함 중. dogfooding = 개발하면서 직접 설치해 쓰는 단계. 마켓플레이스 배포 전까지 git을 임시 배포 채널로 활용하는 것이므로, 배포 후에는 .gitignore에 추가할 것.

## 2026-05-30 14:51
- 플랫 iOS Settings 시안 전면 적용 (v0.9.4) — 글래스모피즘 폐기, Pretendard 번들, HTML 10종 재작성
- 핵심 결정: accent #007aff, 흰 카드, 헤어라인 구분선으로 디자인 언어 확정
- 다음에 이어갈 것: 사이드바 정보 위계 정리 (TRIGGERS/ACTIVE FILE/CHECKPOINTS 제거, RECENT CHANGES 라벨 의미화)

## 2026-05-30 11:29
- sidebar progress bar CSP 버그 수정 (v0.9.3) — `unsafe-inline` 누락이 root cause
- Preview 탭 카테고리 자동 그룹화 추가 (사이드바/Plan/Spec/Preview/Errors/Mockups/기타 7개)
- 다음에 이어갈 것: 디자인 시안 최종 확정 → v0.9.4

## 2026-05-30 (v0.9.0~0.9.2)
- 디자인 목업 HTML 7종 전체 작성, `/blueprint` Phase 1 승인 루프 추가 (v0.9.0~0.9.1)
- progress bar 100% 버그 수정, DESIGN.md 시안 카드 그리드 전환 (v0.9.2)
- 핵심 결정: Phase 4 REVIEW 자동 규칙 `/blueprint`에 통합

## 2026-05-24 (v0.1.0~v0.8.0)
- Phase 0~6 전 과정 완료, v0.1.0 첫 SHIP
- 주요 기능 누적: CHECKPOINT KPI 카드, Preview 자동 목록, Spec 폴더 탐색기, iframe 썸네일, 사이드바 4섹션 정리
- 핵심 결정: ADR-001~010 (TypeScript, 단방향, 이벤트 버스, CHECKPOINT KPI화, Phase 4 REVIEW 정식화)
- 다음에 이어갈 것: 디자인 시안 확정 및 실제 렌더링 품질 개선
