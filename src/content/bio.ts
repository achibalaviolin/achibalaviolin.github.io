/**
 * Biography and lineage.
 *
 * The previous site had no lineage section at all. Everything below is
 * sourced from published press and programme notes — the `source` field on
 * each milestone names where it came from so it can be re-checked. Nothing
 * here is inferred or embellished.
 */

export type Milestone = {
  year: string
  title: string
  detail: string
  /** Where this was verified. Keep it filled in. */
  source: string
}

/** Short forms, used in hero copy, meta descriptions and JSON-LD. */
export const bio = {
  oneLine:
    'An independent violinist whose work moves between Carnatic, film, and world music.',

  /** Two paragraphs carried over verbatim from the previous site's About. */
  legacyAbout: [
    'Achi Bala is an independent violinist whose work moves between Carnatic, film, and world music. His performances connect Indian classical vocabulary with modern storytelling, dance, and screen music.',
    'Years of travel between Chennai and Texas, and a deep love for ballroom dance and Tamil music, shape a voice on the violin that is equally at home in a kutcheri, a concert hall, or a film score.',
  ],

  /**
   * The lineage paragraph. Built from the guru list below — it is the thing
   * that distinguishes him from every other violinist portfolio, and the
   * reason the Lalgudi essay exists on the writing side of the site.
   */
  lineage: [
    'He was raised in Texas and trained in Chennai. Initiated into Carnatic violin in Houston, he went on to years of study with All India Radio violinist Kalaimamani Smt. Usha Rajagopalan, and is a disciple of the violin and vocal virtuoso Sri Delhi P. Sunder Rajan.',
    'The players he grew up listening to in Chennai, Lalgudi G. Jayaraman and Dr. M. Balamuralikrishna, are still the measure. That inheritance is why the writing on this site keeps returning to questions of lineage, memory, and who does the remembering.',
  ],
} as const

export type Guru = {
  name: string
  honorific?: string
  /** What this teacher gave him, in his own framing. */
  relationship: string
}

/**
 * Sources:
 *  - India Herald, "Abhishek on the violin shows aplomb", 25 May 2011
 *  - Carnatic America / ONNOI programme biographies
 */
export const gurus: Guru[] = [
  {
    name: 'Vittal Ramamurthy',
    honorific: 'Sri',
    relationship: 'Initiated him into Carnatic violin',
  },
  {
    name: 'Rajarajeshwary Bhat',
    honorific: 'Smt.',
    relationship: 'Initiated him into Carnatic violin',
  },
  {
    name: 'Mahesh K. Iyer',
    honorific: 'Sri',
    relationship: 'Early training, Pranavam School of Arts',
  },
  {
    name: 'Usha Rajagopalan',
    honorific: 'Kalaimamani Smt.',
    relationship: 'Several years of advanced training, All India Radio violinist',
  },
  {
    name: 'Delhi P. Sunder Rajan',
    honorific: 'Sri',
    relationship: 'Guru, violin and vocal',
  },
]

/** Listening influences he has named in print. */
export const influences = ['Lalgudi G. Jayaraman', 'Dr. M. Balamuralikrishna'] as const

/**
 * Career milestones. Deliberately sparse — only entries with a verifiable
 * date and source. Add more as they are confirmed.
 */
export const milestones: Milestone[] = [
  {
    year: '2011',
    title: 'Solo recital at Zilkha Hall',
    detail:
      'A violin recital at Zilkha Hall, Hobby Center for the Performing Arts, Houston, accompanied by three percussionists. The performance drew a standing ovation and a proclamation from the Mayor of Sugar Land.',
    source: 'India Herald, 25 May 2011',
  },
  {
    year: '2020',
    title: 'Rama Nama Sharanam',
    detail:
      'A Carnatic violin solo record released under his own name, featuring Karun Salvady.',
    source: 'Spotify / Apple Music release listing',
  },
  {
    year: '2024',
    title: 'Music Director, The Baroque-Carnatic Connection',
    detail:
      'Music direction for a cross-cultural staging of Western baroque and South Indian classical music and dance at Miller Outdoor Theatre, Houston, produced by Silambam Houston.',
    source: 'Miller Outdoor Theatre programme, 7 June 2024',
  },
  {
    year: '2026',
    title: 'Arudra, Navagrahamum Navakailasamum',
    detail:
      'Concept, music composition, lyrics and violin for a full-length dance production.',
    source: 'Roopa Arts Cultural Center programme, 8 February 2026',
  },
]

/** The three-city framing the previous site used, kept and given detail. */
export const places = [
  { city: 'Chennai', note: 'Classical roots' },
  { city: 'Houston', note: 'Cultural diversity' },
  { city: 'Austin', note: 'Creative bridge' },
] as const
