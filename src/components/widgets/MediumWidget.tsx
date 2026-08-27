import React from 'react';
import { Play, Pause, MoreHorizontal, RotateCcw, SkipForward } from 'lucide-react';
import { TimerMode, WidgetTheme } from '../../types';
import { formatTime, formatMinutes } from '../../utils/timer';

interface MediumWidgetProps {
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  completedSessions: number;
  targetSessions: number;
  currentTask: string;
  theme: WidgetTheme;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onSkip: () => void;
  onSelectMode: (mode: TimerMode) => void;
  onOpenSettings?: () => void;
  onIncrementCompleted?: () => void;
}

export const MediumWidget: React.FC<MediumWidgetProps> = ({
  mode,
  timeLeft,
  totalTime,
  isRunning,
  completedSessions,
  targetSessions,
  currentTask,
  theme,
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  onTogglePlay,
  onReset,
  onSkip,
  onSelectMode,
  onOpenSettings,
  onIncrementCompleted,
}) => {
  // Calculate progress ratio (0 to 1)
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const percentage = Math.min(Math.max(progress, 0), 1);

  // SVG Dial Dimensions
  const dialRadius = 88;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * dialRadius;
  const strokeDashoffset = circumference * (1 - percentage);

  // Thumb position on the circle (starting at 12 o'clock / -90 deg)
  const angleDeg = -90 + percentage * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const cx = 110;
  const cy = 110;
  const thumbX = cx + dialRadius * Math.cos(angleRad);
  const thumbY = cy + dialRadius * Math.sin(angleRad);

  // Generate 48 tick marks around the perimeter
  const totalTicks = 48;
  const tickRadiusInner = dialRadius + 10;
  const tickRadiusOuter = dialRadius + 14;

  const ticks = Array.from({ length: totalTicks }).map((_, i) => {
    const tickAngle = (i / totalTicks) * 2 * Math.PI - Math.PI / 2;
    const isMajor = i % 4 === 0;
    const x1 = cx + (tickRadiusInner + (isMajor ? -2 : 0)) * Math.cos(tickAngle);
    const y1 = cy + (tickRadiusInner + (isMajor ? -2 : 0)) * Math.sin(tickAngle);
    const x2 = cx + tickRadiusOuter * Math.cos(tickAngle);
    const y2 = cy + tickRadiusOuter * Math.sin(tickAngle);

    // Active color if tick is behind current progress
    const tickProgress = i / totalTicks;
    const isLit = tickProgress <= percentage && percentage > 0;

    return {
      x1,
      y1,
      x2,
      y2,
      isMajor,
      isLit,
    };
  });

  return (
    <div
      id="medium-pomodoro-widget"
      className="relative w-full max-w-[660px] rounded-[32px] p-6 sm:p-7 md:p-8 select-none transition-all duration-300 backdrop-blur-xl border"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.borderColor,
        boxShadow: `0 24px 48px -12px rgba(0,0,0,0.65), 0 0 40px -20px ${theme.glow}`,
      }}
    >
      {/* Top ambient highlight inside card */}
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-8">
        {/* Left Side: Circular Interactive Dial */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-[220px] h-[220px] flex items-center justify-center">
            {/* SVG Dial Background & Progress */}
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90 overflow-visible"
              viewBox="0 0 220 220"
            >
              <defs>
                <linearGradient id="mediumArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primary} />
                  <stop offset="100%" stopColor={theme.primary} stopOpacity="0.85" />
                </linearGradient>
                <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={theme.primary} floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Dial base groove */}
              <circle
                cx={cx}
                cy={cy}
                r={dialRadius}
                fill="none"
                stroke="#252A36"
                strokeWidth={strokeWidth}
                strokeOpacity="0.5"
              />

              {/* Progress Arc */}
              <circle
                cx={cx}
                cy={cy}
                r={dialRadius}
                fill="none"
                stroke="url(#mediumArcGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                filter="url(#arcGlow)"
                className="transition-[stroke-dashoffset] duration-500 ease-out"
              />

              {/* Tick Marks */}
              {ticks.map((t, idx) => (
                <line
                  key={idx}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.isLit ? theme.primary : t.isMajor ? '#4A5266' : '#323847'}
                  strokeWidth={t.isMajor ? 1.5 : 1}
                  strokeLinecap="round"
                  opacity={t.isLit ? 0.9 : 0.6}
                />
              ))}

              {/* Glowing Thumb knob */}
              {percentage > 0 && percentage < 1 && (
                <circle
                  cx={thumbX}
                  cy={thumbY}
                  r={5}
                  fill="#FFFFFF"
                  stroke={theme.primary}
                  strokeWidth={3}
                  filter="url(#arcGlow)"
                  className="transition-all duration-300"
                />
              )}
            </svg>

            {/* Inner Dial Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              {/* Status Header */}
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="w-2 h-2 rounded-full inline-block animate-pulse"
                  style={{
                    backgroundColor: theme.dotColor,
                    boxShadow: `0 0 8px ${theme.glow}`,
                  }}
                />
                <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-300">
                  {mode === 'focus' ? 'FOCUS' : mode === 'shortBreak' ? 'SHORT BREAK' : 'LONG BREAK'}
                </span>
              </div>

              {/* Digital Countdown Time */}
              <span className="text-4xl sm:text-[44px] font-extrabold text-white tracking-tight leading-none my-1 font-mono">
                {formatTime(timeLeft)}
              </span>

              {/* Subtitle / Task */}
              <span className="text-[12px] text-neutral-400 font-medium mb-3 max-w-[130px] truncate">
                {currentTask || (mode === 'focus' ? 'Stay focused' : 'Take a breather')}
              </span>

              {/* Play / Pause Circular Button */}
              <div className="flex items-center gap-2">
                <button
                  id="medium-widget-play-pause-btn"
                  onClick={onTogglePlay}
                  title={isRunning ? 'Pause' : 'Start'}
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-[#242935] hover:bg-[#2C3240] active:scale-95 text-white border border-white/10 shadow-lg transition-all cursor-pointer group"
                  style={{
                    boxShadow: isRunning ? `0 0 16px -2px ${theme.glow}` : '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  {isRunning ? (
                    <Pause className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                  ) : (
                    <Play className="w-4 h-4 fill-white text-white translate-x-0.5 group-hover:scale-110 transition-transform" />
                  )}
                </button>

                {/* Quick reset button */}
                <button
                  id="medium-widget-reset-btn"
                  onClick={onReset}
                  title="Reset Timer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1B1E26] hover:bg-[#242935] text-neutral-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Skip to next mode */}
                <button
                  id="medium-widget-skip-btn"
                  onClick={onSkip}
                  title="Skip to Next Mode"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1B1E26] hover:bg-[#242935] text-neutral-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Options & Mode Selection List */}
        <div className="flex-1 w-full flex flex-col justify-between self-stretch py-1">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-white tracking-tight">Pomodoro</span>
            {onOpenSettings && (
              <button
                id="medium-widget-settings-btn"
                onClick={onOpenSettings}
                title="Timer Settings"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#252A36]/60 hover:bg-[#2F3545] text-neutral-400 hover:text-white border border-white/5 transition-all cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mode Rows */}
          <div className="space-y-3 mb-5">
            {/* Focus Row */}
            <div
              id="mode-row-focus"
              onClick={() => onSelectMode('focus')}
              className={`flex items-center justify-between py-1.5 px-3 rounded-xl cursor-pointer transition-all ${
                mode === 'focus'
                  ? 'bg-white/5 shadow-sm'
                  : 'hover:bg-white/[0.03] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{
                    backgroundColor: mode === 'focus' ? theme.primary : '#4B5563',
                    boxShadow: mode === 'focus' ? `0 0 10px ${theme.glow}` : 'none',
                  }}
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    mode === 'focus' ? 'text-white font-semibold' : 'text-neutral-300'
                  }`}
                >
                  Focus
                </span>
              </div>
              <span
                className="text-sm font-medium transition-colors"
                style={{ color: mode === 'focus' ? theme.primary : '#9CA3AF' }}
              >
                {formatMinutes(focusDuration)}
              </span>
            </div>

            <div className="h-px bg-white/5" />

            {/* Short Break Row */}
            <div
              id="mode-row-short-break"
              onClick={() => onSelectMode('shortBreak')}
              className={`flex items-center justify-between py-1.5 px-3 rounded-xl cursor-pointer transition-all ${
                mode === 'shortBreak'
                  ? 'bg-white/5 shadow-sm'
                  : 'hover:bg-white/[0.03] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{
                    backgroundColor: mode === 'shortBreak' ? theme.primary : '#4B5563',
                    boxShadow: mode === 'shortBreak' ? `0 0 10px ${theme.glow}` : 'none',
                  }}
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    mode === 'shortBreak' ? 'text-white font-semibold' : 'text-neutral-300'
                  }`}
                >
                  Short Break
                </span>
              </div>
              <span
                className="text-sm font-medium transition-colors"
                style={{ color: mode === 'shortBreak' ? theme.primary : '#9CA3AF' }}
              >
                {formatMinutes(shortBreakDuration)}
              </span>
            </div>

            <div className="h-px bg-white/5" />

            {/* Long Break Row */}
            <div
              id="mode-row-long-break"
              onClick={() => onSelectMode('longBreak')}
              className={`flex items-center justify-between py-1.5 px-3 rounded-xl cursor-pointer transition-all ${
                mode === 'longBreak'
                  ? 'bg-white/5 shadow-sm'
                  : 'hover:bg-white/[0.03] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{
                    backgroundColor: mode === 'longBreak' ? theme.primary : '#4B5563',
                    boxShadow: mode === 'longBreak' ? `0 0 10px ${theme.glow}` : 'none',
                  }}
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    mode === 'longBreak' ? 'text-white font-semibold' : 'text-neutral-300'
                  }`}
                >
                  Long Break
                </span>
              </div>
              <span
                className="text-sm font-medium transition-colors"
                style={{ color: mode === 'longBreak' ? theme.primary : '#9CA3AF' }}
              >
                {formatMinutes(longBreakDuration)}
              </span>
            </div>
          </div>

          {/* Bottom Completed Pill */}
          <div
            id="medium-widget-completed-pill"
            onClick={onIncrementCompleted}
            title="Click to log completed session"
            className="flex items-center justify-between px-4 py-2.5 rounded-full bg-[#242935]/80 hover:bg-[#2C3240] border border-white/5 cursor-pointer transition-all"
          >
            <span className="text-xs font-medium text-neutral-300">Completed</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold" style={{ color: theme.primary }}>
                {completedSessions}
              </span>
              <span className="text-xs text-neutral-500 font-semibold">/</span>
              <span className="text-xs text-neutral-400 font-semibold">{targetSessions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
