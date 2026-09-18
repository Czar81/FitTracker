import type { DayOfWeek, ExerciseId, ExerciseCategory } from "../types/enums";
import type {
  RoutineEntry,
  ExercisePercentage,
  CatalogSummary,
  CategoryGroup,
  Exercise,
  CardioExercise,
  StrengthExercise,
  FlexibilityExercise,
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
  SetExerciseStatus,
  SetSessionComment,
  IsCardioExercise,
  IsStrengthExercise,
  IsFlexibilityExercise,
  CategorizedExercises,
  CategorizeExercises,
  ExternalExerciseRaw,
  ExternalExerciseValidation,
  ValidateExternalExercise,
  UnifiedReport,
  BuildDashboardSummary,
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

  const caloriesByDay: Record<string, number> = entries.reduce(
    (acc: Record<string, number>, entry: RoutineEntry): Record<string, number> => {
      acc[entry.day] =
        (acc[entry.day] ?? 0) + calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute);
      return acc;
    },
    {}
  );

  const validDays: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const bestEntry = Object.entries(caloriesByDay).reduce<readonly [string, number] | null>(
    (best: readonly [string, number] | null, current: readonly [string, number]): readonly [string, number] | null => {
      if (best === null || current[1] > best[1]) {
        return current;
      }
      return best;
    },
    null
  );

  if (bestEntry === null) return null;
  const [bestDay] = bestEntry;
  const bestDayMatch = validDays.find((day: DayOfWeek): boolean => day === bestDay);
  return bestDayMatch ?? null;
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

export const buildUnifiedReport = (
  entries: RoutineEntry[],
  incomplete: ExternalExerciseValidation[]
): UnifiedReport => {
  const summary = groupByCategory(entries);
  const groups = [summary.cardio, summary.strength, summary.flexibility];

  return {
    summary,
    totalExercises: entries.length,
    totalMinutes: groups.reduce((total: number, group: CategoryGroup): number => total + group.totalMinutes, 0),
    localExercises: entries.filter((entry: RoutineEntry): boolean => entry.exercise.source === "local").length,
    apiExercises: entries.filter((entry: RoutineEntry): boolean => entry.exercise.source === "api").length,
    incomplete,
  };
};

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
  flattenRoutine(routine).filter((entry: RoutineEntry): boolean => entry.exercise.status === "pending");

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

