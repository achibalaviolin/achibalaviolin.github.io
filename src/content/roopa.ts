/**
 * Roopa Fine Arts — the teaching school.
 *
 * All copy, FAQs, programmes and the arangetram entries are carried over
 * verbatim from the previous /roopa-fine-arts/ page, which was already
 * carefully written for search. Do not reword casually — it ranks.
 *
 * Note: Roopa Fine Arts (the school) is distinct from Roopa Arts Cultural
 * Center (the Sugar Land non-profit). Keep them separate.
 */

import { media } from './generated/media'
import { site } from './site'

export const roopa = {
  name: 'Roopa Fine Arts',
  established: 2016,
  teachingSince: 2014,
  email: site.lessonsEmail,
  path: '/roopa-fine-arts/',

  title: 'Carnatic Violin Lessons in Austin & Houston | Roopa Fine Arts',
  description:
    'Roopa Fine Arts offers Carnatic violin lessons, Carnatic vocal classes, and music theory with exam preparation, in person in Austin and Houston, Texas, and online worldwide. Founded in 2016 by violinist Achi Bala.',
  socialDescription:
    'Carnatic violin, Carnatic vocal, and music theory lessons with exam preparation. In person in Austin and Houston, online worldwide.',

  heading: 'Carnatic violin lessons in Austin & Houston.',
  lede: 'Roopa Fine Arts is the teaching school of violinist Achi Bala: Carnatic violin, Carnatic vocal, and music theory with exam preparation. In person across Austin and Houston, Texas, and online worldwide.',

  about: [
    'Founded in 2016 and built on formal teaching since 2014, Roopa Fine Arts grounds every student in the South Indian classical tradition, shruti, laya, and repertoire, while keeping lessons practical and personal. Students progress from first bow strokes and sarali varisai through varnams, kritis, and full concert repertoire.',
    'Lessons are taught by Achi Bala, an independent violinist whose performing life spans Carnatic kutcheris, film music, and world-music collaborations between Chennai and Texas. Students have completed arangetrams, the traditional debut concert, and won prizes in competition.',
  ],

  locations: [
    'In-person Carnatic music lessons are offered in Austin and Houston, Texas: two cities with thriving Indian classical communities. Online lessons follow the same curriculum and connect students from anywhere in the world to the same teacher and tradition.',
    'Whether you are searching for a Carnatic violin teacher near Austin, Carnatic vocal classes in Houston, or online Carnatic music lessons from abroad, the first step is the same: write in, and we will find the right format for the student.',
  ],
} as const

export type Program = {
  number: string
  title: string
  description: string
  cta: string
}

export const programs: Program[] = [
  {
    number: '01',
    title: 'Carnatic violin lessons',
    description:
      "From posture and bowing foundations to gamakas, manodharma, and concert repertoire. The violin is taught as the South Indian tradition's singing voice.",
    cta: 'Start learning violin',
  },
  {
    number: '02',
    title: 'Carnatic vocal lessons',
    description:
      'Voice training in the Carnatic idiom: sarali varisai through varnams and kritis, with attention to shruti alignment and diction.',
    cta: 'Start learning vocal',
  },
  {
    number: '03',
    title: 'Music theory & exam prep',
    description:
      'Structured theory instruction and preparation for graded music examinations, building literate, self-sufficient musicians.',
    cta: 'Prepare for exams',
  },
]

/**
 * Stats. `countTo` drives the animated counter; entries without it render as
 * plain text, because "Arangetrams" and "Prize wins" have no number on record.
 * TODO: add real counts and these animate automatically.
 */
export type Stat = { value: string; label: string; countTo?: number }

export const schoolStats: Stat[] = [
  { value: '2016', label: 'School established', countTo: 2016 },
  { value: '2014', label: 'Teaching since', countTo: 2014 },
  { value: 'Arangetrams', label: 'Completed by students' },
  { value: 'Prize wins', label: 'In competition' },
]

export const locationStats: Stat[] = [
  { value: 'Austin', label: 'In-person lessons' },
  { value: 'Houston', label: 'In-person lessons' },
  { value: 'Online', label: 'Students worldwide' },
  { value: 'All ages', label: 'Beginner to advanced' },
]

export type Arangetram = {
  student: string
  date: string | null
  city?: string
  description?: string
  image?: keyof typeof media
  imageAlt?: string
}

export const arangetrams: Arangetram[] = [
  {
    student: 'Siddarth Giridharan',
    date: '2026-08-08',
    city: 'Sugar Land, Texas',
    description:
      "Siddarth Giridharan, disciple of A. Balakrishnan, celebrated his debut concert during Roopa Fine Arts' tenth anniversary year.",
    image: 'roopa-fine-arts/siddarth-giridharan-arangetram-2026',
    imageAlt: "Siddarth Giridharan's Arangetram flyer",
  },
  {
    student: 'Kashyap Kalvakota',
    date: null, // TODO: date, city and flyer
  },
]

export type Faq = { question: string; answer: string }

export const faqs: Faq[] = [
  {
    question: 'Do you offer Carnatic violin lessons in Austin?',
    answer:
      'Yes. Roopa Fine Arts offers in-person Carnatic violin lessons in Austin and Houston, Texas, and online lessons for students worldwide.',
  },
  {
    question: 'Do you teach Carnatic vocal as well as violin?',
    answer:
      'Yes. The school teaches Carnatic violin, Carnatic vocal, and music theory with structured exam preparation.',
  },
  {
    question: 'Can I learn Carnatic violin online?',
    answer:
      'Yes. Roopa Fine Arts students learn online from around the world, with the same curriculum used for in-person lessons in Texas.',
  },
  {
    question: 'Who teaches at Roopa Fine Arts?',
    answer:
      'Lessons are taught by Achi Bala, an independent violinist performing Carnatic, film, and world music, who has taught formally since 2014 and founded Roopa Fine Arts in 2016.',
  },
  {
    question: 'What is an arangetram, and do you prepare students for one?',
    answer:
      "An arangetram is a student's debut full-length public concert, a milestone in Indian classical training. Roopa Fine Arts students have completed arangetrams and won prizes in competition.",
  },
  {
    question: 'How do I enquire about lessons?',
    answer:
      "Email roopafinearts@gmail.com with the student's age, experience level, and whether you prefer in-person lessons in Austin or Houston, or online lessons.",
  },
]
