import React from 'react';
import { TimerMode, WidgetTheme } from '../../types';
import { formatTime } from '../../utils/timer';
import { TomatoIcon } from '../TomatoIcon';

interface SmallTachometerWidgetProps {
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  theme: WidgetTheme;
  onTogglePlay: () => void;
}

export const SmallTachometerWidget: React.FC<SmallTachometerWidgetProps> = ({
  mode,
  timeLeft,
  totalTime,
  isRunning,
  theme,
  onTogglePlay,
}) => {
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const percentage = Math.min(Math.max(progress, 0), 1);

  const cx = 85;
  const cy = 85;
  const totalTicks = 40;
  const tickInner = 64;
  const tickOuter = 76;

  // Generate radial dash bars
  const ticks = Array.from({ length: totalTicks }).map((_, i) => {
    const angle = (i / totalTicks) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + tickInner * Math.cos(angle);
    const y1 = cy + tickInner * Math.sin(angle);
    const x2 = cx + tickOuter * Math.cos(angle);
    const y2 = cy + tickOuter * Math.sin(angle);

    const tickRatio = i / totalTicks;
    const isLit = tickRatio <= percentage && percentage > 0;

    return {
      x1,
      y1,
      x2,
      y2,
      isLit,
    };
  });

  return (
    <div
      id="small-tachometer-pomodoro-widget"
      onClick={onTogglePlay}
      className="relative w-[170px] h-[170px] sm:w-[185px] sm:h-[185px] rounded-[30px] p-3.5 select-none transition-all duration-300 border flex flex-col items-center justify-center cursor-pointer group active:scale-98"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.borderColor,
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.6), 0 0 30px -15px ${theme.glow}`,
      }}
      title={isRunning ? 'Click to pause' : 'Click to start'}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Radial Ticks SVG */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible p-2"
        viewBox="0 0 170 170"
      >
        <defs>
          <filter id="tickGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={theme.primary} floodOpacity="0.8" />
          </filter>
        </defs>

        {ticks.map((t, idx) => (
          <line
            key={idx}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isLit ? theme.primary : '#2E3545'}
            strokeWidth={2.4}
            strokeLinecap="round"
            filter={t.isLit ? 'url(#tickGlow)' : undefined}
            className="transition-colors duration-300"
          />
        ))}
      </svg>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className={`transition-transform duration-300 ${isRunning ? 'animate-pulse' : 'group-hover:scale-105'}`}>
          <TomatoIcon size={34} />
        </div>

        {/* Big White Countdown */}
        <span className="text-[25px] sm:text-[27px] font-extrabold text-white tracking-tight leading-none mt-1.5 font-mono">
          {formatTime(timeLeft)}
        </span>

        {/* Focus subtitle */}
        <span className="text-[11px] text-neutral-400 font-medium mt-0.5">
          {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </span>
      </div>
    </div>
  );
};
