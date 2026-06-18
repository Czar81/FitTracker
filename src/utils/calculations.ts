import type { DayOfWeek } from "../types/enums";
import type { RoutineEntry, ExercisePercentage, CatalogSummary, CategoryGroup, Exercise } from "../types/models";

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

const isBonus = (exercise: Exercise): boolean => {
  switch (exercise.type) {
    case "Cardio":
      return exercise.distanceKm >= 10;
    case "Strength":
      return exercise.sets * exercise.repetitions >= 50;
    case "Flexibility":
      return exercise.durationMinutes >= 30;
    default: {
      const _exhaustive: never = exercise;
      return _exhaustive;
    }
  }
};

export const groupByCategory=(entries: RoutineEntry[]): CatalogSummary =>{
  const cardio: CategoryGroup = {
    category: "Cardio",
    entries: [],
    totalMinutes: 0,
    totalCalories: 0,
    bonusCount: 0,
  };

  const strength: CategoryGroup = {
    category: "Strength",
    entries: [],
    totalMinutes: 0,
    totalCalories: 0,
    bonusCount: 0,
  };

  const flexibility: CategoryGroup = {
    category: "Flexibility",
    entries: [],
    totalMinutes: 0,
    totalCalories: 0,
    bonusCount: 0,
  };

  for (const entry of entries) {
  const { exercise } = entry;
  const calories = calcCalories(exercise.durationMinutes, exercise.caloriesPerMinute);

  switch (exercise.type) {
    case "Cardio": {
      cardio.entries.push(entry);
      cardio.totalMinutes += exercise.durationMinutes;
      cardio.totalCalories += calories;
      if (isBonus(exercise)) cardio.bonusCount += 1;
      break;
    }

    case "Strength": {
      strength.entries.push(entry);
      strength.totalMinutes += exercise.durationMinutes;
      strength.totalCalories += calories;
      if (isBonus(exercise)) strength.bonusCount += 1;
      break;
    }

    case "Flexibility": {
      flexibility.entries.push(entry);
      flexibility.totalMinutes += exercise.durationMinutes;
      flexibility.totalCalories += calories;
      if (isBonus(exercise)) flexibility.bonusCount += 1;
      break;
    }

    default: {
      const _exhaustive: never = exercise;
      return _exhaustive;
    }
  }
}
  return { cardio, strength, flexibility };
}