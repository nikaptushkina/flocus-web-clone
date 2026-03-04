import { X, Bell, Hash } from 'lucide-react'
import type { AppSettings, TimerSettings, AlertStyle, TallyIcon } from '../types'

interface SettingsPanelProps {
  settings: AppSettings
  onChange: (settings: Partial<AppSettings>) => void
  onClose: () => void
}

export function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  const updateTimer = (updates: Partial<TimerSettings>) => {
    onChange({ timerSettings: { ...settings.timerSettings, ...updates } })
  }

  return (
    <div className="glass-panel-dark rounded-2xl p-5 w-80 animate-scale-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white/90 font-semibold">Settings</h3>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/80 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-5">
        {/* Personal */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Personal</p>
          <div className="space-y-3">
            <div>
              <label className="text-white/70 text-sm block mb-1.5">Your Name</label>
              <input
                type="text"
                value={settings.userName}
                onChange={e => onChange({ userName: e.target.value })}
                placeholder="e.g. Alex"
                className="w-full glass-btn rounded-xl px-3 py-2 text-white/80 text-sm placeholder:text-white/30 outline-none focus:border-white/30"
              />
            </div>
          </div>
        </section>

        {/* Clock */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Clock</p>
          <div className="space-y-2.5">
            <ToggleSetting
              label="Show greeting"
              value={settings.showGreeting}
              onChange={v => onChange({ showGreeting: v })}
            />
            <ToggleSetting
              label="24-hour format"
              value={settings.use24Hour}
              onChange={v => onChange({ use24Hour: v })}
            />
            <ToggleSetting
              label="Show seconds"
              value={settings.showSeconds}
              onChange={v => onChange({ showSeconds: v })}
            />
            <ToggleSetting
              label="Show date"
              value={settings.showDate}
              onChange={v => onChange({ showDate: v })}
            />
          </div>
        </section>

        {/* Focus Timer */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Focus Timer</p>
          <div className="space-y-3">
            <div className="space-y-2.5">
              <NumberSetting
                label="Work (min)"
                value={settings.timerSettings.pomodoroWork}
                min={1} max={120}
                onChange={v => updateTimer({ pomodoroWork: v })}
              />
              <NumberSetting
                label="Short break (min)"
                value={settings.timerSettings.pomodoroBreak}
                min={1} max={30}
                onChange={v => updateTimer({ pomodoroBreak: v })}
              />
              <NumberSetting
                label="Long break (min)"
                value={settings.timerSettings.pomodoroLong}
                min={1} max={60}
                onChange={v => updateTimer({ pomodoroLong: v })}
              />
            </div>

            <div>
              <label className="text-white/70 text-xs font-medium block mb-1.5 flex items-center gap-1.5">
                <Bell size={12} /> Alert Style
              </label>
              <select
                value={settings.timerSettings.alertStyle}
                onChange={e => updateTimer({ alertStyle: e.target.value as AlertStyle })}
                className="w-full glass-btn rounded-xl px-3 py-2 text-white/80 text-xs outline-none focus:border-white/30 appearance-none cursor-pointer"
              >
                <option value="sparkle">✨ Sparkle</option>
                <option value="train">🚈 Train Arrival</option>
                <option value="commuter">🚉 Commuter Jingle</option>
                <option value="gameshow">🎲 Game Show</option>
                <option value="airport">🛫 Airport</option>
                <option value="soft">☁️ Soft</option>
                <option value="chime">🔔 Chime</option>
                <option value="piano">🎹 Piano</option>
                <option value="success">🏆 Success</option>
                <option value="levelup">👾 Level Up</option>
                <option value="applause">👏 Applause</option>
                <option value="none">🔕 No Alert</option>
              </select>
            </div>

            <div>
              <label className="text-white/70 text-xs font-medium block mb-1.5 flex items-center gap-1.5">
                <Hash size={12} /> Session Tallies
              </label>
              <select
                value={settings.timerSettings.tallyIcon}
                onChange={e => updateTimer({ tallyIcon: e.target.value as TallyIcon })}
                className="w-full glass-btn rounded-xl px-3 py-2 text-white/80 text-xs outline-none focus:border-white/30 appearance-none cursor-pointer"
              >
                <option value="dots">● Dots</option>
                <option value="hearts">❤️ Hearts</option>
                <option value="stars">⭐️ Stars</option>
                <option value="tomatoes">🍅 Tomatoes</option>
                <option value="bolts">⚡️ Bolts</option>
                <option value="graduation">🎓 Graduation</option>
                <option value="snowflake">❄️ Snowflake</option>
                <option value="snowman">☃️ Snowman</option>
                <option value="christmas-tree">🎄 Christmas Tree</option>
              </select>
            </div>
          </div>
        </section>

        {/* Display */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Display</p>
          <div className="space-y-2.5">
            <ToggleSetting
              label="Clear Mode (auto-hide UI)"
              value={settings.clearMode}
              onChange={v => onChange({ clearMode: v })}
            />
            <p className="text-white/30 text-[10px] italic">Hides UI when mouse leaves the window.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

function ToggleSetting({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/70 text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-6 rounded-full transition-all relative ${value ? 'bg-white/80' : 'bg-white/15'}`}
      >
        <div
          className={`w-4 h-4 rounded-full absolute top-1 transition-all ${value ? 'left-5 bg-gray-800' : 'left-1 bg-white/50'}`}
        />
      </button>
    </div>
  )
}

function NumberSetting({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/70 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-6 h-6 rounded-lg glass-btn flex items-center justify-center text-white/60 hover:text-white text-sm"
        >
          −
        </button>
        <span className="text-white/90 text-sm w-8 text-center font-semibold">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-6 h-6 rounded-lg glass-btn flex items-center justify-center text-white/60 hover:text-white text-sm"
        >
          +
        </button>
      </div>
    </div>
  )
}