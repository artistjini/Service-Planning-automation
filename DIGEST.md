# DIGEST — 대시보드 확장 프로그램

## 2026-06-01 (2차)
- jinilog/ 폴더 생성 — dev_guide.md, user_guide.md, dev_user_blog.md, guide_write_prompt.md 작성
- dev_guide.md: 초등학생 눈높이 개발 교과서 (개념·SOP·에러·팁 9챕터)
- user_guide.md: 설치·사용 설명서 (단계별·표·FAQ·빠른 참조 카드)
- dev_user_blog.md: 문토 Chris 님 프로젝트 분석 블로그 (Jini 학습 기록, 배움 10가지)
- guide_write_prompt.md: 가이드 3종 작성 지침 + blog 컨텍스트 프롬프트 (재사용 가능)
- jinilog/README.md 추가 — 폴더 파일 목록 및 프로젝트 배경 안내
- README.md 전면 업데이트 — v0.9.5 기준, 구 GitHub URL 수정, 정식 배포 문구 제거
- PRODUCT.md 업데이트 — JBT 6번 추가 (blueprint 문서 자동 업데이트), V5 버전 로드맵 등록
- 핵심 결정: blueprint 문서 자동 업데이트를 V5 개발 목표로 공식 등록. 진입 전 단방향 원칙 재검토 ADR 필요.
- 다음에 이어갈 것: V1 개발 시작 → V5 진입 전 ADR 작성

## 2026-06-01 (1차)
- 사이드바 3섹션 단순화 (v0.9.5) — BLUEPRINT / PHASES / CURRENT FOCUS만 남김, iOS Settings 구조 적용
- GitHub 저장소 신규 생성 (artistjini/Service-Planning-automation) + remote URL 수정 후 push
- .vsix 패키징 (blueprint-dashboard-0.9.5.vsix, 2.05 MB) + Antigravity IDE 설치 테스트 통과
- 핵심 결정: .claude/** .vscodeignore 추가로 settings.local.json 유출 차단
- GitHub Release v0.9.5 생성 (.vsix Assets 첨부)
- ⚠️ 유의사항: *.vsix는 빌드 결과물이지만 V0+ dogfooding 기간 동안 의도적으로 git에 포함 중.

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
