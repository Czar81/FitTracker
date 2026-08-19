import type { DayOfWeek, ExerciseId } from "../types/enums";
import type {
  RoutineEntry,
  ExercisePercentage,
  CatalogSummary,
  CategoryGroup,
  Exercise,
  WeeklyRoutine,
  DaySession,
  WeeklyLoad,
  RestRecommendation,
  FlattenRoutine,
  CalculateWeeklyLoad,
  GetRestRecommendation,
  FindBestCalorieRoutineDay,
  GetPendingExercises,
  AddExerciseToRoutine,
  ToggleExerciseCompleted,
  SetSessionComment,
} from "../types/models";

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

export const flattenRoutine: FlattenRoutine = (routine: WeeklyRoutine): RoutineEntry[] =>
  routine.sessions.flatMap((session: DaySession): RoutineEntry[] =>
    session.exercises.map((exercise: Exercise): RoutineEntry => ({ day: session.day, exercise }))
  );

export const calculateWeeklyLoad: CalculateWeeklyLoad = (routine: WeeklyRoutine): WeeklyLoad => {
  const entries = flattenRoutine(routine);
  const { cardio, strength, flexibility } = groupByCategory(entries);
  return {
    totalMinutes: cardio.totalMinutes + strength.totalMinutes + flexibility.totalMinutes,
    totalCalories: cardio.totalCalories + strength.totalCalories + flexibility.totalCalories,
    cardioMinutes: cardio.totalMinutes,
    strengthMinutes: strength.totalMinutes,
    flexibilityMinutes: flexibility.totalMinutes,
    daysTrained: getUniqueDays(entries).length,
  };
};

export const getRestRecommendation: GetRestRecommendation = (load: WeeklyLoad): RestRecommendation => {
  if (load.daysTrained > 5 || load.totalMinutes > 300) {
    return {
      level: "high",
      message: "Estás entrenando muchos días o minutos esta semana. Considerá agregar un día de descanso.",
    };
  }
  if (load.daysTrained < 3 || load.totalMinutes < 150) {
    return {
      level: "low",
      message: "Considerá agregar un día más de entrenamiento esta semana.",
    };
  }
  return { level: "ok", message: "Tu carga semanal está balanceada." };
};

export const findBestCalorieRoutineDay: FindBestCalorieRoutineDay = (routine: WeeklyRoutine): DaySession | null => {
  const bestDay = findBestCalorieDay(flattenRoutine(routine));
  if (bestDay === null) return null;
  return routine.sessions.find((session: DaySession): boolean => session.day === bestDay) ?? null;
};

export const getPendingExercises: GetPendingExercises = (routine: WeeklyRoutine): RoutineEntry[] =>
  flattenRoutine(routine).filter((entry: RoutineEntry): boolean => !entry.exercise.completed);

export const addExerciseToRoutine: AddExerciseToRoutine = (
  routine: WeeklyRoutine,
  day: DayOfWeek,
  exercise: Exercise
): WeeklyRoutine => {
  const hasSession = routine.sessions.some((session: DaySession): boolean => session.day === day);
  const sessions = hasSession
    ? routine.sessions.map((session: DaySession): DaySession =>
        session.day === day ? { ...session, exercises: [...session.exercises, exercise] } : session
      )
    : [...routine.sessions, { day, exercises: [exercise] }];
  return { ...routine, sessions };
};

export const toggleExerciseCompleted: ToggleExerciseCompleted = (
  routine: WeeklyRoutine,
  day: DayOfWeek,
  exerciseId: ExerciseId
): WeeklyRoutine => ({
  ...routine,
  sessions: routine.sessions.map((session: DaySession): DaySession =>
    session.day !== day
      ? session
      : {
          ...session,
          exercises: session.exercises.map((exercise: Exercise): Exercise =>
            exercise.id === exerciseId ? { ...exercise, completed: !exercise.completed } : exercise
          ),
        }
  ),
});

export const setSessionComment: SetSessionComment = (
  routine: WeeklyRoutine,
  day: DayOfWeek,
  comment: string
): WeeklyRoutine => ({
  ...routine,
  sessions: routine.sessions.map((session: DaySession): DaySession =>
    session.day === day ? { ...session, comment } : session
  ),
});