/**
 * Preview 페이지 — 큰 아이콘 그리드 (Windows 탐색기 풍).
 *
 * - 카드 클릭: 풀-너비 viewer
 * - "← 그리드로" 버튼으로 그리드로 복귀
 * - 채팅 명령 push도 그대로 (Spec 페이지의 디자인 시안 명령)
 */

import { escapeHtml } from '../shared';

export interface PreviewContent {
  html: string | null;
  sourcePath: string | null;
  pushedAt: Date | null;
}

export interface PreviewDesignFile {
  relativePath: string;
  name: string;
  /** 카드 썸네일 렌더용 (iframe srcdoc) */
  content?: string;
}

export function renderPreviewPage(
  preview: PreviewContent,
  designFiles: PreviewDesignFile[] = [],
): string {
  // 1) 활성 콘텐츠 있으면 — 풀-너비 viewer + 상단 그리드로 돌아가기 버튼
  if (preview.html) {
    const escapedHtml = escapeHtml(preview.html);
    const sourceLabel = escapeHtml(preview.sourcePath ?? '(unknown)');
    const timeLabel = preview.pushedAt ? formatTime(preview.pushedAt) : '';

    return `
      <div class="preview-detail-bar">
        <button type="button" class="preview-back-btn" data-action="preview-back">← 그리드로</button>
        <div class="preview-detail-path">${sourceLabel}</div>
        <div class="preview-detail-time">${timeLabel}</div>
      </div>
      <div class="preview-detail-frame-wrap">
        <iframe class="preview-detail-frame" srcdoc="${escapedHtml}" sandbox="allow-same-origin"></iframe>
      </div>`;
  }

  // 2) 그리드
  if (designFiles.length === 0) {
    return `
      <div class="page-hero compact">
        <div class="page-eyebrow">PREVIEW · 디자인 시안</div>
        <h1 class="page-title">시안이 없어요</h1>
        <p class="page-subtitle">
          <code>docs/design/</code> 폴더에 <code>.html</code> 파일이 없습니다.<br/>
          파일을 추가하거나 채팅에서 <code>프리뷰에 [파일명] 띄와봐</code> 라고 명령해보세요.
        </p>
      </div>`;
  }

  const tilesHtml = designFiles.map(f => {
    const hue = simpleHash(f.relativePath) % 360;
    const accent = `hsl(${hue}, 70%, 75%)`;
    const accent2 = `hsl(${(hue + 60) % 360}, 70%, 85%)`;
    // 실제 콘텐츠 있으면 iframe 썸네일, 없으면 placeholder
    const thumbInner = f.content
      ? `<iframe class="preview-tile-frame" srcdoc="${escapeHtml(f.content)}" sandbox="allow-same-origin" scrolling="no" tabindex="-1"></iframe>
         <div class="preview-tile-click-shield"></div>
         <div class="preview-tile-html-label">HTML</div>`
      : `<div class="preview-tile-placeholder" style="background: linear-gradient(135deg, ${accent} 0%, ${accent2} 100%);">
           <div class="preview-tile-icon">🖼️</div>
           <div class="preview-tile-html-label">HTML</div>
         </div>`;
    return `
    <button type="button" class="preview-tile" data-preview-file="${escapeHtml(f.relativePath)}">
      <div class="preview-tile-thumb">
        ${thumbInner}
      </div>
      <div class="preview-tile-body">
        <div class="preview-tile-name">${escapeHtml(f.name)}</div>
        <div class="preview-tile-path">${escapeHtml(f.relativePath.replace(/^docs\/design\//, ''))}</div>
      </div>
    </button>`;
  }).join('');

  return `
    <div class="page-hero compact">
      <div class="page-eyebrow">PREVIEW · 디자인 시안</div>
      <h1 class="page-title">${designFiles.length}개 시안</h1>
      <p class="page-subtitle">
        <code>docs/design/</code> 폴더 자동 listing · 큰 카드 클릭으로 확대
      </p>
    </div>

    <div class="preview-grid">
      ${tilesHtml}
    </div>`;
}

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function formatTime(date: Date): string {
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}
