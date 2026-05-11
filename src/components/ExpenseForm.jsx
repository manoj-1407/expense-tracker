import { useState } from 'react'
import { CATS } from '../cats'

export default function ExpenseForm({ onAdd }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [cat, setCat] = useState('Food')
  const [shake, setShake] = useState(false)

  function submit(e) {
    e.preventDefault()
    const n = name.trim()
    const a = parseFloat(amount)
    if (!n || !a || a <= 0) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    onAdd({ name: n, amount: a, category: cat })
    setName('')
    setAmount('')
    setCat('Food')
  }

  return (
    <div className="surface" style={shake ? { animation: 'shake .4s' } : {}}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}60%{transform:translateX(8px)}80%{transform:translateX(-4px)}}`}</style>
      <p className="form-title">Log expense</p>

      <form onSubmit={submit} noValidate>
        <div className="field">
          <label>What for?</label>
          <input
            type="text"
            placeholder="e.g. Biryani from Paradise"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
          />
        </div>

        <div className="two">
          <div className="field">
            <label>Amount</label>
            <div className="sym-wrap">
              <span className="sym-icon">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>
          </div>
          <div className="field">
            <label>Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {Object.keys(CATS).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" className="add-btn">Add</button>
      </form>
    </div>
  )
}
