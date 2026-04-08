'use client'

import React from 'react'

export default function NotesPanel({ note, onChange, rangeStart, rangeEnd, monthName }) {
  const formatDate = (obj) => {
    if (!obj) return null
    const d = new Date(obj.y, obj.m, obj.d)
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${monthNames[d.getMonth()]} ${d.getDate()}`
  }

  const startStr = formatDate(rangeStart)
  const endStr   = formatDate(rangeEnd)

  let label = 'Select a date'
  if (startStr && endStr) label = `${startStr} — ${endStr}`
  else if (startStr) label = startStr

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-gray-100 p-5 md:p-6 flex flex-col bg-gray-50/30">
      <div className="mb-6">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">
          Notes & Reminders
        </h3>
        <p className="text-sm font-medium text-gray-600 truncate">
          {label}
        </p>
      </div>

      <div className="flex-1 relative notes-lines rounded-lg p-1 bg-white shadow-sm">
        <textarea
          className="notes-area"
          placeholder={rangeStart ? "Write something special..." : "Select a date to add notes"}
          value={note}
          onChange={(e) => onChange(e.target.value)}
          disabled={!rangeStart}
        />
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-[10px] leading-relaxed text-black italic">
          &ldquo;The best way to predict the future is to create it.&rdquo;
        </p>
      </div>
    </div>
  )
}
