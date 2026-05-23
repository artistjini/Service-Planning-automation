/**
 * Spec 페이지 — PRODUCT/DESIGN/ARCHITECTURE.md 풀-너비 렌더.
 *
 * 내부 네비게이션: 상단 anchor nav (PRODUCT / DESIGN / ARCHITECTURE)
 * 각 섹션 풀-너비 카드.
 *
 * 디자인 시각화는 V1+ (DESIGN.md 의 hex/폰트 자동 추출). V0+엔 단순 마크다운 렌더.
 */

import { renderMarkdown, escapeHtml } from '../shared';

export interface SpecArtifacts {
  product: string | null;     // docs/PRODUCT.md 내용
  design: string | null;      // docs/DESIGN.md
  architecture: string | null;// docs/ARCHITECTURE.md
}

export function renderSpecPage(artifacts: SpecArtifacts, focusedSection?: 'product' | 'design' | 'architecture'): string {
  const hasAny = artifacts.product || artifacts.design || artifacts.architecture;
  if (!hasAny) {
    return `
      <div class="page-hero">
        <div class="page-eyebrow">SPEC</div>
        <h1 class="page-title">No artifacts yet</h1>
        <p class="page-subtitle">docs/ 폴더에 PRODUCT.md, DESIGN.md, ARCHITECTURE.md 가 없습니다.</p>
      </div>`;
  }

  const sections: Array<['product' | 'design' | 'architecture', string, string | null]> = [
    ['product', 'PRODUCT', artifacts.product],
    ['design', 'DESIGN', artifacts.design],
    ['architecture', 'ARCHITECTURE', artifacts.architecture],
  ];

  const available = sections.filter(([, , md]) => md !== null);
  // 초기 active 섹션: 사이드바 Phase 클릭으로 지정됐으면 그것, 아니면 첫 번째
  const activeKey = focusedSection ?? available[0]?.[0];

  const navLinks = available
    .map(([key, label]) => {
      const active = activeKey === key ? 'active' : '';
      return `<button type="button" class="anchor-link ${active}" data-spec-target="section-${key}">${label}</button>`;
    })
    .join('');

  const sectionsHtml = available
    .map(([key, label, mdContent]) => {
      const active = activeKey === key ? 'active' : '';
      return `
      <section class="spec-section-flat ${active}" id="section-${key}">
        <div class="spec-section-eyebrow">${label}</div>
        <div class="markdown-body">
          ${renderMarkdown(mdContent!)}
        </div>
      </section>`;
    })
    .join('');

  return `
    <div class="page-hero">
      <div class="page-eyebrow">SPEC</div>
      <h1 class="page-title">기획 명세</h1>
      <p class="page-subtitle">PRODUCT · DESIGN · ARCHITECTURE 전체 산출물</p>
    </div>
    <nav class="anchor-nav">
      ${navLinks}
    </nav>
    ${sectionsHtml}`;
}
