/**
 * Webview 공통 헬퍼 — HTML 이스케이프, nonce 생성, markdown-it 인스턴스 등.
 */

import MarkdownIt from 'markdown-it';

export const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: false,
});

export function renderMarkdown(markdown: string): string {
  let html = md.render(markdown);
  html = injectColorSwatches(html);
  html = transformNonGoals(html);
  html = transformDesignGallery(html);  // ## 디자인 시안 → 카드 그리드
  html = transformHeadingsToCards(html);
  return html;
}

/**
 * "## 디자인 시안" 헤딩 다음의 (h3 + img) 쌍들을 자동으로 카드 그리드로 변환.
 *
 * 원본:
 *   <h2>디자인 시안 ...</h2>
 *   ...
 *   <h3>Sidebar</h3>
 *   <p><img src="..." alt="..."></p>
 *   <h3>Webview Plan</h3>
 *   <p><img src="..." alt="..."></p>
 *
 * 변환 후:
 *   <h2>디자인 시안 ...</h2>
 *   ...
 *   <div class="design-gallery">
 *     <div class="gallery-card">
 *       <div class="gallery-image-wrap">
 *         <img src="..." alt="...">
 *         <div class="gallery-placeholder">Sidebar — 시안 추가 예정</div>
 *       </div>
 *       <div class="gallery-label">Sidebar</div>
 *     </div>
 *     ...
 *   </div>
 *
 * placeholder는 img 뒤에 z-index 깔림 — img 깨지면 (또는 onerror) 보임.
 */
function transformDesignGallery(html: string): string {
  // h2 "디자인 시안" 또는 "Design Gallery" 다음부터 다음 h2 직전까지의 콘텐츠 추출
  const re = /(<h2[^>]*>\s*디자인\s*시안[\s\S]*?<\/h2>)([\s\S]*?)(?=<h2|$)/i;
  return html.replace(re, (match, heading, body) => {
    // body 안에서 (h3 + p>img) 쌍들 추출
    const cardRe = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>\s*<img\s+([^>]*?)>\s*<\/p>/g;
    const cards: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = cardRe.exec(body)) !== null) {
      const label = stripTags(m[1]).trim();
      const imgAttrs = m[2];
      const altMatch = imgAttrs.match(/alt="([^"]*)"/);
      const alt = altMatch ? altMatch[1] : label;
      cards.push(`<div class="gallery-card">
  <div class="gallery-image-wrap">
    <div class="gallery-placeholder">
      <div class="gallery-placeholder-label">${escapeHtml(label)}</div>
      <div class="gallery-placeholder-sub">시안 추가 예정</div>
    </div>
    <img ${imgAttrs} class="gallery-image" data-fallback="show">
  </div>
  <div class="gallery-label">${escapeHtml(label)}</div>
</div>`);
    }
    if (cards.length === 0) return match;
    return `${heading}\n<div class="design-gallery">${cards.join('\n')}</div>`;
  });
}

/**
 * ## 헤딩을 *대시보드 카드*로 변환.
 *
 * 원본:
 *   <h2>One-liner</h2>
 *   <p>본문...</p>
 *   <ul>...</ul>
 *
 * 변환 후:
 *   <section class="ds-card">
 *     <div class="ds-eyebrow">ONE-LINER</div>
 *     <div class="markdown-body">
 *       <p>본문...</p>
 *       <ul>...</ul>
 *     </div>
 *   </section>
 *
 * h1 이전, 또는 h2 이전 콘텐츠는 그대로 둠.
 */
function transformHeadingsToCards(html: string): string {
  const parts = html.split(/(?=<h2\b)/);
  if (parts.length <= 1) return html;

  const head = parts[0];
  const sections = parts.slice(1).map(part => {
    const headingMatch = part.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/);
    if (!headingMatch) return part;
    const heading = stripTags(headingMatch[1]).toUpperCase();
    const body = part.slice(headingMatch[0].length).trim();
    return `<section class="ds-card">
  <div class="ds-eyebrow">${heading}</div>
  <div class="markdown-body">${body}</div>
</section>`;
  }).join('\n');

  return head + sections;
}

