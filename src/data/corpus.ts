/**
 * Weekly field corpus for the Gallifreyan Living Contracts Engine.
 *
 * Each Monday snapshot is a dated export in this file's `snapshots` array.
 * Later runs append a snapshot when a cited source changes or a new public
 * source is needed. They do not rewrite scenario telemetry: those numbers are
 * designed laboratory benchmarks, not measurements from these sources.
 *
 * Notes are original short glosses. They are not quotations.
 */

export interface CorpusSource {
  id: string;
  title: string;
  url: string;
  author?: string;
  year?: string;
  accessed: string;
  usedFor: string;
}

export interface ObservableCrosswalk {
  observable: keyof {
    b_gain_verified: number;
    a_response_positive: number;
    non_deprivation: number;
    non_capture: number;
    distinctness_maintained: number;
  };
  engineMeaning: string;
  publicConcept: string;
  gatheredNote: string;
  sourceIds: string[];
}

export interface CorpusStatement {
  id: string;
  statement: string;
  sourceIds: string[];
}

export interface CorpusSnapshot {
  id: string;
  gatheredAt: string;
  disclaimer: string;
  sources: CorpusSource[];
  crosswalk: ObservableCrosswalk[];
  livingContractProperties: CorpusStatement[];
  scriptNotes: CorpusStatement[];
}

const ACCESSED = '2026-11-09';

