import React from "react";
import type { RoutineEntry } from "../../types/models";
import type { WeeklyLoadCardProps } from "../../types/forms";
import { formatDuration, findBestCalorieRoutineDay, getPendingExercises } from "../../utils/calculations";
import "./RoutineViews.css";
import { useTranslation } from "react-i18next";

export const WeeklyLoadCard = ({ routine, load, recommendation }: WeeklyLoadCardProps): React.JSX.Element => {
  const { t } = useTranslation();
  const bestDaySession = findBestCalorieRoutineDay(routine);
  const pendingExercises = getPendingExercises(routine);

  return (
    <div className="weekly-load-card">
      <h2>{t("routine.load")}</h2>
      <div className="weekly-load-totals">
        <span>{formatDuration(load.totalMinutes)}</span>
        <span>{load.totalCalories.toFixed(0)} kcal</span>
      </div>
      <div className="weekly-load-breakdown">
        <span>{t("categories.Cardio")}: {formatDuration(load.cardioMinutes)}</span>
        <span>{t("categories.Strength")}: {formatDuration(load.strengthMinutes)}</span>
        <span>{t("categories.Flexibility")}: {formatDuration(load.flexibilityMinutes)}</span>
      </div>
      <p className={`weekly-load-recommendation weekly-load-recommendation--${recommendation.level}`}>
        {recommendation.level !== "ok" ? "⚠️" : "✅"} {t(`dashboard.recommendation.${recommendation.level}`)}
      </p>

      {bestDaySession !== null && (
        <p className="routine-extras-best-day">{t("routine.bestDay")} <strong>{t(`days.${bestDaySession.day}`)}</strong></p>
      )}
      {pendingExercises.length > 0 && (
        <div className="routine-extras-pending">
          <h3>{t("routine.pending")}</h3>
          <ul>
            {pendingExercises.map((entry: RoutineEntry) => (
              <li key={entry.exercise.id}> {entry.exercise.name} — {t(`days.${entry.day}`)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
