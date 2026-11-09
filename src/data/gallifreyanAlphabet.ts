/**
 * Structural facts for Sherman's Circular Gallifreyan.
 *
 * The grid is the public letter table: four base shapes by nine decorations,
 * with the crescent + one-dot cell unused (35 consonants). Reading order,
 * vowel zones, and the number system are included so the visualizer can
 * segment text instead of counting raw Latin vowels.
 *
 * Sources (accessed 2026-11-09):
 * - Loren Sherman, "How to Write Gallifreyan" — https://shermansplanet.com/gallifreyan/guide.pdf
 * - Galligraphy alphabet lesson — https://galligraphy.com/learn/alphabet
 * - Galligraphy vowel lesson — https://galligraphy.com/learn/vowels
 * - Galligraphy line lesson — https://galligraphy.com/learn/lines
 *
 * Sherman's guide states that the Doctor Who circular-language concept is
 * BBC copyright, and that this alphabet was created by Loren Sherman and is
 * free for anyone to use. This file stores the grid and placement rules.
 * It does not reproduce the guide's drawings or prose.
 */

export type BaseShape = 'crescent' | 'circle' | 'arc' | 'bisected';
export type DecorationKind = 'none' | 'dots' | 'lines';
export type VowelZone = 'outside' | 'on' | 'inside';

export interface DecorationColumn {
  kind: DecorationKind;
  count: number;
}

export interface ConsonantCell {
  letter: string;
  shape: BaseShape;
  decoration: DecorationKind;
  count: number;
}

export interface VowelRule {
  letter: 'A' | 'E' | 'I' | 'O' | 'U';
  zone: VowelZone;
  line: 'none' | 'toward-center' | 'away-from-center';
}

export interface GallifreyanGlyph {
  kind: 'consonant' | 'vowel';
  letter: string;
  shape?: BaseShape;
  decoration?: DecorationKind;
  count?: number;
  zone?: VowelZone;
  line?: VowelRule['line'];
  /** A vowel immediately after a consonant may sit on that consonant. */
  attachedToPrevious: boolean;
}

/** Rows are base shapes. Columns are decorations. null is the unused cell. */
export const CONSONANT_GRID: (string | null)[][] = [
  ['B', null, 'CH', 'D', 'ND', 'G', 'H', 'F', 'LD'],
  ['J', 'PH', 'K', 'L', 'C', 'N', 'P', 'M', 'CR'],
  ['T', 'WH', 'SH', 'R', 'NT', 'V', 'W', 'S', 'RD'],
  ['TH', 'GH', 'Y', 'Z', 'Q', 'QU', 'X', 'NG', 'LY'],
];

export const BASE_SHAPES: BaseShape[] = ['crescent', 'circle', 'arc', 'bisected'];

export const DECORATION_COLUMNS: DecorationColumn[] = [
  { kind: 'none', count: 0 },
  { kind: 'dots', count: 1 },
  { kind: 'dots', count: 2 },
  { kind: 'dots', count: 3 },
  { kind: 'dots', count: 4 },
  { kind: 'lines', count: 1 },
  { kind: 'lines', count: 2 },
  { kind: 'lines', count: 3 },
  { kind: 'lines', count: 4 },
];

export const VOWEL_RULES: VowelRule[] = [
  { letter: 'A', zone: 'outside', line: 'none' },
  { letter: 'E', zone: 'on', line: 'none' },
  { letter: 'I', zone: 'on', line: 'toward-center' },
  { letter: 'O', zone: 'inside', line: 'none' },
  { letter: 'U', zone: 'on', line: 'away-from-center' },
];

