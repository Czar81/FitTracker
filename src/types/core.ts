export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type DayOfWeek = 
  | "Monday" 
  | "Tuesday" 
  | "Wednesday" 
  | "Thursday" 
  | "Friday" 
  | "Saturday" 
  | "Sunday";

export interface Exercise {
  name: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  distanceKm?: number;
}

export interface RoutineEntry {
  day: DayOfWeek;
  exercise: Exercise;
}

export interface WeeklyRoutine {
  name: string;
  entries: RoutineEntry[]; 
}

export interface User {
  name: string;
  age: number;
  experienceLevel: ExperienceLevel;
  assignedRoutine: WeeklyRoutine;
}