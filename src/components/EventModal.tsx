'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Trash2, Pencil } from 'lucide-react'
import { DEPARTMENTS, DEPARTMENT_ORDER } from '@/lib/constants'
import { GanttEvent, Department } from '@/lib/types'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string; date: string; department: Department; details: string }) => void
  onDelete?: (id: number) => void
  event?: GanttEvent | null
  defaultDate?: string
  defaultDepartment?: Department
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  defaultDate,
  defaultDepartment,
}: EventModalProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [department, setDepartment] = useState<Department>('lapid')
  const [details, setDetails] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const isViewMode = !!event && !isEditing

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title)
        setDate(event.date)
        setDepartment(event.department)
        setDetails(event.details || '')
        setIsEditing(false)
      } else {
        setTitle('')
        setDate(defaultDate || '')
        setDepartment(defaultDepartment || 'lapid')
        setDetails('')
        setIsEditing(true)
      }
      setConfirmDelete(false)
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen, event, defaultDate, defaultDepartment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date || !department) return
    onSave({ title: title.trim(), date, department, details: details.trim() })
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  const deptInfo = DEPARTMENTS[department]

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="backdrop:bg-black/50 bg-transparent p-0 m-auto rounded-xl max-w-md w-full"
    >
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-party-blue text-white">
          <h3 className="text-lg font-bold">
            {isViewMode ? 'פרטי אירוע' : event ? 'עריכת אירוע' : 'אירוע חדש'}
          </h3>
          <div className="flex items-center gap-2">
            {isViewMode && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                title="עריכה"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isViewMode ? (
          /* View Mode */
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900">{title}</h4>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: deptInfo.color }}
                >
                  {deptInfo.name}
                </span>
                <span>{new Date(date + 'T00:00:00').toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            {details && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">פירוט</label>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-3">
                  {details}
                </p>
              </div>
            )}
            {/* Footer for view mode */}
            <div className="flex items-center justify-between pt-2 border-t">
              {onDelete && (
                confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-600">בטוח?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(event!.id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      מחק
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    מחיקה
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-party-orange text-white text-sm font-medium rounded-lg hover:bg-party-orange-hover transition-colors shadow-sm"
              >
                עריכה
              </button>
            </div>
          </div>
        ) : (
          /* Edit/Create Mode */
          <form onSubmit={handleSubmit}>
            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="שם האירוע"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-party-blue/30 focus:border-party-blue"
                  autoFocus
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-party-blue/30 focus:border-party-blue"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מחלקה</label>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENT_ORDER.map((dept) => {
                    const info = DEPARTMENTS[dept]
                    const isSelected = department === dept
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => setDepartment(dept)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                        style={{
                          backgroundColor: isSelected ? info.color : 'transparent',
                          color: isSelected ? 'white' : info.color,
                          borderColor: info.color,
                        }}
                      >
                        {info.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">פירוט</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="פירוט נוסף על האירוע (אופציונלי)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-party-blue/30 focus:border-party-blue resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t">
              {event && onDelete ? (
                confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-600">בטוח?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(event.id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      מחק
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    מחיקה
                  </button>
                )
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (event && isEditing) {
                      setIsEditing(false)
                      setTitle(event.title)
                      setDate(event.date)
                      setDepartment(event.department)
                      setDetails(event.details || '')
                    } else {
                      onClose()
                    }
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-party-orange text-white text-sm font-medium rounded-lg hover:bg-party-orange-hover transition-colors shadow-sm"
                >
                  {event ? 'עדכן' : 'הוסף'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}