/**
 * NON-GOALS 섹션 안의 첫 <ul>을 빨간 ✗ grid로 변환.
 * PRODUCT.md의 핵심 강조 영역 (사용자 통증 #1: "Claude가 시키지 않은 거 자체 판단으로 추가").
 *
 * 표 (table) 도 같은 패턴 인식 — `## NON-GOALS` 다음에 `<table>` 있을 수도.
 */
function transformNonGoals(html: string): string {
  // <h2>NON-GOALS</h2> 다음의 첫 <ul>를 찾는다.
  const re = /(<h2[^>]*>\s*NON-?GOALS[\s\S]*?<\/h2>)([\s\S]*?)(<ul>[\s\S]*?<\/ul>)/i;
  return html.replace(re, (match, heading, between, ulBlock) => {
    const items = ulBlock.match(/<li>[\s\S]*?<\/li>/g) ?? [];
    if (items.length === 0) return match;
    const cards = items
      .map((li: string) => {
        const inner = li.replace(/^<li>|<\/li>$/g, '').trim();
        return `<div class="non-goal-card">
  <span class="non-goal-icon">✗</span>
  <span class="non-goal-text">${inner}</span>
</div>`;
      })
      .join('');
    return `${heading}${between}<div class="non-goal-grid">${cards}</div>`;
  });
}

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, '').trim();
}

/**
 * <code>#hex</code> 또는 <code>rgba(...)</code> 패턴을 감지해서
 * 옆에 실제 색깔 swatch (작은 박스)를 삽입한다.
 *
 * Airbnb design system 페이지 스타일 — 색깔이 시각적으로 보여야 가치.
 *
 * 지원 패턴:
 *   - #abc / #abcdef / #abcdef12
 *   - rgb(...), rgba(...)
 *   - hsl(...), hsla(...)
 */
function injectColorSwatches(html: string): string {
  // hex
  let out = html.replace(
    /<code>(#[0-9a-fA-F]{3,8})<\/code>/g,
    (_, hex) => buildSwatch(hex, hex),
  );
  // rgb / rgba / hsl / hsla
  out = out.replace(
    /<code>((?:rgb|rgba|hsl|hsla)\([^)]+\))<\/code>/g,
    (_, color) => buildSwatch(color, color),
  );
  return out;
}

function buildSwatch(cssColor: string, label: string): string {
  return `<span class="color-token"><span class="color-swatch" style="background:${cssColor}"></span><code>${label}</code></span>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function makeNonce(): string {
  let text = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

/**
 * 마크다운 체크박스 행을 시각적 HTML로 변환.
 * - "- [ ] text" → <div class="check-row pending"><span class="check-box"></span>text</div>
 * - "- [x] text" → <div class="check-row done"><span class="check-box checked">✓</span>text</div>
 *
 * 일반 마크다운 렌더로는 체크박스가 disabled input으로 나옴 → 직접 변환.
 */
export function renderChecklistMarkdown(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const out: string[] = [];
  let inChecklist = false;

  const flushList = () => {
    if (inChecklist) {
      out.push('</div>');
      inChecklist = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const checkMatch = trimmed.match(/^-\s*\[([ xX])\]\s*(.*)$/);
    const indentLevel = (line.match(/^\s*/)?.[0].length ?? 0) / 2; // 2 spaces = 1 level

    if (checkMatch) {
      if (!inChecklist) {
        out.push('<div class="check-list">');
        inChecklist = true;
      }
      const done = checkMatch[1].toLowerCase() === 'x';
      const text = checkMatch[2];
      const cls = done ? 'done' : 'pending';
      const icon = done ? '✓' : '';
      const indentCls = indentLevel > 0 ? ` indent-${Math.min(indentLevel, 3)}` : '';
      out.push(
        `<div class="check-row ${cls}${indentCls}"><span class="check-box ${cls}">${icon}</span><span class="check-text">${renderInlineMd(text)}</span></div>`,
      );
    } else {
      flushList();
      if (trimmed.startsWith('#')) {
        // 헤딩은 마크다운 렌더 통해서
        out.push(renderMarkdown(line));
      } else if (trimmed === '') {
        out.push('');
      } else {
        out.push(renderMarkdown(line));
      }
    }
  }
  flushList();
  return out.join('\n');
}

/**
 * 한 줄 인라인 마크다운 — **bold**, *italic*, `code`, [link](url) 처리.
 */
function renderInlineMd(text: string): string {
  // markdown-it의 renderInline 사용
  return md.renderInline(text);
}
