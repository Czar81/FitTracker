import React from "react";
import type { DayOfWeek } from "../../types/enums";
import type { DaySession, Exercise } from "../../types/models";
import type { RoutineSessionsProps } from "../../types/forms";
import { generateExerciseDescription } from "../../utils/descriptions";
import { calcCalories, formatDuration } from "../../utils/calculations";
import { useUserStore } from "../../store/userStore";
import "./RoutineViews.css";

const DAYS: DayOfWeek[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export const RoutineSessions = ({ routine }: RoutineSessionsProps): React.JSX.Element => {
  const { toggleExerciseCompleted, setSessionComment } = useUserStore();

  const sessionByDay = new Map<DayOfWeek, DaySession>(
    routine.sessions.map((session: DaySession): [DayOfWeek, DaySession] => [session.day, session])
  );

  return (
    <div className="routine-sessions">
      <h2>📋 {routine.name}</h2>
      <p className="routine-start-date">Semana desde: {routine.startDate}</p>

      {DAYS.map((day: DayOfWeek) => {
        const session = sessionByDay.get(day);
        return (
          <div key={day} className="session-block">
            <h3>{day}</h3>
            {session === undefined ? (
              <p className="session-rest">(descanso)</p>
            ) : (
              <>
                {session.exercises.map((exercise: Exercise) => {
                  const calories = calcCalories(exercise.durationMinutes, exercise.caloriesPerMinute);
                  return (
                    <label key={exercise.id} className="session-exercise-row">
                      <input
                        type="checkbox"
                        checked={exercise.completed}
                        onChange={(): void => toggleExerciseCompleted(day, exercise.id)}
                      />
                      <span>
                        {exercise.completed ? "✅" : "❌"} {exercise.name} [{exercise.type}], {formatDuration(exercise.durationMinutes)} | {generateExerciseDescription(exercise)} | {calories.toFixed(0)} kcal
                      </span>
                    </label>
                  );
                })}
                <input
                  key={session.comment}
                  className="session-comment-input"
                  defaultValue={session.comment ?? ""}
                  placeholder="💬 Comentario del día..."
                  onBlur={(e: React.FocusEvent<HTMLInputElement>): void => setSessionComment(day, e.target.value)}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
