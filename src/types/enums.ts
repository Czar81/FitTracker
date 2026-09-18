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

// Possible states for an exercise within a workout (Sprint 3)
export type WorkoutStatus = "pending" | "completed" | "skipped";

// Exercise source: created manually in the form or retrieved from the external API
export type ExerciseSource = "local" | "api";

// Muscle groups supported by the external API (api-ninjas.com/v1/exercises)
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
