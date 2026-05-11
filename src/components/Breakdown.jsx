import { CATS } from '../cats'

const fmt = n => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Breakdown({ expenses }) {
  const byCat = expenses.reduce((a, e) => ({ ...a, [e.category]: (a[e.category] || 0) + e.amount }), {})
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1])

  return (
    <div className="surface">
      <p className="breakdown-title">By category</p>
      {sorted.length === 0 ? (
        <p className="bk-empty">No expenses yet</p>
      ) : (
        <div className="bk-rows">
          {sorted.map(([cat, amt]) => {
            const pct = total > 0 ? (amt / total) * 100 : 0
            const m = CATS[cat] || CATS.Other
            return (
              <div className="bk-row" key={cat}>
                <span className="bk-dot" style={{ background: m.color }} />
                <span className="bk-name">{cat}</span>
                <div className="bk-bar-wrap">
                  <div className="bk-bar" style={{ width: `${pct}%`, background: m.color }} />
                </div>
                <span className="bk-amt">{fmt(amt)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
