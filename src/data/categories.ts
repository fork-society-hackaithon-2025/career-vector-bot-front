export const CATEGORIES = [
  { value: 'cigarettes', label: 'Cigarettes' },
  { value: 'heated_tobacco_sticks', label: 'Heated-tobacco sticks (e.g. HEETS, TEREA)' },
  { value: 'heated_tobacco_devices', label: 'Heated-tobacco devices/systems (e.g. lil SOLID, IQOS)' },
  { value: 'lighters', label: 'Lighters' },
  { value: 'energy_drinks', label: 'Energy drinks' }
] as const;

export type Category = typeof CATEGORIES[number]['value']; 