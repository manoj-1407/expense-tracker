import { useState, useEffect, useCallback, useRef } from 'react'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'SGD', 'AED', 'CAD', 'AUD', 'CNY', 'CHF']

export default function CurrencyConverter({ totalINR }) {
  const [to, setTo] = useState('USD')
  const [rate, setRate] = useState(null)
  const [status, setStatus] = useState('idle')
  const [ts, setTs] = useState(null)
  const cacheRef = useRef({})

  const load = useCallback(async (currency) => {
    if (currency === 'INR') {
      setRate(1); setStatus('ok')
      setTs(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
      return
    }
    // Use cached rate if available (avoid hammering API on every keystroke)
    if (cacheRef.current[currency]) {
      setRate(cacheRef.current[currency]); setStatus('ok')
      setTs(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
      return
    }
    setStatus('busy')
    try {
      const r = await fetch(`https://api.frankfurter.app/latest?from=INR&to=${currency}`)
      if (!r.ok) throw new Error()
      const d = await r.json()
      const fetched = d.rates[currency]
      cacheRef.current[currency] = fetched
      setRate(fetched); setStatus('ok')
      setTs(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    } catch {
      setStatus('err'); setRate(null)
    }
  }, [])

  useEffect(() => { load(to) }, [to, load])

  const converted = rate != null && totalINR > 0 ? totalINR * rate : null

  const fmt = (n, c) => {
    try {
      return n.toLocaleString('en-US', {
        style: 'currency', currency: c,
        minimumFractionDigits: 2, maximumFractionDigits: 2
      })
    } catch { return `${c} ${n.toFixed(2)}` }
  }

  return (
    <div className="surface">
      <div className="conv-head">
        <p className="conv-title">Convert to</p>
        <span className={`conv-state ${status}`}>
          {status === 'busy' && 'loading…'}
          {status === 'ok' && `updated ${ts}`}
          {status === 'err' && 'offline'}
        </span>
      </div>

      <div className="conv-row">
        <select className="conv-sel" value={to} onChange={e => setTo(e.target.value)}>
          {CURRENCIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="conv-val">
          {status === 'busy' && <span style={{ color: 'var(--dim)', fontSize: 16 }}>—</span>}
          {status === 'err' && <span style={{ color: 'var(--red)', fontSize: 14 }}>—</span>}
          {status === 'ok' && (
            converted != null
              ? fmt(converted, to)
              : <span style={{ color: 'var(--dim)', fontSize: 15 }}>Add expenses to convert</span>
          )}
        </div>
      </div>

      {status === 'ok' && rate && to !== 'INR' && (
        <p className="conv-note">1 INR = {rate.toFixed(5)} {to} · Frankfurter.app</p>
      )}
      {status === 'ok' && to === 'INR' && (
        <p className="conv-note">Showing total in base currency (INR)</p>
      )}
      {status === 'err' && (
        <p className="conv-note" style={{ color: 'var(--red)' }}>
          Can&apos;t reach exchange API.{' '}
          <button className="retry-btn" onClick={() => { cacheRef.current = {}; load(to) }}>Retry</button>
        </p>
      )}
    </div>
  )
}
