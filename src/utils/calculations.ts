import type { RoutineEntry } from "../types/core";

// Bonus: alias de tipo para calorías por minuto
export type CaloriesPerMinute = number;

export const calcCalories = (
  durationMinutes: number,
  caloriesPerMinute: CaloriesPerMinute
): number => durationMinutes * caloriesPerMinute;

export const calcPace = (
  durationMinutes: number,
  distanceKm: number
): number => Math.round((durationMinutes / distanceKm) * 100) / 100;

export const calcTotalCalories = (entries: RoutineEntry[]): number =>
  entries.reduce(
    (total, entry) =>
      total + calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute),
    0
  );

export const calcAvgCaloriesPerDay = (entries: RoutineEntry[]): number => {
  if (entries.length === 0) return 0;
  return Math.round((calcTotalCalories(entries) / entries.length) * 100) / 100;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

// Bonus: encuentra el día que quema más calorías
export const findBestCalorieDay = (entries: RoutineEntry[]): RoutineEntry | null => {
  if (entries.length === 0) return null;
  return entries.reduce((best, entry) => {
    const bestCal = calcCalories(best.exercise.durationMinutes, best.exercise.caloriesPerMinute);
    const entryCal = calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute);
    return entryCal > bestCal ? entry : best;
  });
};
