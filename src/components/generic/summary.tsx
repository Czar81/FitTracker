import type { RoutineEntry } from "../../types/models";
import type { SummaryProps } from "../../types/forms";
import { calcCalories, calcTotalCalories, findBestCalorieDay } from "../../utils/calculations";
import { useTranslation } from "react-i18next";

const Summary = ({ entries }: SummaryProps) => {
  const { t } = useTranslation();
  if (entries.length === 0) return null;

  const totalCalories = calcTotalCalories(entries);

  const longestExercise = entries.reduce((max: RoutineEntry, entry: RoutineEntry): RoutineEntry =>
    entry.exercise.durationMinutes > max.exercise.durationMinutes ? entry : max
  );

  const bestDay = findBestCalorieDay(entries);

  const bestDayCalories = bestDay
    ? entries
        .filter((e: RoutineEntry): boolean => e.day === bestDay)
        .reduce((total: number, e: RoutineEntry): number =>
          total + calcCalories(e.exercise.durationMinutes, e.exercise.caloriesPerMinute), 0)
    : 0;

  return (
    <div className="summary-box">
      <h2>{t("summary.title")}</h2>
      <div className="summary-row">
        <span className="summary-label">{t("summary.totalCalories")}</span>
        <span className="summary-value">
          <strong>{totalCalories} {t("common.cal")}</strong>
        </span>
      </div>
      <div className="summary-row">
        <span className="summary-label">{t("summary.longest")}</span>
        <span className="summary-value">
          {longestExercise.exercise.name} ({longestExercise.exercise.durationMinutes} min)
        </span>
      </div>
      {bestDay != null && (
        <div className="summary-row">
          <span className="summary-label">{t("summary.bestDay")}</span>
          <span className="summary-value">
            {t(`days.${bestDay}`)} ({bestDayCalories.toFixed(0)} {t("common.cal")})
          </span>
        </div>
      )}
    </div>
  );
};

export default Summary;
