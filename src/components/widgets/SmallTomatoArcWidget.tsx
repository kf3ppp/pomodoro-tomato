import React from 'react';
import { TimerMode, WidgetTheme } from '../../types';
import { formatTime } from '../../utils/timer';
import { TomatoIcon } from '../TomatoIcon';

interface SmallTomatoArcWidgetProps {
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  theme: WidgetTheme;
  onTogglePlay: () => void;
}

export const SmallTomatoArcWidget: React.FC<SmallTomatoArcWidgetProps> = ({
  mode,
  timeLeft,
  totalTime,
  isRunning,
  theme,
  onTogglePlay,
}) => {
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const percentage = Math.min(Math.max(progress, 0), 1);

  const radius = 66;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage);

  // Knob thumb angle
  const angleDeg = -90 + percentage * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const cx = 85;
  const cy = 85;
  const thumbX = cx + radius * Math.cos(angleRad);
  const thumbY = cy + radius * Math.sin(angleRad);

  return (
    <div
      id="small-tomato-arc-widget"
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

      {/* SVG Arc Ring */}
      <svg
        className="absolute inset-0 w-full h-full transform -rotate-90 overflow-visible p-2.5"
        viewBox="0 0 170 170"
      >
        <defs>
          <linearGradient id="smallArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.primary} />
            <stop offset="100%" stopColor={theme.primary} />
          </linearGradient>
          <filter id="smallArcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={theme.primary} floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Base circle */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#252A36"
          strokeWidth={strokeWidth}
          strokeOpacity="0.4"
        />

        {/* Dynamic Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="url(#smallArcGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#smallArcGlow)"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />

        {/* Glowing Knob Dot */}
        {percentage > 0 && percentage < 1 && (
          <circle
            cx={thumbX}
            cy={thumbY}
            r={4.5}
            fill="#FFFFFF"
            stroke={theme.primary}
            strokeWidth={2.5}
            filter="url(#smallArcGlow)"
          />
        )}
      </svg>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
        {/* 3D Tomato Icon with subtle pulse when running */}
        <div className={`transition-transform duration-300 ${isRunning ? 'animate-pulse' : 'group-hover:scale-105'}`}>
          <TomatoIcon size={38} />
        </div>

        {/* Big White Countdown */}
        <span className="text-[26px] sm:text-[28px] font-extrabold text-white tracking-tight leading-none mt-1.5 font-mono">
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
