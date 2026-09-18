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
import type { StoredEntity } from "./store";

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

// Formal contracts for calculation functions (signature before implementation)
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
  bonusCount: number; // bonus count according to the business rule
}

export interface CatalogSummary {
  cardio: CategoryGroup;
  strength: CategoryGroup;
  flexibility: CategoryGroup;
}

// --- Sprint 3: runtime type identification -----------------------------------
// Type guards distinguish the concrete Exercise variant (discriminated union)
// without using "as" anywhere in consuming code.
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

// Given a collection of exercises from any category (mixed, as they may arrive
// from external sources), separates each one according to its actual type.
export interface CategorizeExercises {
  (exercises: Exercise[]): CategorizedExercises;
}

// --- Sprint 3: external API integration (api-ninjas.com) ---------------------
// Raw form of an exercise as delivered by the API. Everything is a string
// because this is the "untrusted" format that must be validated before being
// converted into a real domain Exercise.
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

// Validates a raw API exercise and, when it meets the minimum required fields,
// builds the corresponding typed Exercise (Cardio/Strength/Flexibility),
// determining the category using its own rules and never with "as".
export interface ValidateExternalExercise {
  (raw: ExternalExerciseRaw): ExternalExerciseValidation;
}

export interface ExerciseSearchResult {
  muscle: MuscleGroup;
  accepted: ExternalExerciseValidation[];
  incomplete: ExternalExerciseValidation[];
}

export interface UnifiedReport {
  summary: CatalogSummary;
  totalExercises: number;
  totalMinutes: number;
  localExercises: number;
  apiExercises: number;
  incomplete: ExternalExerciseValidation[];
}

// --- Sprint 4: closing dashboard ---------------------------------------------
// Weekly summary for a single registered user, as displayed by the dashboard
// (total load, rest recommendation, and so on).
export interface UserWeeklySummary {
  userName: string;
  experienceLevel: ExperienceLevel;
  routineName: string;
  daysTrained: number;
  totalMinutes: number;
  totalCalories: number;
  recommendation: RestRecommendation;
}

// Global system state, built from data stored in the unified storage layer
// (users, exercises, and routines).
export interface DashboardSummary {
  totalUsers: number;
  totalExercises: number;
  localExercises: number;
  apiExercises: number;
  activeRoutines: number;
  categoryCounts: Record<ExerciseCategory, number>;
  userSummaries: UserWeeklySummary[];
  recentActivity: string[];
}

export interface BuildDashboardSummary {
  (
    users: StoredEntity<UserProfile>[],
    exercises: StoredEntity<Exercise>[],
    routines: StoredEntity<WeeklyRoutine>[],
    recentActivity: string[]
  ): DashboardSummary;
}