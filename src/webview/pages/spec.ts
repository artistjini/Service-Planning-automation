/**
 * Spec 페이지 — 폴더 탐색기 풍 (V0.4+ 채택안).
 *
 * 좌측: 트리 (PRODUCT/DESIGN/ARCHITECTURE 폴더 → 각 ## 섹션을 file로)
 * 우측: 선택한 섹션을 풀-너비 마크다운 렌더 (## 카드 변환 X — 이미 섹션 단위)
 *
 * 클릭 → postMessage('spec-select') → panel이 specActiveSection 갱신 → refresh.
 */

import { extractSections, renderMarkdownSection, escapeHtml, MarkdownSection } from '../shared';

export interface SpecArtifacts {
  product: string | null;
  design: string | null;
  architecture: string | null;
}

const FOLDER_LABELS: Record<string, string> = {
  product: 'PRODUCT.md',
  design: 'DESIGN.md',
  architecture: 'ARCHITECTURE.md',
};

export type SpecFolderKey = 'product' | 'design' | 'architecture';

/**
 * `${folder}:${sectionId}` 형식. 예: "product:non-goals"
 */
export type SpecActiveSelection = string;

export function renderSpecPage(
  artifacts: SpecArtifacts,
  active?: SpecActiveSelection,
  focusedFolder?: SpecFolderKey,
): string {
  // 각 폴더의 섹션 추출
  const folders: Array<[SpecFolderKey, MarkdownSection[]]> = [
    ['product', artifacts.product ? extractSections(artifacts.product) : []],
    ['design', artifacts.design ? extractSections(artifacts.design) : []],
    ['architecture', artifacts.architecture ? extractSections(artifacts.architecture) : []],
  ];

  // 활성 선택 결정
  let activeFolder: SpecFolderKey;
  let activeSectionId: string;
  if (active) {
    const [f, sid] = active.split(':');
    activeFolder = (f as SpecFolderKey);
    activeSectionId = sid;
  } else if (focusedFolder) {
    activeFolder = focusedFolder;
    activeSectionId = folders.find(([k]) => k === focusedFolder)?.[1]?.[0]?.id ?? '';
  } else {
    // 첫 사용 가능한 폴더의 첫 섹션
    const firstAvail = folders.find(([, secs]) => secs.length > 0);
    activeFolder = firstAvail?.[0] ?? 'product';
    activeSectionId = firstAvail?.[1]?.[0]?.id ?? '';
  }

  const hasAny = folders.some(([, secs]) => secs.length > 0);
  if (!hasAny) {
    return `
      <div class="page-hero">
        <div class="page-eyebrow">SPEC</div>
        <h1 class="page-title">No artifacts yet</h1>
        <p class="page-subtitle">docs/ 에 PRODUCT.md / DESIGN.md / ARCHITECTURE.md 가 없습니다.</p>
      </div>`;
  }

  // 트리 렌더
  const treeHtml = folders.map(([folder, sections]) => {
    if (sections.length === 0) return '';
    const open = folder === activeFolder ? 'open' : '';
    const rows = sections.map(s => {
      const isActive = folder === activeFolder && s.id === activeSectionId ? 'active' : '';
      const icon = sectionIcon(folder, s.heading);
      return `<li><button type="button" class="spec-row ${isActive}" data-spec-select="${folder}:${s.id}">
        <span class="spec-icon">${icon}</span>
        <span class="spec-label">${escapeHtml(s.heading)}</span>
      </button></li>`;
    }).join('');
    return `<li class="spec-folder ${open}">
      <button type="button" class="spec-row spec-folder-row" data-spec-folder-toggle="${folder}">
        <span class="spec-chevron">▶</span>
        <span class="spec-icon">📁</span>
        <span class="spec-label">${FOLDER_LABELS[folder]}</span>
        <span class="spec-meta">${sections.length}</span>
      </button>
      <ul class="spec-children">${rows}</ul>
    </li>`;
  }).join('');

  // 활성 섹션 콘텐츠
  const activeSections = folders.find(([k]) => k === activeFolder)?.[1] ?? [];
  const activeSection = activeSections.find(s => s.id === activeSectionId) ?? activeSections[0];
  const contentHtml = activeSection
    ? `<div class="spec-breadcrumb">
         <span>docs/</span>
         <span class="spec-bc-sep">›</span>
         <span>${escapeHtml(FOLDER_LABELS[activeFolder])}</span>
         <span class="spec-bc-sep">›</span>
         <span class="spec-bc-leaf">${escapeHtml(activeSection.heading)}</span>
       </div>
       <div class="markdown-body spec-content-body">
         ${renderMarkdownSection(activeSection.content)}
       </div>`
    : `<div class="spec-empty-detail">섹션을 선택하세요</div>`;

  return `
    <div class="page-hero">
      <div class="page-eyebrow">SPEC · EXPLORER</div>
      <h1 class="page-title">기획 명세</h1>
      <p class="page-subtitle">좌측에서 폴더 펼치고 ## 섹션을 클릭. 우측에 풀-너비 렌더.</p>
    </div>

    <div class="spec-explorer">
      <aside class="spec-tree-pane">
        <div class="spec-tree-header">DOCS</div>
        <ul class="spec-tree">${treeHtml}</ul>
      </aside>
      <main class="spec-content-pane">
        ${contentHtml}
      </main>
    </div>`;
}

function sectionIcon(folder: SpecFolderKey, heading: string): string {
  const h = heading.toLowerCase();
  if (h.includes('non-goals') || h.includes('non goals')) return '🚫';
  if (h.includes('색') || h.includes('color')) return '🎨';
  if (h.includes('타이포') || h.includes('typography')) return '🔤';
  if (h.includes('디자인 시안') || h.includes('screenshot')) return '🖼️';
  if (h.includes('stack')) return '⚙️';
  if (h.includes('domain map') || h.includes('도메인 맵')) return '🗺️';
  if (h.includes('performance')) return '⚡';
  if (h.includes('adr')) return '📋';
  return '📄';
}
