import { Department, DepartmentInfo } from './types'

export const DEPARTMENTS: Record<Department, DepartmentInfo> = {
  lapid: {
    id: 'lapid',
    name: 'לפיד',
    color: '#f59e0b',
    lightColor: 'rgba(245, 158, 11, 0.12)',
  },
  knesset: {
    id: 'knesset',
    name: 'כנסת',
    color: '#2038f0',
    lightColor: 'rgba(32, 56, 240, 0.10)',
  },
  field: {
    id: 'field',
    name: 'שטח',
    color: '#10b981',
    lightColor: 'rgba(16, 185, 129, 0.12)',
  },
  digital: {
    id: 'digital',
    name: 'דיגיטל',
    color: '#8b5cf6',
    lightColor: 'rgba(139, 92, 246, 0.12)',
  },
  spokesperson: {
    id: 'spokesperson',
    name: 'דוברות',
    color: '#ff522e',
    lightColor: 'rgba(255, 82, 46, 0.10)',
  },
  campaigns: {
    id: 'campaigns',
    name: 'קמפיינים',
    color: '#06b6d4',
    lightColor: 'rgba(6, 182, 212, 0.12)',
  },
}

export const DEPARTMENT_ORDER: Department[] = [
  'lapid', 'knesset', 'field', 'digital', 'spokesperson', 'campaigns'
]

export const PARTY_COLORS = {
  orange: '#ff522e',
  blue: '#2038f0',
}

export const ELECTION_DATE = new Date('2026-10-27T00:00:00+03:00')

export const HEBREW_DAY_NAMES_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
export const HEBREW_DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

export const HEBREW_MONTH_NAMES = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
]
