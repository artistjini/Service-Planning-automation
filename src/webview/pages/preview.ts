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

export interface PreviewDesignFile {
  /** 워크스페이스 기준 상대 경로 (예: docs/design/screenshots/spec-mockup-1-explorer.html) */
  relativePath: string;
  /** 파일명 (라벨) */
  name: string;
}

export function renderPreviewPage(
  preview: PreviewContent,
  designFiles: PreviewDesignFile[] = [],
): string {
  const hasContent = !!preview.html;

  // 좌측 listing (파일들)
  const listingHtml = designFiles.length === 0
    ? `<div class="preview-empty-listing">docs/design/ 폴더에 .html 파일이 없어요.</div>`
    : designFiles.map(f => {
        const active = preview.sourcePath === f.relativePath ? 'active' : '';
        return `<button type="button" class="preview-file-row ${active}" data-preview-file="${escapeHtml(f.relativePath)}">
          <span class="preview-file-icon">📄</span>
          <span class="preview-file-name">${escapeHtml(f.name)}</span>
          <span class="preview-file-path">${escapeHtml(f.relativePath.replace(/^docs\/design\//, ''))}</span>
        </button>`;
      }).join('');

  // 우측 미리보기 영역
  const viewerHtml = hasContent
    ? `<div class="preview-viewer-header">
         <div class="preview-viewer-path">${escapeHtml(preview.sourcePath ?? '')}</div>
         <div class="preview-viewer-time">${preview.pushedAt ? formatTime(preview.pushedAt) : ''}</div>
       </div>
       <iframe class="preview-frame" srcdoc="${escapeHtml(preview.html!)}" sandbox="allow-same-origin"></iframe>`
    : `<div class="preview-viewer-empty">
         <div class="preview-viewer-empty-title">왼쪽에서 시안을 골라주세요</div>
         <div class="preview-viewer-empty-sub">
           또는 채팅에서 <code>프리뷰에 [파일명] 띄와봐</code> 라고 명령
         </div>
       </div>`;

  return `
    <div class="page-hero compact">
      <div class="page-eyebrow">PREVIEW · 디자인 시안</div>
      <h1 class="page-title-small">${designFiles.length}개 시안</h1>
      <p class="page-subtitle small">docs/design/ 폴더의 .html 파일들 자동 listing · 클릭으로 미리보기</p>
    </div>

    <div class="preview-explorer">
      <aside class="preview-listing">
        <div class="preview-listing-header">DESIGN FILES</div>
        ${listingHtml}
      </aside>
      <main class="preview-viewer">
        ${viewerHtml}
      </main>
    </div>`;
}

function formatTime(date: Date): string {
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}
