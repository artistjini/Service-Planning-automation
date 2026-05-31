/**
 * Sidebar WebviewView Provider — iOS Settings 플랫 구조.
 *
 * 섹션 (위→아래):
 *  BLUEPRINT    — Workspace path + current phase + progress bar
 *  PHASES       — 7개 phase 리스트 (클릭 → webview)
 *  CURRENT FOCUS — state.md next action
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
  getProgress,
} from '../types';

export const SIDEBAR_VIEW_ID = 'blueprintState';

const output = vscode.window.createOutputChannel('Blueprint Dashboard');

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
    try {
      this.view = view;
      view.webview.options = {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this.extensionUri.fsPath, 'out', 'sidebar')),
          vscode.Uri.file(path.join(this.extensionUri.fsPath, 'out', 'fonts')),
        ],
      };

      view.webview.onDidReceiveMessage(msg => {
        if (msg?.type === 'phase-click' && typeof msg.phaseId === 'number') {
          this.onPhaseClick(msg.phaseId as PhaseId);
        } else {
          output.appendLine(`[WARN] unknown message: ${JSON.stringify(msg)}`);
        }
      });

      view.onDidDispose(() => {
        this.view = undefined;
      });

      this.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      output.appendLine(`[ERROR] resolveWebviewView: ${msg}`);
      output.show(true);
    }
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
    try {
      this.view.webview.html = this.buildHtml();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      output.appendLine(`[ERROR] refresh: ${msg}`);
      output.show(true);
    }
  }

  private buildHtml(): string {
    if (!this.view) return '';

    const cssOnDisk = vscode.Uri.file(
      path.join(this.extensionUri.fsPath, 'out', 'sidebar', 'sidebar-styles.css'),
    );
    const cssUri = this.view.webview.asWebviewUri(cssOnDisk);
    const nonce = makeNonce();
    // 'unsafe-inline' 필수 — progress bar inline width style 적용을 위해.
    const csp = `default-src 'none'; style-src ${this.view.webview.cspSource} 'unsafe-inline'; font-src ${this.view.webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${this.view.webview.cspSource} data:;`;

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
    const { state, workspaceFolderPath } = payload;
    if (!state) return this.renderEmpty();

    return [
      renderBlueprint(state, workspaceFolderPath),
      renderPhasesSection(state.phases),
      renderCurrentFocusSection(state.nextAction, state.phases),
    ].join('\n');
  }
}

// ─────────────────────────────────────────────────────────────────
// Section renderers
// ─────────────────────────────────────────────────────────────────

function renderBlueprint(
  state: NonNullable<SidebarPayload['state']>,
  folderPath: string,
): string {
  const { done, total } = getProgress(state);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const active =
    state.phases.find(p => p.status === 'in_progress') ??
    state.phases.find(p => p.status === 'pending') ??
    state.phases[state.phases.length - 1];

  return `
    <div class="kick">BLUEPRINT</div>
    <div class="group">
      <div class="row">
        <div class="lab">Workspace</div>
        <div class="path">${escapeHtml(folderPath)}</div>
      </div>
      <div class="row">
        <div class="phase-id">PHASE ${active.id}</div>
        <h1 class="phase-h">${escapeHtml(active.name)}</h1>
        <div class="bar"><span class="bar-fill" style="width: ${percent}%"></span></div>
        <div class="meta">
          <span>${done} / ${total} phases</span>
          <span>${percent}%</span>
        </div>
      </div>
    </div>`;
}

function renderPhasesSection(phases: Phase[]): string {
  return `
    <div class="kick">PHASES</div>
    <div class="group">
      ${phases.map(renderPhaseRow).join('')}
    </div>`;
}

function renderPhaseRow(phase: Phase): string {
  const meta = phase.completedAt ?? phase.meta ?? '';
  const dot =
    phase.status === 'done'
      ? `<span class="dot done"><svg width="9" height="9" viewBox="0 0 10 10"><path d="M1.5 5.2 4 7.5 8.5 2.5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
      : `<span class="dot ${phase.status}"></span>`;

  return `
    <div class="p-row ${phase.status}" data-phase-id="${phase.id}">
      ${dot}
      <span class="pid">P${phase.id}</span>
      <span class="pname">${escapeHtml(phase.name)}</span>
      <span class="pdate">${escapeHtml(meta)}</span>
    </div>`;
}

function renderCurrentFocusSection(nextAction: string, phases: Phase[]): string {
  const active =
    phases.find(p => p.status === 'in_progress') ??
    phases.find(p => p.status === 'pending');
  const label = active ? `PHASE ${active.id} · ${active.name}` : 'ALL DONE';

  return `
    <div class="kick">CURRENT FOCUS</div>
    <div class="group">
      <div class="row">
        <div class="focus-label">${escapeHtml(label)}</div>
        <div class="focus-text">${escapeHtml(nextAction || '—')}</div>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

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