export const READING_RULES = [
  'Words sit on a word circle and are read counterclockwise from the bottom.',
  'A consonant is identified by base shape first, then by how many dots or lines it carries.',
  'Only the endpoints of a consonant line count. A line that merely crosses a letter is ignored.',
  'Lines may join letters, including across words. A line that ends on a letter counts for that letter.',
  'I and U lines are meaningful: I starts toward the word center, U starts away from it.',
  'A vowel may stand alone. A vowel immediately after a consonant may instead attach to that consonant.',
  'Sentences are read counterclockwise from the bottom, usually inside a sentence circle with an inner circle that can hold punctuation.',
  'Numbers are concentric rings read outer to inner. Each line on a ring adds 1 and each circle adds 5. A line through the center marks a negative number.',
] as const;

const DIGRAPHS = ['QU', 'CH', 'PH', 'WH', 'GH', 'SH', 'TH', 'NG', 'ND', 'NT', 'LD', 'CR', 'RD', 'LY'] as const;

const consonantByLetter = new Map<string, ConsonantCell>();
CONSONANT_GRID.forEach((row, shapeIndex) => {
  row.forEach((letter, columnIndex) => {
    if (!letter) return;
    const column = DECORATION_COLUMNS[columnIndex];
    consonantByLetter.set(letter, {
      letter,
      shape: BASE_SHAPES[shapeIndex],
      decoration: column.kind,
      count: column.count,
    });
  });
});

const vowelByLetter = new Map(VOWEL_RULES.map((rule) => [rule.letter, rule]));

export function lookupConsonant(letter: string): ConsonantCell | undefined {
  return consonantByLetter.get(letter);
}

export function consonantCount(): number {
  return consonantByLetter.size;
}

/**
 * Segment an English-letter string into circular Gallifreyan glyphs.
 * Y is a consonant. QU is one consonant, so its U is not a separate vowel.
 * Characters outside A–Z are skipped.
 */
export function segmentGallifreyan(raw: string): GallifreyanGlyph[] {
  const text = raw.toUpperCase();
  const glyphs: GallifreyanGlyph[] = [];
  let i = 0;

  while (i < text.length) {
    const pair = text.slice(i, i + 2);
    const digraph = DIGRAPHS.find((entry) => entry === pair && consonantByLetter.has(entry));
    if (digraph) {
      const cell = consonantByLetter.get(digraph)!;
      glyphs.push({
        kind: 'consonant',
        letter: cell.letter,
        shape: cell.shape,
        decoration: cell.decoration,
        count: cell.count,
        attachedToPrevious: false,
      });
      i += 2;
      continue;
    }

    const char = text[i];
    if (consonantByLetter.has(char)) {
      const cell = consonantByLetter.get(char)!;
      glyphs.push({
        kind: 'consonant',
        letter: cell.letter,
        shape: cell.shape,
        decoration: cell.decoration,
        count: cell.count,
        attachedToPrevious: false,
      });
      i += 1;
      continue;
    }

    const vowel = vowelByLetter.get(char as VowelRule['letter']);
    if (vowel) {
      const previous = glyphs[glyphs.length - 1];
      glyphs.push({
        kind: 'vowel',
        letter: vowel.letter,
        zone: vowel.zone,
        line: vowel.line,
        attachedToPrevious: previous?.kind === 'consonant',
      });
      i += 1;
      continue;
    }

    i += 1;
  }

  return glyphs;
}

export function summarizeGlyphs(glyphs: GallifreyanGlyph[]): string {
  if (glyphs.length === 0) return 'No A–Z glyphs';
  return glyphs
    .map((glyph) => {
      if (glyph.kind === 'vowel') {
        const attach = glyph.attachedToPrevious ? 'attached' : 'standalone';
        return `${glyph.letter}:${glyph.zone}${glyph.line === 'none' ? '' : `/${glyph.line}`} (${attach})`;
      }
      const mark =
        glyph.decoration === 'none' ? 'plain' : `${glyph.count} ${glyph.decoration}`;
      return `${glyph.letter}:${glyph.shape}+${mark}`;
    })
    .join(' · ');
}

export function countVowels(glyphs: GallifreyanGlyph[]): number {
  return glyphs.filter((glyph) => glyph.kind === 'vowel').length;
}
