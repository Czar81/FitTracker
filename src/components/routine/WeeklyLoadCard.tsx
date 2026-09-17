import React from "react";
import type { RoutineEntry } from "../../types/models";
import type { WeeklyLoadCardProps } from "../../types/forms";
import { formatDuration, findBestCalorieRoutineDay, getPendingExercises } from "../../utils/calculations";
import "./RoutineViews.css";

export const WeeklyLoadCard = ({ routine, load, recommendation }: WeeklyLoadCardProps): React.JSX.Element => {
  const bestDaySession = findBestCalorieRoutineDay(routine);
  const pendingExercises = getPendingExercises(routine);

  return (
    <div className="weekly-load-card">
      <h2>Carga semanal</h2>
      <div className="weekly-load-totals">
        <span>{formatDuration(load.totalMinutes)}</span>
        <span>{load.totalCalories.toFixed(0)} kcal</span>
      </div>
      <div className="weekly-load-breakdown">
        <span>Cardio: {formatDuration(load.cardioMinutes)}</span>
        <span>Fuerza: {formatDuration(load.strengthMinutes)}</span>
        <span>Flexibilidad: {formatDuration(load.flexibilityMinutes)}</span>
      </div>
      <p className={`weekly-load-recommendation weekly-load-recommendation--${recommendation.level}`}>
        {recommendation.level !== "ok" ? "⚠️" : "✅"} {recommendation.message}
      </p>

      {bestDaySession !== null && (
        <p className="routine-extras-best-day">Día de mayor gasto calórico: <strong>{bestDaySession.day}</strong></p>
      )}
      {pendingExercises.length > 0 && (
        <div className="routine-extras-pending">
          <h3>Ejercicios pendientes</h3>
          <ul>
            {pendingExercises.map((entry: RoutineEntry) => (
              <li key={entry.exercise.id}> {entry.exercise.name} — {entry.day}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
