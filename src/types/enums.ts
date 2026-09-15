export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type MembershipLevel = "Free" | "Premium" | "Elite";

export type ExerciseCategory = "Cardio" | "Strength" | "Flexibility";

export type ExerciseId = string;
export type UserId = string;
export type RoutineId = string;
export type InstructorId = string;

export type RecommendationLevel = "low" | "ok" | "high";

// Estados posibles de un ejercicio dentro de un entrenamiento (Sprint 3)
export type WorkoutStatus = "pending" | "completed" | "skipped";

// Origen del ejercicio: creado a mano en el formulario, o traído de la API externa
export type ExerciseSource = "local" | "api";

// Grupos musculares soportados por la API externa (api-ninjas.com/v1/exercises)
export type MuscleGroup =
  | "abdominals"
  | "abductors"
  | "adductors"
  | "biceps"
  | "calves"
  | "chest"
  | "forearms"
  | "glutes"
  | "hamstrings"
  | "lats"
  | "lower_back"
  | "middle_back"
  | "neck"
  | "quadriceps"
  | "traps"
  | "triceps";