export const CORPUS_SNAPSHOTS: CorpusSnapshot[] = [
  {
    id: '2026-11-09',
    gatheredAt: ACCESSED,
    disclaimer:
      'Scenario telemetry in the visualizer is a designed benchmark. This snapshot only records public reference concepts and the circular Gallifreyan letter grid. It does not report measured relationship outcomes.',
    sources: [
      {
        id: 'sherman-guide',
        title: 'How to Write Gallifreyan',
        url: 'https://shermansplanet.com/gallifreyan/guide.pdf',
        author: 'Loren Sherman',
        accessed: ACCESSED,
        usedFor: 'Alphabet authorship, free-use note, reading direction, vowel attachment, numbers.',
      },
      {
        id: 'galligraphy-alphabet',
        title: 'Circular Gallifreyan Alphabet: Consonants and Letters',
        url: 'https://galligraphy.com/learn/alphabet',
        accessed: ACCESSED,
        usedFor: '35-consonant grid, unused crescent + one-dot cell, four-line combined letters.',
      },
      {
        id: 'galligraphy-vowels',
        title: 'Circular Gallifreyan Vowels: How Vowels Attach',
        url: 'https://galligraphy.com/learn/vowels',
        accessed: ACCESSED,
        usedFor: 'Vowel zones for A, E, I, O, and U, including I and U line direction.',
      },
      {
        id: 'galligraphy-lines',
        title: 'Lines in Circular Gallifreyan: Connecting Letters',
        url: 'https://galligraphy.com/learn/lines',
        accessed: ACCESSED,
        usedFor: 'Endpoint-only line rule and the exception for I and U.',
      },
      {
        id: 'thouin-definition',
        title: 'Demystifying Compersion: Insights from Marie Thouin’s Groundbreaking New Book',
        url: 'https://www.whatiscompersion.com/marieblog/demystifying-compersion-insights-from-marie-thouins-groundbreaking-new-book-what-is-compersion',
        author: 'What is Compersion?',
        accessed: ACCESSED,
        usedFor: 'Three-part public description of compersion: emotions, attitudes and actions, and a general context.',
      },
      {
        id: 'thouin-flicker-podcast',
        title: 'Marie Thouin: On Positive Empathy in Consensual Non-Monogamy',
        url: 'https://www.ciis.edu/podcast/dr-marie-thouin-power-positive-empathy-consensual-non-monogamy',
        author: 'CIIS Public Programs',
        accessed: ACCESSED,
        usedFor: 'Thouin describing the encyclopedia definition co-authored with Sharon Flicker.',
      },
      {
        id: 'thouin-two-types',
        title: 'Two Types of Compersion: An Empowering Distinction',
        url: 'https://www.whatiscompersion.com/marieblog/two-types-of-compersion-an-empowering-distinction',
        author: 'Marie Thouin',
        accessed: ACCESSED,
        usedFor: 'Embodied versus attitudinal compersion, and the claim that supportive regard is not available where consent is missing.',
      },
      {
        id: 'nordgren-manifesto',
        title: 'The short instructional manifesto for relationship anarchy',
        url: 'https://theanarchistlibrary.org/library/andie-nordgren-the-short-instructional-manifesto-for-relationship-anarchy',
        author: 'Andie Nordgren',
        year: '2006',
        accessed: ACCESSED,
        usedFor: 'Non-zero-sum love, refusal of entitlement, explicit custom commitments, autonomous relationships.',
      },
      {
        id: 'consent-harbour',
        title: 'Renegotiating an agreement',
        url: 'https://consentharbour.com/library/renegotiating-an-agreement',
        author: 'Consent Harbour',
        accessed: ACCESSED,
        usedFor: 'Living agreements are revisited when circumstances change; a pause can be the current arrangement.',
      },
      {
        id: 'chosen-family-law',
        title: 'One Polyam Lawyer’s Love Language: Relationship Agreements',
        url: 'https://chosenfamilylawtx.com/2021/08/26/one-polyam-lawyers-love-language-relationship-agreements/',
        author: 'Chosen Family Law',
        year: '2021',
        accessed: ACCESSED,
        usedFor: 'Written agreements when breaking them could damage a valued relationship or create shared stakes.',
      },
    ],
    crosswalk: [
      {
        observable: 'b_gain_verified',
        engineMeaning: 'Node B keeps an expanded range after influence V₁ is removed.',
        publicConcept: 'Self-determination inside an explicit commitment.',
        gatheredNote:
          'Nordgren treats a relationship as mutual only when neither person is commanded by entitlement. The benchmark treats verified gain as expansion that remains after the coupling vector is gone.',
        sourceIds: ['nordgren-manifesto'],
      },
      {
        observable: 'a_response_positive',
        engineMeaning: 'Node A registers sympathetic gain while Node B expands.',
        publicConcept: 'Compersion as positive emotion, attitude, thought, or action.',
        gatheredNote:
          'Public descriptions from Thouin, including the encyclopedia definition discussed with Sharon Flicker, extend compersion past a single feeling. Thouin also separates an embodied feeling from a supportive attitude, and describes that attitude as unavailable where consent is missing or power is unhealthy. The benchmark does not claim to measure either type.',
        sourceIds: ['thouin-definition', 'thouin-flicker-podcast', 'thouin-two-types'],
      },
      {
        observable: 'non_deprivation',
        engineMeaning: 'Node B’s gain does not reduce Node A’s baseline.',
        publicConcept: 'Love treated as non-zero-sum across relationships.',
        gatheredNote:
          'Nordgren’s manifesto argues that love for one person does not diminish love for another, and that people and relationships should not be ranked against each other for the bond to count as real.',
        sourceIds: ['nordgren-manifesto'],
      },
      {
        observable: 'non_capture',
        engineMeaning: 'The coupling does not absorb Node B’s boundary.',
        publicConcept: 'Consent and the refusal of entitlement.',
        gatheredNote:
          'Nordgren says feelings or history do not entitle someone to command a partner. Consent Harbour says a changed boundary is not dismissed by “you already agreed,” and that renegotiation should not proceed when someone cannot evaluate it.',
        sourceIds: ['nordgren-manifesto', 'consent-harbour', 'thouin-two-types'],
      },
      {
        observable: 'distinctness_maintained',
        engineMeaning: 'Nodes A and B stay separate manifolds while coupled.',
        publicConcept: 'A relationship between autonomous people, without a required ranking.',
        gatheredNote:
          'Nordgren describes each relationship as independent and between autonomous individuals. One person does not need to be named primary for the relationship to be real.',
        sourceIds: ['nordgren-manifesto'],
      },
    ],
    livingContractProperties: [
      {
        id: 'explicit-commitments',
        statement:
          'A living contract names the commitments people actually want. It does not inherit a default package in which certain duties are required for love to count.',
        sourceIds: ['nordgren-manifesto'],
      },
      {
        id: 'renegotiable',
        statement:
          'The record is revisited when needs or circumstances change. Stopping a rule before a replacement exists is a valid present arrangement.',
        sourceIds: ['consent-harbour'],
      },
      {
        id: 'written-when-stakes-are-shared',
        statement:
          'Writing the agreement matters when breaking it could damage a valued relationship or when people share legal, financial, housing, or care consequences.',
        sourceIds: ['chosen-family-law'],
      },
      {
        id: 'not-forced-compersion',
        statement:
          'Supportive regard is not something to force. The visualizer’s FORCED classification is a designed collapse of the benchmark, corresponding to the public warning that compersion does not grow out of missing consent.',
        sourceIds: ['thouin-two-types'],
      },
    ],
    scriptNotes: [
      {
        id: 'free-alphabet',
        statement:
          'Sherman’s guide states that the Doctor Who idea of a circular Gallifreyan language is BBC copyright, and that this writing system was created by Loren Sherman and is free for anyone to use.',
        sourceIds: ['sherman-guide'],
      },
      {
        id: 'grid-35',
        statement:
          'The current public grid is 4 base shapes by 9 decorations, with crescent plus one dot unused, for 35 consonants. The four-line column holds the combined letters LD, CR, RD, and LY.',
        sourceIds: ['galligraphy-alphabet', 'sherman-guide'],
      },
      {
        id: 'read-from-bottom',
        statement:
          'Words and sentences are read counterclockwise from the bottom. Vowels are small circles: A outside, E on the circle, I on the circle with a line toward center, O inside, and U on the circle with a line away from center.',
        sourceIds: ['sherman-guide', 'galligraphy-vowels', 'galligraphy-lines'],
      },
    ],
  },
];

export function latestCorpusSnapshot(): CorpusSnapshot {
  return CORPUS_SNAPSHOTS[CORPUS_SNAPSHOTS.length - 1];
}

export function corpusSourceMap(snapshot: CorpusSnapshot = latestCorpusSnapshot()): Map<string, CorpusSource> {
  return new Map(snapshot.sources.map((source) => [source.id, source]));
}
