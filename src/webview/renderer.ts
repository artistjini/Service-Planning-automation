/**
 * 마크다운 → HTML 렌더러.
 *
 * markdown-it 기반. V0+엔 기본 GFM 수준만.
 * V2에서 hex 패턴 → swatch, 폰트 → 샘플, mermaid 다이어그램 등 확장 추가.
 */

import MarkdownIt from 'markdown-it';
import { BlueprintState, Phase, getProgress } from '../types';

const md = new MarkdownIt({
  html: false,        // .md 안의 raw HTML은 무시 (보안)
  linkify: true,
  typographer: false, // 한국어 따옴표 손상 방지
  breaks: false,
});

/**
 * 산출물 .md를 페이지 메인 콘텐츠 영역의 HTML로 렌더.
 * (헤더·진행도는 renderStatePage에서 따로 처리)
 */
export function renderMarkdown(markdown: string): string {
  return md.render(markdown);
}

/**
 * V0+ 메인 페이지 — state.md 기반 hero + counters + triggers + decisions.
 *
 * `optionalArtifact`가 주어지면 페이지 하단에 산출물 .md HTML도 같이 렌더.
 */
export function renderStatePage(
  state: BlueprintState,
  optionalArtifactMarkdown?: string,
  optionalArtifactPath?: string,
): string {
  const { done, total } = getProgress(state);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const activePhase = state.phases.find(p => p.status === 'in_progress')
    ?? state.phases.find(p => p.status === 'pending')
    ?? state.phases[state.phases.length - 1];

  const triggerSection = state.triggers.length === 0
    ? `<p class="muted">no triggers fired</p>`
    : `<ul class="triggers">${state.triggers
        .map(t => `<li>${escapeHtml(t)}</li>`)
        .join('')}</ul>`;

  const counterCards = Object.entries(state.counters)
    .map(([key, value]) => `
      <div class="counter-card">
        <div class="counter-value">${escapeHtml(String(value))}</div>
        <div class="counter-label">${escapeHtml(humanizeCounterKey(key))}</div>
      </div>`)
    .join('');

  const decisionsList = state.decisions.length === 0
    ? `<p class="muted">no decisions yet</p>`
    : state.decisions.slice(0, 10).map(d => `
        <div class="decision-row">
          <span class="decision-date">${escapeHtml(d.date)}</span>
          <span class="decision-text">${escapeHtml(d.text)}</span>
        </div>`).join('');

  const phaseList = state.phases.map(p => `
    <li class="phase-row ${p.status}">
      <span class="phase-icon">${phaseIconChar(p)}</span>
      <span class="phase-id">Phase ${p.id}</span>
      <span class="phase-name">${escapeHtml(p.name)}</span>
      <span class="phase-meta">${escapeHtml(p.completedAt ?? p.meta ?? '')}</span>
    </li>`).join('');

  const artifactSection = optionalArtifactMarkdown
    ? `
      <hr class="section-divider" />
      <div class="artifact-card">
        <div class="artifact-eyebrow">${escapeHtml(optionalArtifactPath ?? '')}</div>
        <div class="artifact-content">${renderMarkdown(optionalArtifactMarkdown)}</div>
      </div>`
    : '';

  return `
    <div class="hero-card">
      <div class="eyebrow">${escapeHtml(state.project)}</div>
      <div class="phase-id-label">Phase ${activePhase.id}</div>
      <h1 class="hero-title">${escapeHtml(activePhase.name)}</h1>

      <div class="progress-row">
        <div class="progress-track">
          <div class="progress-fill" style="width: ${percent}%"></div>
        </div>
        <div class="progress-text">${done} / ${total}</div>
      </div>

      <div class="next-action">
        <span class="next-action-label">Next</span>
        <span class="next-action-text">${escapeHtml(state.nextAction || '—')}</span>
      </div>
    </div>

    <div class="card">
      <h2 class="card-heading">All phases</h2>
      <ul class="phase-list">${phaseList}</ul>
    </div>

    <div class="card">
      <h2 class="card-heading">Counters</h2>
      <div class="counter-grid">${counterCards}</div>
    </div>

    <div class="card ${state.triggers.length > 0 ? 'card-alert' : ''}">
      <h2 class="card-heading">Triggers fired</h2>
      ${triggerSection}
    </div>

    <div class="card">
      <h2 class="card-heading">Decisions log</h2>
      <div class="decisions">${decisionsList}</div>
    </div>

    ${artifactSection}
  `;
}

// ─────────────────────────────────────────────────────────────────

function phaseIconChar(phase: Phase): string {
  if (phase.status === 'done') return '✓';
  if (phase.status === 'in_progress') return '●';
  return '○';
}

function humanizeCounterKey(key: string): string {
  const map: Record<string, string> = {
    ships_since_checkpoint: 'ships since checkpoint',
    last_check: 'last checkpoint',
    checkpoint_count: 'checkpoints total',
    plans_without_arch_read: 'plans w/o arch read',
  };
  return map[key] ?? key.replace(/_/g, ' ');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
