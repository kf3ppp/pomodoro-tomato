import React from 'react';
import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { TimerMode, WidgetTheme } from '../../types';
import { formatTime } from '../../utils/timer';

interface SmallDigitalWidgetProps {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  theme: WidgetTheme;
  onTogglePlay: () => void;
  onOpenSettings?: () => void;
}

export const SmallDigitalWidget: React.FC<SmallDigitalWidgetProps> = ({
  mode,
  timeLeft,
  isRunning,
  theme,
  onTogglePlay,
  onOpenSettings,
}) => {
  return (
    <div
      id="small-digital-pomodoro-widget"
      className="relative w-[170px] h-[170px] sm:w-[185px] sm:h-[185px] rounded-[30px] p-5 select-none transition-all duration-300 border flex flex-col justify-between"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.borderColor,
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.6), 0 0 30px -15px ${theme.glow}`,
      }}
    >
      {/* Top ambient glass line */}
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-300 tracking-tight">Pomodoro</span>
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer p-0.5"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Countdown Display */}
      <div className="flex flex-col items-center justify-center my-auto">
        <span
          className="text-3xl sm:text-[34px] font-extrabold tracking-tight leading-none font-mono"
          style={{
            color: theme.primary,
            textShadow: `0 0 20px ${theme.glow}`,
          }}
        >
          {formatTime(timeLeft)}
        </span>
        <span className="text-[11px] text-neutral-400 font-medium mt-1">
          {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </span>
      </div>

      {/* Bottom Play Button */}
      <div className="flex items-center justify-center">
        <button
          id="small-digital-play-btn"
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer group active:scale-95"
          style={{
            borderColor: theme.primary,
            backgroundColor: `${theme.primary}18`,
            boxShadow: isRunning ? `0 0 16px ${theme.glow}` : 'none',
          }}
        >
          {isRunning ? (
            <Pause
              className="w-4 h-4 transition-transform group-hover:scale-110"
              style={{ fill: theme.primary, color: theme.primary }}
            />
          ) : (
            <Play
              className="w-4 h-4 translate-x-0.5 transition-transform group-hover:scale-110"
              style={{ fill: theme.primary, color: theme.primary }}
            />
          )}
        </button>
      </div>
    </div>
  );
};
