import { useState } from 'react'
import { CATS } from '../cats'

const fmt = n => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtDate = iso => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) +
    '  ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function ExpenseList({ expenses, onDelete, onClearAll }) {
  const [filter, setFilter] = useState('All')

  const cats = ['All', ...Array.from(new Set(expenses.map(e => e.category)))]
  const list = filter === 'All' ? expenses : expenses.filter(e => e.category === filter)

  return (
    <div>
      <div className="entries-head">
        <p className="entries-title">
          Entries
          {expenses.length > 0 &&
            <span style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 16, marginLeft: 8 }}>
              {list.length}
            </span>
          }
        </p>
        <div className="controls">
          {cats.map(c => (
            <button key={c} className={`chip ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
          {expenses.length > 0 && (
            <button className="del-all" onClick={onClearAll}>Clear all</button>
          )}
        </div>
      </div>

      <div className="cards">
        {list.length === 0 && (
          <div className="empty">
            <div className="empty-glyph">🧾</div>
            <p className="empty-msg">
              {expenses.length === 0 ? 'Nothing logged yet' : `No ${filter} entries`}
            </p>
          </div>
        )}

        {list.map(exp => {
          const m = CATS[exp.category] || CATS.Other
          return (
            <div className="ecard" key={exp.id}>
              <div className="ecard-top">
                <span className="ecard-name">{exp.name}</span>
                <button
                  className="ecard-del"
                  onClick={() => onDelete(exp.id)}
                  aria-label={`Remove ${exp.name}`}
                >✕</button>
              </div>
              <div className="ecard-bottom">
                <span className="ecard-badge" style={{ background: m.bg, color: m.color }}>
                  {exp.category}
                </span>
                <span className="ecard-amount" style={{ color: m.color }}>
                  {fmt(exp.amount)}
                </span>
              </div>
              <p className="ecard-date">{fmtDate(exp.createdAt)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
