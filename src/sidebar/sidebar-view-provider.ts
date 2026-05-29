/**
 * Sidebar WebviewView Provider — V0+ 최종 6섹션 구조.
 *
 * 섹션 (위→아래):
 *  1. Hero    — 프로젝트명 + 폴더 경로 + 현재 phase + progress bar
 *  2. Phases  — 7개 phase 리스트 (현재 강조)
 *  3. Current focus — state.md의 next action 텍스트 (지금 다루는 것)
 *  4. Triggers — fired 알림
 *  5. Active file — 지금 편집 중인 파일 경로
 *  6. Recent changes — 최근 변경된 파일들 (최대 6개, 시간순)
 *
 * 데이터: extension.ts가 SidebarPayload 빌드해서 update() 호출.
 * 클릭: Phase row 클릭 → 가운데 webview에 산출물 띄움.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import {
  SidebarPayload,
  Phase,
  PhaseId,
  RecentChange,
  ActiveFileInfo,
  getProgress,
} from '../types';

export const SIDEBAR_VIEW_ID = 'blueprintState';

export class SidebarViewProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;
  private payload: SidebarPayload | null = null;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly onPhaseClick: (phaseId: PhaseId) => void,
  ) {}

  resolveWebviewView(
    view: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void | Thenable<void> {
    this.view = view;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.extensionUri.fsPath, 'out', 'sidebar')),
      ],
    };

    view.webview.onDidReceiveMessage(msg => {
      if (msg?.type === 'phase-click' && typeof msg.phaseId === 'number') {
        this.onPhaseClick(msg.phaseId as PhaseId);
      }
    });

    view.onDidDispose(() => {
      this.view = undefined;
    });

    this.refresh();
  }

  update(payload: SidebarPayload): void {
    this.payload = payload;
    this.refresh();
  }

  clear(): void {
    this.payload = null;
    this.refresh();
  }

  private refresh(): void {
    if (!this.view) return;
    this.view.webview.html = this.buildHtml();
  }

  private buildHtml(): string {
    if (!this.view) return '';

    const cssOnDisk = vscode.Uri.file(
      path.join(this.extensionUri.fsPath, 'out', 'sidebar', 'sidebar-styles.css'),
    );
    const cssUri = this.view.webview.asWebviewUri(cssOnDisk);
    const nonce = makeNonce();
    const csp = `default-src 'none'; style-src ${this.view.webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${this.view.webview.cspSource} data:;`;

    const body = this.payload?.state
      ? this.renderBody(this.payload)
      : this.renderEmpty();

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <link rel="stylesheet" href="${cssUri}" />
</head>
<body>
  <div class="sidebar">${body}</div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll('[data-phase-id]').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.getAttribute('data-phase-id'), 10);
        if (!isNaN(id)) vscode.postMessage({ type: 'phase-click', phaseId: id });
      });
    });
  </script>
</body>
</html>`;
  }

  private renderEmpty(): string {
    return `<div class="empty">
      <div class="empty-title">No blueprint detected</div>
      <div class="empty-sub">.blueprint/state.md not found in this folder.<br/>Run <code>/blueprint</code> to initialize.</div>
    </div>`;
  }

  private renderBody(payload: SidebarPayload): string {
    const { state, recentChanges, activeFile, workspaceFolderName, workspaceFolderPath } = payload;
    if (!state) return this.renderEmpty();

    return [
      renderHero(state, workspaceFolderName, workspaceFolderPath),
      renderPhases(state.phases),
      renderCurrentFocus(state.nextAction, state.phases),
      renderCheckpointKpi(state),
      renderTriggers(state.triggers),
      renderActiveFile(activeFile),
      renderRecentChanges(recentChanges),
    ].join('\n');
  }
}

// ─────────────────────────────────────────────────────────────────
// Section renderers
// ─────────────────────────────────────────────────────────────────

function renderHero(
  state: NonNullable<SidebarPayload['state']>,
  folderName: string,
  folderPath: string,
): string {
  const { done, total } = getProgress(state);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const active =
    state.phases.find(p => p.status === 'in_progress') ??
    state.phases.find(p => p.status === 'pending') ??
    state.phases[state.phases.length - 1];

  return `
    <div class="hero">
      <div class="hero-folder" title="${escapeHtml(folderPath)}">
        <span class="hero-folder-icon">📁</span>
        <span class="hero-folder-path">${escapeHtml(folderPath)}</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-phase-id">PHASE ${active.id}</div>
      <h1 class="hero-title">${escapeHtml(active.name)}</h1>
      <div class="progress-bar">
        <div class="progress-fill" style="${progressFillStyle(percent)}"></div>
      </div>
      <div class="progress-meta">
        <span>${done} / ${total}</span>
        <span>${percent}%</span>
      </div>
    </div>`;
}

function renderPhases(phases: Phase[]): string {
  return `
    <div class="card">
      <div class="card-heading">PHASES</div>
      ${phases.map(renderPhaseRow).join('')}
    </div>`;
}

function renderPhaseRow(phase: Phase): string {
  const meta = phase.completedAt ?? phase.meta ?? '';
  return `
    <div class="phase-row ${phase.status}" data-phase-id="${phase.id}">
      <div class="phase-circle ${phase.status}"></div>
      <span class="phase-id">P${phase.id}</span>
      <span class="phase-name">${escapeHtml(phase.name)}</span>
      <span class="phase-meta">${escapeHtml(meta)}</span>
    </div>`;
}

function renderCurrentFocus(nextAction: string, phases: Phase[]): string {
  const active =
    phases.find(p => p.status === 'in_progress') ??
    phases.find(p => p.status === 'pending');
  const label = active ? `Phase ${active.id} · ${active.name}` : 'No active phase';

  return `
    <div class="card">
      <div class="card-heading">CURRENT FOCUS</div>
      <div class="focus-label">${escapeHtml(label)}</div>
      <div class="focus-text">${escapeHtml(nextAction || '—')}</div>
    </div>`;
}

function renderCheckpointKpi(state: NonNullable<SidebarPayload['state']>): string {
  const { checkpoint_count, last_check, ships_since_checkpoint } = state.counters;
  const dueSoon = ships_since_checkpoint >= 5;
  return `
    <div class="card ${dueSoon ? 'card-alert' : ''}">
      <div class="card-heading">CHECKPOINTS</div>
      <div class="kpi-row">
        <div class="kpi-block">
          <div class="kpi-value">${escapeHtml(String(checkpoint_count))}</div>
          <div class="kpi-label">runs</div>
        </div>
        <div class="kpi-block">
          <div class="kpi-value">${escapeHtml(String(ships_since_checkpoint))}</div>
          <div class="kpi-label">ships since</div>
        </div>
      </div>
      <div class="kpi-meta">last: ${escapeHtml(last_check || '—')}</div>
    </div>`;
}

function renderTriggers(triggers: string[]): string {
  const hasAlert = triggers.length > 0;
  const body = hasAlert
    ? `<ul class="triggers-list">${triggers.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
    : `<div class="triggers-empty">none fired</div>`;
  return `
    <div class="card ${hasAlert ? 'card-alert' : ''}">
      <div class="card-heading">TRIGGERS</div>
      ${body}
    </div>`;
}

function renderActiveFile(info: ActiveFileInfo): string {
  if (!info.relativePath) {
    return `
      <div class="card">
        <div class="card-heading">ACTIVE FILE</div>
        <div class="active-file-empty">no editor focused</div>
      </div>`;
  }

  const lang = info.language ? `<span class="active-file-lang">${escapeHtml(info.language)}</span>` : '';
  return `
    <div class="card">
      <div class="card-heading">ACTIVE FILE</div>
      <div class="active-file-row">
        <div class="active-file-path">${escapeHtml(info.relativePath)}</div>
        ${lang}
      </div>
    </div>`;
}

function renderRecentChanges(changes: RecentChange[]): string {
  if (changes.length === 0) {
    return `
      <div class="card">
        <div class="card-heading">RECENT CHANGES</div>
        <div class="recent-empty">no changes yet</div>
      </div>`;
  }

  const rows = changes
    .slice(0, 6)
    .map(c => `
      <div class="recent-row">
        <span class="recent-time">${escapeHtml(formatRelativeTime(c.changedAt))}</span>
        <span class="recent-path">${escapeHtml(shortPath(c.relativePath))}</span>
      </div>`)
    .join('');

  return `
    <div class="card">
      <div class="card-heading">RECENT CHANGES</div>
      <div class="recent-list">${rows}</div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function progressFillStyle(percent: number): string {
  if (percent <= 0) return 'width: 0';
  const bgSize = Math.min((100 / percent) * 100, 5000);
  return `width: ${percent}%; background-size: ${bgSize.toFixed(2)}% 100%`;
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return '방금';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

function shortPath(relPath: string): string {
  // 전체 경로 보여주되, 마지막 파일명을 강조 (그냥 표시는 그대로)
  // 너무 길면 끝부분만
  if (relPath.length <= 40) return relPath;
  return '...' + relPath.slice(-37);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function makeNonce(): string {
  let text = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}
