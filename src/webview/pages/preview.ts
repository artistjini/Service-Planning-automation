/**
 * Preview 페이지 — Claude push한 디자인 HTML 1개 표시 (적립 X).
 *
 * 데이터: 채팅에서 "프리뷰에 X.html 띄와봐" → extension.ts가 blueprint.preview 명령 받음 → 그 파일 읽어서 페이지 2 콘텐츠 교체.
 *
 * V0+엔 단순: iframe srcdoc으로 HTML 통째로 띄움. (CSP 격리)
 * 단점: 외부 리소스 (이미지, 폰트) 불가. V1에서 webview content를 직접 띄우는 방식 검토.
 */

import { escapeHtml } from '../shared';

export interface PreviewContent {
  /** 표시할 HTML 콘텐츠 (없으면 빈 상태) */
  html: string | null;
  /** 출처 파일 경로 (안내용) */
  sourcePath: string | null;
  /** push 된 시각 */
  pushedAt: Date | null;
}

export function renderPreviewPage(preview: PreviewContent): string {
  if (!preview.html) {
    return `
      <div class="page-hero">
        <div class="page-eyebrow">PREVIEW</div>
        <h1 class="page-title">미리볼 게 없어요</h1>
        <p class="page-subtitle">
          채팅에서 <code>프리뷰에 [파일명] 띄와봐</code> 라고 해보세요.<br/>
          예: <code>프리뷰에 docs/design/hero.html 띄와봐</code>
        </p>
      </div>

      <div class="empty-card">
        <p class="muted">push된 HTML은 적립되지 않고 *최근 한 개*만 표시됩니다.</p>
        <p class="muted">디자인 적립은 Spec 페이지의 산출물 (DESIGN.md, docs/design/*.html)이 담당.</p>
      </div>`;
  }

  // iframe srcdoc으로 격리 — sandbox로 스크립트 차단 옵션
  const escapedHtml = escapeHtml(preview.html);
  const sourceLabel = preview.sourcePath
    ? escapeHtml(preview.sourcePath)
    : '(unknown source)';
  const timeLabel = preview.pushedAt
    ? formatTime(preview.pushedAt)
    : '';

  return `
    <div class="page-hero compact">
      <div class="page-eyebrow">PREVIEW</div>
      <h1 class="page-title-small">${sourceLabel}</h1>
      <p class="page-subtitle small">pushed at ${timeLabel}</p>
    </div>
    <div class="preview-frame-wrap">
      <iframe class="preview-frame" srcdoc="${escapedHtml}" sandbox="allow-same-origin"></iframe>
    </div>`;
}

function formatTime(date: Date): string {
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}
