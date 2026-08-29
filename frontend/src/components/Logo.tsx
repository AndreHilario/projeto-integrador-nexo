import { Sparkles } from 'lucide-react'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="Nexo">
      <span className="brand-mark"><Sparkles size={18} strokeWidth={2.5} /></span>
      {!compact && <span>Nexo</span>}
    </div>
  )
}
