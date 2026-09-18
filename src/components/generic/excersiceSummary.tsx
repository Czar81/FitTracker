import type { RoutineEntry } from "../../types/models";
import type { ExerciseListProps } from "../../types/forms";
import {
  calcCalories,
  calcPace,
  calcTotalCalories,
  calcAvgCaloriesPerDay,
  formatDuration,
} from "../../utils/calculations";
import { useTranslation } from "react-i18next";

const ExerciseList = ({ entries }: ExerciseListProps) => {
  const { t } = useTranslation();
  if (entries.length === 0) return null;

  const totalCalories = calcTotalCalories(entries);
  const avgCalories = calcAvgCaloriesPerDay(entries);

  return (
    <div className="exercise-list">
      <h2>{t("summary.registered")}</h2>
      <div className="exercise-table">
        {entries.map((entry: RoutineEntry, index: number) => {
          const calories = calcCalories(
            entry.exercise.durationMinutes,
            entry.exercise.caloriesPerMinute
          );

          const percentage = totalCalories > 0 
            ? Math.round((calories / totalCalories) * 100) 
            : 0;

          return (
            <div key={index} className="exercise-row">
              <span className="exercise-name">{entry.exercise.name}</span>
              <span className="exercise-day">{t(`days.${entry.day}`)}</span>
              <span className="exercise-duration">
                {formatDuration(entry.exercise.durationMinutes)}
              </span>
              
              <span className="exercise-pace">
                {entry.exercise.type === "Cardio"
                  ? `${t("descriptions.pace")} ${calcPace(entry.exercise.durationMinutes, entry.exercise.distanceKm)} min/km`
                  : "—"}
              </span>

              <span className="exercise-calories">{calories} {t("common.cal")}</span>
              <span className="exercise-percentage">{percentage}%</span>
            </div>
          );
        })}
      </div>
      <div className="exercise-totals">
        <span>{t("summary.totalCalories")} <strong>{totalCalories} {t("common.cal")}</strong></span>
        <span>{t("summary.average")} <strong>{avgCalories} {t("common.cal")}</strong></span>
      </div>
    </div>
  );
};

export default ExerciseList;