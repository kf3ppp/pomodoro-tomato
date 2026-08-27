export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerConfig {
  focusDuration: number; // in seconds
  shortBreakDuration: number; // in seconds
  longBreakDuration: number; // in seconds
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  longBreakInterval: number; // sessions until long break
}

export interface WidgetTheme {
  id: string;
  name: string;
  primary: string; // hex / tailwind color
  glow: string;
  accentBg: string;
  cardBg: string;
  surfaceBg: string;
  borderColor: string;
  dotColor: string;
}

export type ViewMode = 'all-widgets' | 'iphone' | 'android' | 'focus-mode';

export type AmbientSound = 'none' | 'brown-noise' | 'white-noise' | 'rain' | 'campfire' | 'tick';

export interface PomodoroState {
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  completedSessions: number;
  targetSessions: number;
  currentTask: string;
  soundEnabled: boolean;
  tickSoundEnabled: boolean;
  ambientSound: AmbientSound;
  ambientVolume: number;
}
