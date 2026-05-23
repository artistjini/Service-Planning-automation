/**
 * Errors 페이지 — docs/error.history.md 풀-너비 렌더.
 *
 * 파일 있으면: 풀-너비 마크다운 렌더
 * 파일 없으면: "에러 히스토리 시작" 버튼 → 클릭 시 extension에 메시지 보냄 → 파일 생성
 */

import { renderMarkdown, escapeHtml } from '../shared';

export function renderErrorsPage(
  errorMd: string | null,
  filePath: string = 'docs/error.history.md',
): string {
  if (!errorMd) {
    return `
      <div class="page-hero">
        <div class="page-eyebrow">ERRORS</div>
        <h1 class="page-title">에러 히스토리</h1>
        <p class="page-subtitle">
          <code>${escapeHtml(filePath)}</code> 파일이 아직 없습니다.
        </p>
      </div>

      <div class="empty-card cta-card">
        <p>발생한 에러, 원인, 해결을 시간순으로 누적하는 일지입니다.</p>
        <button class="cta-button" data-action="create-error-history">
          ✚ 에러 히스토리 시작
        </button>
        <p class="muted" style="margin-top: 12px;">
          템플릿이 박힌 빈 파일을 만들어요. 이후 에러 발생 시 Claude에게 "에러히스토리에 추가해" 라고 하시면 됩니다.
        </p>
      </div>`;
  }

  return `
    <div class="page-hero">
      <div class="page-eyebrow">ERRORS</div>
      <h1 class="page-title">에러 히스토리</h1>
      <p class="page-subtitle">
        <code>${escapeHtml(filePath)}</code> · 최근 에러가 위에 누적됩니다.
      </p>
    </div>
    <div class="markdown-body errors-body">
      ${renderMarkdown(errorMd)}
    </div>`;
}

/**
 * 에러 히스토리 초기 템플릿 (생성 버튼 클릭 시 사용).
 */
export const ERROR_HISTORY_TEMPLATE = `# Error History

> 에러·트러블슈팅 일지. 발생한 시점·원인·해결을 시간순(역시간순)으로 기록.
> 새 에러는 *맨 위에* 추가.

## 템플릿 (복사해서 사용)

\`\`\`markdown
## YYYY-MM-DD HH:MM — {짧은 에러 제목}

- **Status**: RESOLVED | OPEN | IGNORED
- **Phase**: {발생한 Phase 또는 워크 단계}
- **상황**: {언제·무엇 하다가 발생}
- **에러 메시지**:
  \\\`\\\`\\\`
  {원문}
  \\\`\\\`\\\`
- **원인**: {왜 발생했나}
- **해결**: {어떻게 풀었나}
- **재발 방지**: {앞으로 피하려면}
\`\`\`

(에러는 아래에 시간순으로 누적)
`;
