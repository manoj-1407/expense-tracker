import { useState, useEffect, useCallback } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Breakdown from './components/Breakdown'
import CurrencyConverter from './components/CurrencyConverter'
import SummaryPanel from './components/SummaryPanel'

const LS_KEY = 'paisa_v1'
const TH_KEY = 'paisa_theme'

function loadData() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || [] } catch { return [] }
}

let tid = 0

export default function App() {
  const [expenses, setExpenses] = useState(loadData)
  const [theme, setTheme] = useState(() => localStorage.getItem(TH_KEY) || 'light')
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(TH_KEY, theme)
  }, [theme])

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(expenses)) } catch {}
  }, [expenses])

  const toast = useCallback((msg) => {
    const id = ++tid
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500)
  }, [])

  function addExpense(exp) {
    setExpenses(p => [{ ...exp, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...p])
    toast(`Added — ${exp.name}`)
  }

  function deleteExpense(id) {
    const found = expenses.find(e => e.id === id)
    setExpenses(p => p.filter(e => e.id !== id))
    if (found) toast(`Removed — ${found.name}`)
  }

  function clearAll() {
    if (!expenses.length) return
    setExpenses([])
    toast('All entries cleared')
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <>
      <div className="world" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <div className="shell">
        <nav className="nav">
          <span className="nav-brand">Paisa<span>.</span></span>
          <div className="nav-right">
            <span className="nav-date">{today}</span>
            <button
              className="theme-btn"
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '☽' : '☀'}
            </button>
          </div>
        </nav>

        <SummaryPanel expenses={expenses} />

        <div className="grid-main">
          <ExpenseForm onAdd={addExpense} />
          <div className="right">
            <Breakdown expenses={expenses} />
            <CurrencyConverter totalINR={total} />
          </div>
        </div>

        <ExpenseList
          expenses={expenses}
          onDelete={deleteExpense}
          onClearAll={clearAll}
        />
      </div>

      <div className="toast-wrap" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className="toast">✓ {t.msg}</div>
        ))}
      </div>
    </>
  )
}
