export type Department = 'lapid' | 'knesset' | 'field' | 'digital' | 'spokesperson' | 'campaigns'

export interface GanttEvent {
  id: number
  title: string
  date: string
  department: Department
  details: string | null
  created_at: string
  updated_at: string
}

export interface DepartmentInfo {
  id: Department
  name: string
  color: string
  lightColor: string
}
