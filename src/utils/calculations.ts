import type { DayOfWeek } from "../types/enums";
import type { RoutineEntry, ExercisePercentage } from "../types/models";

export const calcCalories = (durationMinutes: number, caloriesPerMinute: number): number =>
  durationMinutes * caloriesPerMinute;

export const calcPace = (durationMinutes: number, distanceKm: number): number =>
  Math.round((durationMinutes / distanceKm) * 100) / 100;

export const calcTotalCalories = (entries: RoutineEntry[]): number =>
  entries.reduce(
    (total: number, entry: RoutineEntry): number =>
      total + calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute),
    0
  );

export const getUniqueDays = (entries: RoutineEntry[]): DayOfWeek[] =>
  Array.from(new Set(entries.map((entry: RoutineEntry): DayOfWeek => entry.day)));

export const calcAvgCaloriesPerDay = (entries: RoutineEntry[]): number => {
  if (entries.length === 0) return 0;
  return Math.round((calcTotalCalories(entries) / getUniqueDays(entries).length) * 100) / 100;
};

export const getExercisePercentages = (entries: RoutineEntry[]): ExercisePercentage[] => {
  if (entries.length === 0) return [];
  const totalCalories = calcTotalCalories(entries);
  return entries.map((entry: RoutineEntry): ExercisePercentage => ({
    exerciseName: entry.exercise.name,
    day: entry.day,
    percentage: Math.round(
      (calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute) / totalCalories) * 10
    ) / 10,
  }));
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const findBestCalorieDay = (entries: RoutineEntry[]): DayOfWeek | null => {
  if (entries.length === 0) return null;

  const caloriesByDay = entries.reduce((acc: Record<string, number>, entry: RoutineEntry): Record<string, number> => {
    acc[entry.day] = (acc[entry.day] ?? 0) + calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute);
    return acc;
  }, {});

  return Object.entries(caloriesByDay).reduce(
    (bestDay: string, [day, calories]: [string, number]): string =>
      calories > caloriesByDay[bestDay] ? day : bestDay,
    Object.keys(caloriesByDay)[0]
  ) as DayOfWeek;
};
