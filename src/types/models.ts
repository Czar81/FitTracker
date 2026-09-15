import type {
  DayOfWeek,
  ExperienceLevel,
  MembershipLevel,
  ExerciseCategory,
  ExerciseId,
  RoutineId,
  InstructorId,
  RecommendationLevel,
  WorkoutStatus,
  ExerciseSource,
  MuscleGroup,
} from "./enums";

interface ExerciseBase {
  id: ExerciseId;
  name: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  status: WorkoutStatus;
  source: ExerciseSource;
}

export interface CardioExercise extends ExerciseBase {
    type: "Cardio";
    distanceKm: number;
    rhythm: number;
    heartRateZone: string;
    caloriesBurned: number;
}

export interface StrengthExercise extends ExerciseBase {
    type: "Strength";
    sets: number;
    weight: number;
    repetitions: number;
}

export interface FlexibilityExercise extends ExerciseBase {
    type: "Flexibility";
    poses: number;
    comments?: string;
}

export type Exercise = CardioExercise | StrengthExercise | FlexibilityExercise;

export interface RoutineEntry {
  day: DayOfWeek;
  exercise: Exercise;
}

export interface DaySession {
  day: DayOfWeek;
  exercises: Exercise[];
  comment?: string;
}

export interface WeeklyRoutine {
  id: RoutineId;
  name: string;
  startDate: string;
  sessions: DaySession[];
}

export interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
}

export interface User extends Person {
  experienceLevel: ExperienceLevel;
  assignedRoutine: WeeklyRoutine;
}

export interface UserMembership {
  membershipLevel: MembershipLevel;
  memberSince: string;
  isActive: boolean;
}

export type UserProfile = User & UserMembership;

export interface Instructor extends Person {
  id: InstructorId;
  assignedUsers: UserProfile[];
}

export interface WeeklyLoad {
  totalMinutes: number;
  totalCalories: number;
  cardioMinutes: number;
  strengthMinutes: number;
  flexibilityMinutes: number;
  daysTrained: number;
}

export interface RestRecommendation {
  level: RecommendationLevel;
  message: string;
}

// Contratos formales de las funciones de cálculo (firma antes que implementación)
export interface FlattenRoutine {
  (routine: WeeklyRoutine): RoutineEntry[];
}

export interface CalculateWeeklyLoad {
  (routine: WeeklyRoutine): WeeklyLoad;
}

export interface GetRestRecommendation {
  (load: WeeklyLoad): RestRecommendation;
}

export interface FindBestCalorieRoutineDay {
  (routine: WeeklyRoutine): DaySession | null;
}

export interface GetPendingExercises {
  (routine: WeeklyRoutine): RoutineEntry[];
}

export interface AddExerciseToRoutine {
  (routine: WeeklyRoutine, day: DayOfWeek, exercise: Exercise): WeeklyRoutine;
}

export interface SetExerciseStatus {
  (routine: WeeklyRoutine, day: DayOfWeek, exerciseId: ExerciseId, status: WorkoutStatus): WeeklyRoutine;
}

export interface SetSessionComment {
  (routine: WeeklyRoutine, day: DayOfWeek, comment: string): WeeklyRoutine;
}

export interface ExercisePercentage {
  exerciseName: string;
  day: DayOfWeek;
  percentage: number;
}

export interface CategoryGroup {
  category: ExerciseCategory;
  entries: RoutineEntry[];
  totalMinutes: number;
  totalCalories: number;
  bonusCount: number; // contador de bonus según regla de negocio
}

export interface CatalogSummary {
  cardio: CategoryGroup;
  strength: CategoryGroup;
  flexibility: CategoryGroup;
}

// --- Sprint 3: identificación de tipo en tiempo de ejecución -----------------
// Type guards: permiten distinguir la variante concreta de Exercise (unión
// discriminada) sin usar "as" en ningún punto del código que los consuma.
export interface IsCardioExercise {
  (exercise: Exercise): exercise is CardioExercise;
}

export interface IsStrengthExercise {
  (exercise: Exercise): exercise is StrengthExercise;
}

export interface IsFlexibilityExercise {
  (exercise: Exercise): exercise is FlexibilityExercise;
}

export interface CategorizedExercises {
  cardio: CardioExercise[];
  strength: StrengthExercise[];
  flexibility: FlexibilityExercise[];
}

// Dada una colección de ejercicios de cualquier categoría (mezclados, tal como
// pueden venir de fuentes externas), separa cada uno según su tipo real.
export interface CategorizeExercises {
  (exercises: Exercise[]): CategorizedExercises;
}

// --- Sprint 3: integración con la API externa (api-ninjas.com) --------------
// Forma cruda de un ejercicio tal como lo entrega la API. Todo son strings
// porque es justamente el formato "no confiable" que hay que validar antes de
// convertirlo en un Exercise real del dominio.
export interface ExternalExerciseRaw {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export interface ExternalExerciseValidation {
  raw: ExternalExerciseRaw;
  valid: boolean;
  missingFields: string[];
  exercise: Exercise | null;
}

// Valida un ejercicio crudo de la API y, si cumple los campos mínimos
// requeridos, construye el Exercise tipado correspondiente (Cardio/Strength/
// Flexibility) determinando la categoría por sus propias reglas, nunca con "as".
export interface ValidateExternalExercise {
  (raw: ExternalExerciseRaw): ExternalExerciseValidation;
}

export interface ExerciseSearchResult {
  muscle: MuscleGroup;
  accepted: ExternalExerciseValidation[];
  incomplete: ExternalExerciseValidation[];
}