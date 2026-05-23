/**
 * 사이드바 TreeView 데이터 제공자.
 *
 * 5개 그룹:
 *   1. Phase progress (7개 phase, 체크 상태)
 *   2. Next action (한 줄)
 *   3. Triggers fired (있을 때만 강조)
 *   4. Counters (4개 KPI)
 *   5. Decisions log (최근 5개)
 *
 * 각 phase 항목 클릭 → `blueprint.showArtifact` 명령 발동 → webview에 해당 산출물 띄움.
 */

import * as vscode from 'vscode';
import {
  BlueprintState,
  Phase,
  PhaseId,
  PHASE_NAMES,
  getProgress,
} from '../types';

type TreeNode =
  | { kind: 'group'; id: string; label: string; description?: string }
  | { kind: 'phase'; phase: Phase }
  | { kind: 'next-action'; text: string }
  | { kind: 'trigger'; text: string }
  | { kind: 'trigger-empty' }
  | { kind: 'counter'; key: string; label: string; value: string }
  | { kind: 'decision'; date: string; text: string };

const COUNTER_LABELS: Record<string, string> = {
  ships_since_checkpoint: 'Ships since last checkpoint',
  last_check: 'Last checkpoint',
  checkpoint_count: 'Total checkpoints',
  plans_without_arch_read: 'Plans w/o ARCH read',
};

export class BlueprintTreeDataProvider
  implements vscode.TreeDataProvider<TreeNode>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeNode | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private state: BlueprintState | null = null;

  update(state: BlueprintState): void {
    this.state = state;
    this._onDidChangeTreeData.fire(undefined);
  }

  /**
   * state 없을 때 (state.md 없는 워크스페이스) 안내 표시.
   */
  clear(): void {
    this.state = null;
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(node: TreeNode): vscode.TreeItem {
    switch (node.kind) {
      case 'group': {
        const item = new vscode.TreeItem(
          node.label,
          vscode.TreeItemCollapsibleState.Expanded,
        );
        if (node.description) item.description = node.description;
        item.contextValue = `group:${node.id}`;
        return item;
      }

      case 'phase': {
        const item = new vscode.TreeItem(
          `Phase ${node.phase.id}: ${node.phase.name}`,
          vscode.TreeItemCollapsibleState.None,
        );
        item.description = phaseDescription(node.phase);
        item.iconPath = phaseIcon(node.phase);
        item.tooltip = phaseTooltip(node.phase);
        item.contextValue = 'phase';
        item.command = {
          command: 'blueprint.showArtifact',
          title: 'Show artifact',
          arguments: [node.phase.id],
        };
        return item;
      }

      case 'next-action': {
        const item = new vscode.TreeItem(
          node.text || '(no next action)',
          vscode.TreeItemCollapsibleState.None,
        );
        item.iconPath = new vscode.ThemeIcon('arrow-right');
        item.tooltip = 'Next action — from state.md';
        return item;
      }

      case 'trigger': {
        const item = new vscode.TreeItem(
          node.text,
          vscode.TreeItemCollapsibleState.None,
        );
        item.iconPath = new vscode.ThemeIcon(
          'warning',
          new vscode.ThemeColor('errorForeground'),
        );
        item.tooltip = 'Trigger fired — consider running /blueprint check';
        item.contextValue = 'trigger';
        return item;
      }

      case 'trigger-empty': {
        const item = new vscode.TreeItem(
          '(none)',
          vscode.TreeItemCollapsibleState.None,
        );
        item.description = 'no triggers fired';
        return item;
      }

      case 'counter': {
        const item = new vscode.TreeItem(
          node.label,
          vscode.TreeItemCollapsibleState.None,
        );
        item.description = node.value;
        return item;
      }

      case 'decision': {
        const item = new vscode.TreeItem(
          node.date,
          vscode.TreeItemCollapsibleState.None,
        );
        item.description = node.text;
        item.tooltip = `${node.date}: ${node.text}`;
        return item;
      }
    }
  }

  getChildren(node?: TreeNode): TreeNode[] {
    // state 없으면 안내 메시지 하나
    if (!this.state) {
      return [
        {
          kind: 'next-action',
          text: '.blueprint/state.md not found',
        },
      ];
    }

    // 루트 (그룹들)
    if (!node) {
      return this.rootGroups();
    }

    // 그룹 펼침 시
    if (node.kind === 'group') {
      switch (node.id) {
        case 'progress':
          return this.state.phases.map(p => ({ kind: 'phase' as const, phase: p }));
        case 'next-action':
          return [{ kind: 'next-action', text: this.state.nextAction }];
        case 'triggers':
          if (this.state.triggers.length === 0) return [{ kind: 'trigger-empty' }];
          return this.state.triggers.map(t => ({ kind: 'trigger' as const, text: t }));
        case 'counters':
          return Object.entries(this.state.counters).map(([key, value]) => ({
            kind: 'counter' as const,
            key,
            label: COUNTER_LABELS[key] ?? key,
            value: String(value),
          }));
        case 'decisions':
          return this.state.decisions.slice(0, 5).map(d => ({
            kind: 'decision' as const,
            date: d.date,
            text: d.text,
          }));
      }
    }

    return [];
  }

  private rootGroups(): TreeNode[] {
    if (!this.state) return [];
    const { done, total } = getProgress(this.state);
    const bar = progressBar(done, total);
    const triggerCount = this.state.triggers.length;

    return [
      {
        kind: 'group',
        id: 'progress',
        label: 'Phase progress',
        description: `${bar} ${done}/${total}`,
      },
      {
        kind: 'group',
        id: 'next-action',
        label: 'Next action',
      },
      {
        kind: 'group',
        id: 'triggers',
        label: 'Triggers fired',
        description: triggerCount > 0 ? `● ${triggerCount}` : undefined,
      },
      {
        kind: 'group',
        id: 'counters',
        label: 'Counters',
      },
      {
        kind: 'group',
        id: 'decisions',
        label: 'Decisions log',
        description: this.state.decisions.length
          ? `${this.state.decisions.length} entries`
          : undefined,
      },
    ];
  }
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function phaseIcon(phase: Phase): vscode.ThemeIcon {
  switch (phase.status) {
    case 'done':
      return new vscode.ThemeIcon('check', new vscode.ThemeColor('charts.green'));
    case 'in_progress':
      return new vscode.ThemeIcon(
        'circle-large-filled',
        new vscode.ThemeColor('charts.blue'),
      );
    case 'pending':
    default:
      return new vscode.ThemeIcon('circle-large-outline');
  }
}

function phaseDescription(phase: Phase): string {
  if (phase.completedAt) return phase.completedAt;
  if (phase.meta) return `(${phase.meta})`;
  if (phase.status === 'in_progress') return 'in progress';
  return '';
}

function phaseTooltip(phase: Phase): string {
  const parts = [`Phase ${phase.id}: ${phase.name}`, `status: ${phase.status}`];
  if (phase.completedAt) parts.push(`completed: ${phase.completedAt}`);
  if (phase.meta) parts.push(phase.meta);
  parts.push('', 'Click → show artifact in webview');
  return parts.join('\n');
}

/**
 * 7칸 progress bar (▰▰▱▱▱▱▱)
 */
function progressBar(done: number, total: number): string {
  const filled = '▰'.repeat(Math.max(0, Math.min(done, total)));
  const empty = '▱'.repeat(Math.max(0, total - done));
  return filled + empty;
}
