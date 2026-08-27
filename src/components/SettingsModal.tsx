import React from 'react';
import { X, Volume2, VolumeX, Sparkles, Check, Clock, Bell, Flame } from 'lucide-react';
import { TimerConfig, WidgetTheme, AmbientSound } from '../types';
import { THEMES } from '../utils/themes';
import { TIMER_PRESETS, PresetOption } from '../utils/timer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TimerConfig;
  onChangeConfig: (newConfig: Partial<TimerConfig>) => void;
  currentTheme: WidgetTheme;
  onSelectTheme: (theme: WidgetTheme) => void;
  currentTask: string;
  onChangeTask: (task: string) => void;
  targetSessions: number;
  onChangeTargetSessions: (target: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  tickSoundEnabled: boolean;
  onToggleTickSound: () => void;
  ambientSound: AmbientSound;
  onSelectAmbientSound: (sound: AmbientSound) => void;
  ambientVolume: number;
  onChangeAmbientVolume: (vol: number) => void;
  onApplyPreset: (preset: PresetOption) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  currentTheme,
  onSelectTheme,
  currentTask,
  onChangeTask,
  targetSessions,
  onChangeTargetSessions,
  soundEnabled,
  onToggleSound,
  tickSoundEnabled,
  onToggleTickSound,
  ambientSound,
  onSelectAmbientSound,
  ambientVolume,
  onChangeAmbientVolume,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="settings-modal"
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7 border bg-[#181B24] border-white/10 text-white shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
        style={{
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.8), 0 0 35px -15px ${currentTheme.glow}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${currentTheme.primary}25` }}
            >
              <Clock className="w-4 h-4" style={{ color: currentTheme.primary }} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Widget & Timer Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          {/* Current Task / Intention */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Focus Intention / Active Task
            </label>
            <input
              type="text"
              value={currentTask}
              onChange={(e) => onChangeTask(e.target.value)}
              placeholder="e.g. Coding App, Studying, Writing..."
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/90 border border-white/10 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Timer Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIMER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onApplyPreset(preset)}
                  className="p-3 text-left rounded-xl bg-neutral-900/60 hover:bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                    {preset.name}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {preset.focus}m / {preset.shortBreak}m
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Duration Sliders */}
          <div className="space-y-3.5 bg-neutral-900/40 p-4 rounded-2xl border border-white/5">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
              Custom Durations (Minutes)
            </span>

            {/* Focus */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Focus Interval</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="90"
                  value={Math.round(config.focusDuration / 60)}
                  onChange={(e) =>
                    onChangeConfig({ focusDuration: Number(e.target.value) * 60 })
                  }
                  className="w-28 accent-orange-500"
                />
                <span className="w-12 text-right font-mono font-bold text-white">
                  {Math.round(config.focusDuration / 60)} m
                </span>
              </div>
            </div>

            {/* Short Break */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Short Break</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={Math.round(config.shortBreakDuration / 60)}
                  onChange={(e) =>
                    onChangeConfig({ shortBreakDuration: Number(e.target.value) * 60 })
                  }
                  className="w-28 accent-orange-500"
                />
                <span className="w-12 text-right font-mono font-bold text-white">
                  {Math.round(config.shortBreakDuration / 60)} m
                </span>
              </div>
            </div>

            {/* Long Break */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Long Break</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="45"
                  value={Math.round(config.longBreakDuration / 60)}
                  onChange={(e) =>
                    onChangeConfig({ longBreakDuration: Number(e.target.value) * 60 })
                  }
                  className="w-28 accent-orange-500"
                />
                <span className="w-12 text-right font-mono font-bold text-white">
                  {Math.round(config.longBreakDuration / 60)} m
                </span>
              </div>
            </div>

            {/* Target Daily Goal */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" /> Daily Target Sessions
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={targetSessions}
                  onChange={(e) => onChangeTargetSessions(Number(e.target.value))}
                  className="w-28 accent-orange-500"
                />
                <span className="w-12 text-right font-mono font-bold text-white">
                  {targetSessions}
                </span>
              </div>
            </div>
          </div>

          {/* Color Themes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
              Accent & Surface Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(THEMES).map((th) => (
                <button
                  key={th.id}
                  onClick={() => onSelectTheme(th)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                    currentTheme.id === th.id
                      ? 'bg-white/10 border-white/40 shadow-sm'
                      : 'bg-neutral-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: th.primary }}
                  />
                  <span className="text-xs font-medium text-white truncate">{th.name}</span>
                  {currentTheme.id === th.id && (
                    <Check className="w-3.5 h-3.5 ml-auto text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Sound Generators */}
          <div className="space-y-3 bg-neutral-900/40 p-4 rounded-2xl border border-white/5">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
              Audio & Ambient Noise
            </span>

            {/* Bell Chime Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 flex items-center gap-2">
                <Bell className="w-4 h-4 text-neutral-400" /> Completion Bell Chime
              </span>
              <button
                onClick={onToggleSound}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  soundEnabled ? 'bg-orange-500' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    soundEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Clock Ticking Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" /> Subtle Clock Tick
              </span>
              <button
                onClick={onToggleTickSound}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  tickSoundEnabled ? 'bg-orange-500' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    tickSoundEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Ambient Background Generator */}
            <div className="pt-2 border-t border-white/5">
              <label className="block text-xs text-neutral-400 mb-2 font-medium">
                Focus Ambient Generator:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'none', label: 'Off' },
                  { id: 'brown-noise', label: 'Brown Noise' },
                  { id: 'rain', label: 'Rain Drops' },
                  { id: 'white-noise', label: 'White Noise' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectAmbientSound(s.id as AmbientSound)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      ambientSound === s.id
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {ambientSound !== 'none' && (
                <div className="flex items-center gap-3 mt-3">
                  <Volume2 className="w-4 h-4 text-neutral-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={(e) => onChangeAmbientVolume(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all cursor-pointer"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 8px 20px -6px ${currentTheme.glow}`,
            }}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
