/**
 * Extension entry point — VS Code가 호출하는 activate / deactivate.
 *
 * 책임 (orchestrator):
 *   - 워크스페이스 폴더 식별
 *   - file-watcher, parser, sidebar, webview 도메인 wire-up
 *   - 모든 .md 초기 로드 (state, roadmap, PRODUCT/DESIGN/ARCH, error.history)
 *   - 명령 등록 (blueprint.showDashboard / refresh / showArtifact / preview)
 *
 * 데이터 흐름:
 *   .md 변경 → watcher → 해당 파일 다시 읽음 → panel/sidebar setter 호출
 *   active editor 변경 → SidebarPayload 새로 빌드 → sidebar.update
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileWatcher } from './file-watcher/watcher';
import { parseState } from './parser/state';
import { SidebarViewProvider, SIDEBAR_VIEW_ID } from './sidebar/sidebar-view-provider';
import { BlueprintWebviewPanel, TabId } from './webview/panel';
import { ERROR_HISTORY_TEMPLATE } from './webview/pages/errors';
import {
  PhaseId,
  FileChangeEvent,
  BlueprintState,
  SidebarPayload,
  ActiveFileInfo,
} from './types';

let watcher: FileWatcher | undefined;
let sidebarProvider: SidebarViewProvider | undefined;
let webviewPanel: BlueprintWebviewPanel | undefined;
let currentState: BlueprintState | null = null;
let currentFolder: vscode.WorkspaceFolder | undefined;

const RELATIVE_PATHS = {
  state: '.blueprint/state.md',
  roadmap: 'plans/roadmap.md',
  product: 'docs/PRODUCT.md',
  design: 'docs/DESIGN.md',
  architecture: 'docs/ARCHITECTURE.md',
  errorHistory: 'docs/error.history.md',
};

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return;
  currentFolder = folders[0];

  // ── Webview 패널 ──
  webviewPanel = new BlueprintWebviewPanel(context, currentFolder, {
    onCreateErrorHistory: () => createErrorHistory(),
  });

  // ── Sidebar Webview Provider ──
  sidebarProvider = new SidebarViewProvider(
    vscode.Uri.file(context.extensionPath),
    (phaseId: PhaseId) => {
      void webviewPanel?.showArtifact(phaseId);
    },
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SIDEBAR_VIEW_ID, sidebarProvider, {
      webviewOptions: { retainContextWhenHidden: true },
    }),
  );

  // ── File watcher ──
  watcher = new FileWatcher(currentFolder);
  watcher.start();
  watcher.on('file-changed', (event: FileChangeEvent) => {
    void handleFileChange(event);
  });

  // ── 활성 에디터 변경 ──
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => refreshSidebar()),
  );

  // ── 초기 로드 (모든 .md 읽어서 panel/sidebar에 전달) ──
  await loadAll();

  // ── 명령 등록 ──
  context.subscriptions.push(
    vscode.commands.registerCommand('blueprint.showDashboard', (tab?: TabId) => {
      webviewPanel?.show(tab);
    }),
    vscode.commands.registerCommand('blueprint.refresh', async () => {
      await loadAll();
    }),
    vscode.commands.registerCommand(
      'blueprint.showArtifact',
      async (phaseId: PhaseId) => {
        await webviewPanel?.showArtifact(phaseId);
      },
    ),
    vscode.commands.registerCommand(
      'blueprint.preview',
      async (filePath: string) => {
        await pushPreview(filePath);
      },
    ),
  );

  // ── 정리 ──
  context.subscriptions.push({
    dispose: () => {
      watcher?.dispose();
      webviewPanel?.dispose();
      watcher = undefined;
      webviewPanel = undefined;
      sidebarProvider = undefined;
      currentState = null;
      currentFolder = undefined;
    },
  });
}

// ─────────────────────────────────────────────────────────────────
// File change → 분기
// ─────────────────────────────────────────────────────────────────

async function handleFileChange(event: FileChangeEvent): Promise<void> {
  if (!currentFolder) return;
  const rel = path
    .relative(currentFolder.uri.fsPath, event.path)
    .replace(/\\/g, '/');

  switch (rel) {
    case RELATIVE_PATHS.state:
      await reloadState();
      break;
    case RELATIVE_PATHS.roadmap:
      await reloadRoadmap();
      break;
    case RELATIVE_PATHS.product:
      await reloadArtifact('product');
      break;
    case RELATIVE_PATHS.design:
      await reloadArtifact('design');
      break;
    case RELATIVE_PATHS.architecture:
      await reloadArtifact('architecture');
      break;
    case RELATIVE_PATHS.errorHistory:
      await reloadErrorHistory();
      break;
  }

  // 사이드바는 모든 변경마다 refresh (recent changes 갱신)
  refreshSidebar();
}

// ─────────────────────────────────────────────────────────────────
// Loaders
// ─────────────────────────────────────────────────────────────────

async function loadAll(): Promise<void> {
  await Promise.all([
    reloadState(),
    reloadRoadmap(),
    reloadArtifact('product'),
    reloadArtifact('design'),
    reloadArtifact('architecture'),
    reloadErrorHistory(),
  ]);
  refreshSidebar();
}

async function reloadState(): Promise<void> {
  if (!currentFolder) return;
  const md = await readFileSafe(currentFolder, RELATIVE_PATHS.state);
  currentState = md ? parseState(md) : null;
  webviewPanel?.setBlueprintState(currentState);
}

async function reloadRoadmap(): Promise<void> {
  if (!currentFolder) return;
  const md = await readFileSafe(currentFolder, RELATIVE_PATHS.roadmap);
  webviewPanel?.setRoadmap(md);
}

async function reloadArtifact(kind: 'product' | 'design' | 'architecture'): Promise<void> {
  if (!currentFolder) return;
  const relPath = RELATIVE_PATHS[kind];
  const md = await readFileSafe(currentFolder, relPath);
  webviewPanel?.setSpecArtifacts({ [kind]: md });
}

async function reloadErrorHistory(): Promise<void> {
  if (!currentFolder) return;
  const md = await readFileSafe(currentFolder, RELATIVE_PATHS.errorHistory);
  webviewPanel?.setErrorHistory(md);
}

// ─────────────────────────────────────────────────────────────────
// Preview push
// ─────────────────────────────────────────────────────────────────

async function pushPreview(filePathInput: string): Promise<void> {
  if (!currentFolder) return;
  // 워크스페이스 상대 경로 또는 절대 경로 둘 다 허용
  let fullPath = filePathInput;
  if (!path.isAbsolute(filePathInput)) {
    fullPath = path.join(currentFolder.uri.fsPath, filePathInput);
  }
  try {
    const html = await fs.promises.readFile(fullPath, 'utf-8');
    const rel = path.relative(currentFolder.uri.fsPath, fullPath).replace(/\\/g, '/');
    webviewPanel?.setPreviewContent(html, rel);
  } catch (err) {
    vscode.window.showErrorMessage(`Blueprint: 파일을 읽을 수 없음 — ${filePathInput}`);
  }
}

// ─────────────────────────────────────────────────────────────────
// Errors page — 파일 생성
// ─────────────────────────────────────────────────────────────────

async function createErrorHistory(): Promise<void> {
  if (!currentFolder) return;
  const fullPath = path.join(currentFolder.uri.fsPath, RELATIVE_PATHS.errorHistory);
  try {
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, ERROR_HISTORY_TEMPLATE, 'utf-8');
    await reloadErrorHistory();
    vscode.window.showInformationMessage('Blueprint: error.history.md 생성됨.');
  } catch (err) {
    vscode.window.showErrorMessage(`Blueprint: 파일 생성 실패 — ${String(err)}`);
  }
}

// ─────────────────────────────────────────────────────────────────
// Sidebar payload
// ─────────────────────────────────────────────────────────────────

function refreshSidebar(): void {
  if (!sidebarProvider || !currentFolder) return;
  sidebarProvider.update(buildSidebarPayload(currentFolder));
}

function buildSidebarPayload(folder: vscode.WorkspaceFolder): SidebarPayload {
  return {
    state: currentState,
    recentChanges: watcher?.getRecentChanges() ?? [],
    activeFile: getActiveFile(folder),
    workspaceFolderName: path.basename(folder.uri.fsPath),
    workspaceFolderPath: folder.uri.fsPath,
  };
}

function getActiveFile(folder: vscode.WorkspaceFolder): ActiveFileInfo {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return { relativePath: null, language: null };
  const fileFsPath = editor.document.uri.fsPath;
  const folderFs = folder.uri.fsPath;
  if (!fileFsPath.toLowerCase().startsWith(folderFs.toLowerCase())) {
    return { relativePath: path.basename(fileFsPath), language: editor.document.languageId };
  }
  const rel = path.relative(folderFs, fileFsPath).replace(/\\/g, '/');
  return { relativePath: rel, language: editor.document.languageId };
}

// ─────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────

async function readFileSafe(folder: vscode.WorkspaceFolder, relPath: string): Promise<string | null> {
  const full = path.join(folder.uri.fsPath, relPath);
  try {
    return await fs.promises.readFile(full, 'utf-8');
  } catch {
    return null;
  }
}

export function deactivate(): void {
  watcher?.dispose();
  webviewPanel?.dispose();
  watcher = undefined;
  webviewPanel = undefined;
  sidebarProvider = undefined;
  currentState = null;
  currentFolder = undefined;
}
