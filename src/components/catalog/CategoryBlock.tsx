import React from "react";
import type { RoutineEntry } from "../../types/models";
import type { CategoryBlockProps } from "../../types/forms";
import { generateExerciseDescription } from "../../utils/descriptions";
import { calcCalories, formatDuration } from "../../utils/calculations";

export const CategoryBlock = ({ group, label }: CategoryBlockProps): React.JSX.Element => {
  return (
    <div className="category-block">
      <div className="category-header">
        <h3>{label}</h3>
        <span className="category-count">
          {group.entries.length} ejercicios · {formatDuration(group.totalMinutes)} · {group.totalCalories.toFixed(0)} kcal
        </span>
      </div>

      {group.entries.length === 0 ? (
        <p className="category-empty">Sin ejercicios en esta categoría</p>
      ) : (
        <div className="category-exercises">
          {group.entries.map((entry: RoutineEntry, index: number) => {
            const calories = calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute);
            return (
              <div key={index} className="category-exercise-row">
                <span className="category-exercise-line">
                  {entry.exercise.name}, {formatDuration(entry.exercise.durationMinutes)} | {generateExerciseDescription(entry.exercise)} | {calories.toFixed(0)} kcal
                </span>
              </div>
            );
          })}
        </div>
      )}

      {group.bonusCount > 0 && (
        <div className="category-footer">
          <span>{group.bonusCount} bonus</span>
        </div>
      )}
    </div>
  );
};
