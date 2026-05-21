export interface CardBlock {
  type: 'title' | 'text' | 'bullet' | 'divider' | 'philosopher';
  content: string;
  name?: string;
}

const PHILOSOPHER_PATTERN = /^[A-Z][\w\séèê.'-]+:/;

function detectPhilosopherFormat(lines: string[]): boolean {
  return lines.some(l => PHILOSOPHER_PATTERN.test(l.trim()));
}

function detectBulletFormat(lines: string[]): boolean {
  return lines.some(l => l.trim().startsWith('•'));
}

function parsePhilosopherFormat(lines: string[]): CardBlock[] {
  const blocks: CardBlock[] = [{ type: 'title', content: lines[0] }];

  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(/^(.+?):\s*(.+)$/);
    if (!match) continue;

    if (blocks.length > 1) {
      blocks.push({ type: 'divider', content: '' });
    }
    blocks.push({ type: 'philosopher', name: match[1], content: match[2] });
  }

  return blocks;
}

function parseBulletFormat(lines: string[]): CardBlock[] {
  const blocks: CardBlock[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('•')) {
      blocks.push({ type: 'bullet', content: trimmed.substring(1).trim() });
    } else if (blocks.length === 0) {
      blocks.push({ type: 'title', content: trimmed });
    } else {
      blocks.push({ type: 'text', content: trimmed });
    }
  }

  return blocks;
}

function parseMultiLineFormat(lines: string[]): CardBlock[] {
  return [
    { type: 'title', content: lines[0] },
    ...lines.slice(1).map(line => ({ type: 'text' as const, content: line })),
  ];
}

export function parseCardBlocks(questionText: string): CardBlock[] {
  const lines = questionText.split('\n').filter(l => l.trim() !== '');
  if (!lines.length) return [];

  if (detectPhilosopherFormat(lines)) return parsePhilosopherFormat(lines);
  if (detectBulletFormat(lines)) return parseBulletFormat(lines);
  if (lines.length > 1) return parseMultiLineFormat(lines);

  return [{ type: 'title', content: lines[0] }];
}
