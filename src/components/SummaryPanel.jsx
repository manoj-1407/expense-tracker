import { CATS } from '../cats'

const fmt = n => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function SummaryPanel({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const topCats = Object.entries(
    expenses.reduce((a, e) => ({ ...a, [e.category]: (a[e.category] || 0) + e.amount }), {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 3)

  return (
    <div className="hero">
      <p className="hero-label">{month} · Total spent</p>
      <div className="hero-amount">
        <span className="sym">₹</span>{fmt(total)}
      </div>
      <p className="hero-sub">
        {expenses.length === 0
          ? 'Start adding your expenses below'
          : `${expenses.length} item${expenses.length > 1 ? 's' : ''} logged`}
      </p>
      {topCats.length > 0 && (
        <div className="hero-cats">
          {topCats.map(([cat]) => {
            const m = CATS[cat] || CATS.Other
            return (
              <span
                key={cat}
                className="hero-cat-pill"
                style={{ color: m.color, borderColor: m.bg, background: m.bg }}
              >
                {cat}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
