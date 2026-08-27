import React from 'react';
import { TimerMode, WidgetTheme } from '../../types';
import { formatTime } from '../../utils/timer';

interface SmallWaveWidgetProps {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  theme: WidgetTheme;
  onTogglePlay: () => void;
}

export const SmallWaveWidget: React.FC<SmallWaveWidgetProps> = ({
  mode,
  timeLeft,
  isRunning,
  theme,
  onTogglePlay,
}) => {
  // 6 audio / activity wave bars with base heights
  const barHeights = [20, 32, 44, 28, 36, 18];

  return (
    <div
      id="small-wave-pomodoro-widget"
      onClick={onTogglePlay}
      className="relative w-[170px] h-[170px] sm:w-[185px] sm:h-[185px] rounded-[30px] p-5 select-none transition-all duration-300 border flex flex-col justify-between cursor-pointer group active:scale-98"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.borderColor,
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.6), 0 0 30px -15px ${theme.glow}`,
      }}
      title={isRunning ? 'Click to pause' : 'Click to start'}
    >
      {/* Top ambient line */}
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold tracking-wide capitalize"
          style={{ color: theme.primary }}
        >
          {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </span>
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: theme.primary,
            boxShadow: `0 0 10px ${theme.glow}`,
          }}
        />
      </div>

      {/* Central Countdown */}
      <div className="flex items-center justify-center my-auto">
        <span className="text-3xl sm:text-[32px] font-extrabold text-white tracking-tight leading-none font-mono">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Bottom Wave / Equalizer Bars */}
      <div className="flex items-end justify-center gap-2 h-10 pb-1">
        {barHeights.map((baseH, idx) => (
          <div
            key={idx}
            className="w-2 rounded-full transition-all duration-300"
            style={{
              height: `${baseH}px`,
              backgroundColor: theme.primary,
              opacity: isRunning ? 0.95 : 0.75,
              boxShadow: isRunning ? `0 0 8px ${theme.glow}` : 'none',
              animation: isRunning ? `bounceWave 1.${2 + (idx % 3)}s ease-in-out infinite alternate` : 'none',
              animationDelay: `${idx * 0.15}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounceWave {
          0% { transform: scaleY(0.5); }
          100% { transform: scaleY(1.15); }
        }
      `}</style>
    </div>
  );
};
