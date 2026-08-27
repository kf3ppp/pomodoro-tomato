export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatMinutes(seconds: number): string {
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

export interface PresetOption {
  id: string;
  name: string;
  focus: number; // in mins
  shortBreak: number;
  longBreak: number;
  description: string;
}

export const TIMER_PRESETS: PresetOption[] = [
  {
    id: 'classic',
    name: 'Classic Pomodoro',
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    description: 'Traditional 25-minute focus intervals with 5-minute rests',
  },
  {
    id: 'ultradian',
    name: 'Ultradian Rhythm',
    focus: 50,
    shortBreak: 10,
    longBreak: 30,
    description: '50-minute deep immersion session for complex problem solving',
  },
  {
    id: 'short-sprints',
    name: 'Quick Sprints',
    focus: 15,
    shortBreak: 3,
    longBreak: 10,
    description: '15-minute high intensity bursts for clearing inbox or quick tasks',
  },
  {
    id: 'deep-work',
    name: 'Extended Deep Work',
    focus: 90,
    shortBreak: 15,
    longBreak: 30,
    description: '90-minute natural biological focus block for creative flow',
  },
];
