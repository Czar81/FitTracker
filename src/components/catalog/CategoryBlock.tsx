import React from "react";
import type { RoutineEntry } from "../../types/models";
import type { WorkoutStatus } from "../../types/enums";
import type { CategoryBlockProps } from "../../types/forms";
import { generateExerciseDescription } from "../../utils/descriptions";
import { calcCalories, formatDuration } from "../../utils/calculations";
import { useTranslation } from "react-i18next";

const STATUS_ICON: Record<WorkoutStatus, string> = {
  pending: "⏳",
  completed: "✅",
  skipped: "⏭️",
};

export const CategoryBlock = ({ group, label }: CategoryBlockProps): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="category-block">
      <div className="category-header">
        <h3>{label}</h3>
        <span className="category-count">
          {t("catalog.count", { count: group.entries.length, duration: formatDuration(group.totalMinutes), calories: group.totalCalories.toFixed(0) })}
        </span>
      </div>

      {group.entries.length === 0 ? (
        <p className="category-empty">{t("catalog.empty")}</p>
      ) : (
        <div className="category-exercises">
          {group.entries.map((entry: RoutineEntry, index: number) => {
            const calories = calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute);
            return (
              <div key={index} className="category-exercise-row">
                <span className="category-exercise-line">
                  {STATUS_ICON[entry.exercise.status]}, {formatDuration(entry.exercise.durationMinutes)} | {generateExerciseDescription(entry.exercise)} | {calories.toFixed(0)} kcal
                </span>
              </div>
            );
          })}
        </div>
      )}

      {group.bonusCount > 0 && (
        <div className="category-footer">
          <span>{t("catalog.bonusCount", { count: group.bonusCount })}</span>
        </div>
      )}
    </div>
  );
};
