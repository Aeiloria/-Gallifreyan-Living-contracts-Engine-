/**
 * Checks the gathered alphabet against the public grid examples.
 * Run with: npx tsx src/data/verifyCorpus.ts
 */
import {
  consonantCount,
  lookupConsonant,
  segmentGallifreyan,
  countVowels,
} from './gallifreyanAlphabet.ts';
import { latestCorpusSnapshot } from './corpus.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(consonantCount() === 35, `expected 35 consonants, got ${consonantCount()}`);

const examples: Array<[string, string, string, number]> = [
  ['T', 'arc', 'none', 0],
  ['WH', 'arc', 'dots', 1],
  ['SH', 'arc', 'dots', 2],
  ['R', 'arc', 'dots', 3],
  ['NT', 'arc', 'dots', 4],
  ['W', 'arc', 'lines', 2],
  ['PH', 'circle', 'dots', 1],
  ['ND', 'crescent', 'dots', 4],
  ['TH', 'bisected', 'none', 0],
];

for (const [letter, shape, decoration, count] of examples) {
  const cell = lookupConsonant(letter);
  assert(!!cell, `missing consonant ${letter}`);
  assert(cell!.shape === shape, `${letter} shape ${cell!.shape} !== ${shape}`);
  assert(cell!.decoration === decoration, `${letter} decoration ${cell!.decoration} !== ${decoration}`);
  assert(cell!.count === count, `${letter} count ${cell!.count} !== ${count}`);
}

assert(lookupConsonant('C')?.shape === 'circle' && lookupConsonant('C')?.count === 4, 'C is circle + 4 dots');

const bow = segmentGallifreyan('BOW');
assert(bow.map((glyph) => glyph.letter).join('-') === 'B-O-W', `BOW segmented as ${bow.map((g) => g.letter).join('-')}`);
assert(bow[1]?.attachedToPrevious === true, 'O in BOW attaches to B');

const world = segmentGallifreyan('world');
assert(world.map((glyph) => glyph.letter).join('-') === 'W-O-R-LD', `WORLD segmented as ${world.map((g) => g.letter).join('-')}`);

const quartz = segmentGallifreyan('QUARTZ');
assert(quartz[0]?.letter === 'QU', 'QUARTZ starts with the QU consonant');
assert(countVowels(quartz) === 1, `QUARTZ should have 1 vowel, got ${countVowels(quartz)}`);

const thing = segmentGallifreyan('THING');
assert(thing.map((glyph) => glyph.letter).join('-') === 'TH-I-NG', `THING segmented as ${thing.map((g) => g.letter).join('-')}`);

const snapshot = latestCorpusSnapshot();
assert(snapshot.gatheredAt === '2026-11-09', 'latest snapshot date drifted');
assert(snapshot.crosswalk.length === 5, 'crosswalk should cover the five observables');
const sourceIds = new Set(snapshot.sources.map((source) => source.id));
for (const row of snapshot.crosswalk) {
  for (const id of row.sourceIds) {
    assert(sourceIds.has(id), `crosswalk cites missing source ${id}`);
  }
}

console.log(`corpus ${snapshot.id}: ${snapshot.sources.length} sources, ${consonantCount()} consonants, checks passed`);
