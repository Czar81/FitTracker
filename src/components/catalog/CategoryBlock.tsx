import React from "react";
import type { RoutineEntry } from "../../types/models";
import type { CategoryBlockProps } from "../../types/forms";
import { generateExerciseDescription } from "../../utils/descriptions";
import { formatDuration } from "../../utils/calculations";

export const CategoryBlock = ({ group, label }: CategoryBlockProps): React.JSX.Element => {
  return (
    <div className="category-block">
      <div className="category-header">
        <h3>{label}</h3>
        <span className="category-count">{group.entries.length} ejercicios</span>
      </div>

      {group.entries.length === 0 ? (
        <p className="category-empty">Sin ejercicios en esta categoría</p>
      ) : (
        <div className="category-exercises">
          {group.entries.map((entry: RoutineEntry, index: number) => (
            <div key={index} className="category-exercise-row">
              <span className="category-exercise-name">{entry.exercise.name}</span>
              <span className="category-exercise-day">{entry.day}</span>
              <span className="category-exercise-desc">
                {generateExerciseDescription(entry.exercise)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="category-footer">
        <span>{formatDuration(group.totalMinutes)}</span>
        <span>{group.totalCalories.toFixed(0)} cal</span>
        <span>{group.bonusCount} bonus</span>
      </div>
    </div>
  );
};
