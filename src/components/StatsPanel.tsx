import { X, TrendingUp, CheckSquare, Clock } from 'lucide-react'

interface StatsPanelProps {
  onClose: () => void
  completedTodos: number
  focusMinutes: number
}

export function StatsPanel({ onClose, completedTodos, focusMinutes }: StatsPanelProps) {
  const focusHours = Math.floor(focusMinutes / 60)
  const focusMins = focusMinutes % 60

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const data = [45, 90, 30, 120, 75, 60, focusMinutes % 150]

  const maxVal = Math.max(...data, 1)

  return (
    <div className="glass-panel-dark rounded-2xl p-5 w-72 animate-scale-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white/90 font-semibold">Focus Stats</h3>
        <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard
          icon={<Clock size={16} />}
          label="Today"
          value={focusHours > 0 ? `${focusHours}h ${focusMins}m` : `${focusMins}m`}
          color="#a78bfa"
        />
        <StatCard
          icon={<CheckSquare size={16} />}
          label="Tasks Done"
          value={completedTodos.toString()}
          color="#6ee7b7"
        />
        <StatCard
          icon={<TrendingUp size={16} />}
          label="Streak"
          value="3 days"
          color="#fbbf24"
        />
        <StatCard
          icon={<Clock size={16} />}
          label="This Week"
          value="5h 30m"
          color="#f9a8d4"
        />
      </div>

      {/* Bar chart */}
      <div>
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Weekly Focus</p>
        <div className="flex items-end gap-2 h-16">
          {days.map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${(data[i] / maxVal) * 100}%`,
                  background: i === 6 ? '#a78bfa' : 'rgba(255,255,255,0.2)',
                  minHeight: '4px',
                }}
              />
              <span className="text-white/40 text-[9px]">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1" style={{ color }}>
        {icon}
        <span className="text-xs text-white/50 font-medium">{label}</span>
      </div>
      <p className="text-white font-bold text-lg leading-none">{value}</p>
    </div>
  )
}