export const setExerciseStatus: SetExerciseStatus = (
  routine: WeeklyRoutine,
  day: DayOfWeek,
  exerciseId: ExerciseId,
  status
): WeeklyRoutine => ({
  ...routine,
  sessions: routine.sessions.map((session: DaySession): DaySession =>
    session.day !== day
      ? session
      : {
          ...session,
          exercises: session.exercises.map((exercise: Exercise): Exercise =>
            exercise.id === exerciseId ? { ...exercise, status } : exercise
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

// --- Sprint 3: runtime type identification -----------------------------------
// Type guards for the "type" discriminant: the compiler prevents access to a
// variant-specific field unless the value first passes through one of these.
export const isCardioExercise: IsCardioExercise = (exercise: Exercise): exercise is CardioExercise =>
  exercise.type === "Cardio";

export const isStrengthExercise: IsStrengthExercise = (exercise: Exercise): exercise is StrengthExercise =>
  exercise.type === "Strength";

export const isFlexibilityExercise: IsFlexibilityExercise = (exercise: Exercise): exercise is FlexibilityExercise =>
  exercise.type === "Flexibility";

export const categorizeExercises: CategorizeExercises = (exercises: Exercise[]): CategorizedExercises => {
  const result: CategorizedExercises = { cardio: [], strength: [], flexibility: [] };

  for (const exercise of exercises) {
    if (isCardioExercise(exercise)) {
      result.cardio.push(exercise);
    } else if (isStrengthExercise(exercise)) {
      result.strength.push(exercise);
    } else if (isFlexibilityExercise(exercise)) {
      result.flexibility.push(exercise);
    } else {
      const _exhaustive: never = exercise;
      return _exhaustive;
    }
  }

  return result;
};

// --- Sprint 3: external API integration (api-ninjas.com) ---------------------
// The API returns "type" in lowercase with several possible labels; this maps
// it to our ExerciseCategory without guessing: unrecognized values return null.
const mapApiTypeToCategory = (apiType: string): "Cardio" | "Strength" | "Flexibility" | null => {
  const normalized = apiType.trim().toLowerCase();
  switch (normalized) {
    case "cardio":
      return "Cardio";
    case "strength":
    case "powerlifting":
    case "olympic_weightlifting":
    case "strongman":
    case "plyometrics":
      return "Strength";
    case "stretching":
      return "Flexibility";
    default:
      return null;
  }
};

const REQUIRED_EXTERNAL_FIELDS: (keyof ExternalExerciseRaw)[] = [
  "name",
  "type",
  "muscle",
  "difficulty",
  "instructions",
];

// Default values used to complete the domain Exercise because the external API
// does not report duration, calories, or performance metrics.
const buildExerciseFromExternal = (raw: ExternalExerciseRaw, category: "Cardio" | "Strength" | "Flexibility"): Exercise => {
  const id = crypto.randomUUID();

  switch (category) {
    case "Cardio": {
      const durationMinutes = 30;
      const caloriesPerMinute = 10;
      const distanceKm = 5;
      return {
        id,
        name: raw.name,
        type: "Cardio",
        durationMinutes,
        caloriesPerMinute,
        status: "pending",
        source: "api",
        distanceKm,
        rhythm: calcPace(durationMinutes, distanceKm),
        heartRateZone: `Zona 2 (${raw.difficulty})`,
        caloriesBurned: calcCalories(durationMinutes, caloriesPerMinute),
      };
    }
    case "Strength": {
      const durationMinutes = 30;
      const caloriesPerMinute = 8;
      return {
        id,
        name: raw.name,
        type: "Strength",
        durationMinutes,
        caloriesPerMinute,
        status: "pending",
        source: "api",
        sets: 3,
        weight: 20,
        repetitions: 10,
      };
    }
    case "Flexibility": {
      const durationMinutes = 30;
      const caloriesPerMinute = 4;
      return {
        id,
        name: raw.name,
        type: "Flexibility",
        durationMinutes,
        caloriesPerMinute,
        status: "pending",
        source: "api",
        poses: 6,
        comments: `Equipo: ${raw.equipment || "ninguno"} · Dificultad: ${raw.difficulty}`,
      };
    }
  }
};

export const validateExternalExercise: ValidateExternalExercise = (raw: ExternalExerciseRaw): ExternalExerciseValidation => {
  const missingFields = REQUIRED_EXTERNAL_FIELDS.filter(
    (field: keyof ExternalExerciseRaw): boolean => raw[field] == null || raw[field].trim() === ""
  );

  const category = mapApiTypeToCategory(raw.type);
  if (category === null && !missingFields.includes("type")) {
    missingFields.push("type");
  }

  if (missingFields.length > 0 || category === null) {
    return { raw, valid: false, missingFields, exercise: null };
  }

  return { raw, valid: true, missingFields: [], exercise: buildExerciseFromExternal(raw, category) };
};

// --- Sprint 4: closing dashboard ---------------------------------------------
// Reads directly from the unified store (users, exercises, and routines) and
// builds the global state displayed by the dashboard.
export const buildDashboardSummary: BuildDashboardSummary = (users, exercises, routines, recentActivity) => {
  const localExercises = exercises.filter((entry) => entry.data.source === "local").length;
  const apiExercises = exercises.filter((entry) => entry.data.source === "api").length;

  const activeRoutines = routines.filter((entry) =>
    entry.data.sessions.some((session: DaySession): boolean => session.exercises.length > 0)
  ).length;

  const categorized = categorizeExercises(exercises.map((entry) => entry.data));
  const categoryCounts: Record<ExerciseCategory, number> = {
    Cardio: categorized.cardio.length,
    Strength: categorized.strength.length,
    Flexibility: categorized.flexibility.length,
  };

  const userSummaries = users.map((entry) => {
    const load = calculateWeeklyLoad(entry.data.assignedRoutine);
    return {
      userName: entry.data.name,
      experienceLevel: entry.data.experienceLevel,
      routineName: entry.data.assignedRoutine.name,
      daysTrained: load.daysTrained,
      totalMinutes: load.totalMinutes,
      totalCalories: load.totalCalories,
      recommendation: getRestRecommendation(load),
    };
  });

  return {
    totalUsers: users.length,
    totalExercises: exercises.length,
    localExercises,
    apiExercises,
    activeRoutines,
    categoryCounts,
    userSummaries,
    recentActivity,
  };
};