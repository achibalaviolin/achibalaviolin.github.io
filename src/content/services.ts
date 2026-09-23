/**
 * Studio and services.
 *
 * Copy carried over verbatim from the previous site. The mailto subjects are
 * preserved so existing enquiry filters keep working.
 */

import { site } from './site'

export type Service = {
  number: string
  title: string
  description: string
  cta: string
  subject: string
}

export const services: Service[] = [
  {
    number: '01',
    title: 'Music Composition',
    description:
      'Original scores for films, dance productions, arrangements, and theme development.',
    cta: 'Get your production scored',
    subject: 'Music composition enquiry',
  },
  {
    number: '02',
    title: 'Audio Engineering',
    description:
      'Mastering, restoration, and mix insight so tracks translate cleanly everywhere.',
    cta: 'Master your tracks',
    subject: 'Audio engineering enquiry',
  },
  {
    number: '03',
    title: 'Recording Services',
    description:
      'Studio hire, session violin, voice-over, and acoustic instrument recording.',
    cta: 'Book the studio',
    subject: 'Studio recording enquiry',
  },
]

export const serviceMailto = (subject: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`
