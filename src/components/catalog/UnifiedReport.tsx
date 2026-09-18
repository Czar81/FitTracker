import React from "react";
import type { CategoryGroup, UnifiedReport } from "../../types/models";
import { formatDuration } from "../../utils/calculations";
import { generateExerciseDescription } from "../../utils/descriptions";
import "./UnifiedReport.css";
import { useTranslation } from "react-i18next";

type UnifiedReportProps = {
  report: UnifiedReport;
};

export const UnifiedReportView = ({ report }: UnifiedReportProps): React.JSX.Element => {
  const { t } = useTranslation();
  const groups: CategoryGroup[] = [report.summary.cardio, report.summary.strength, report.summary.flexibility];

  return (
    <section className="unified-report">
      <h2>{t("report.title")}</h2>
      <div className="unified-report-metrics">
        <span>{report.totalExercises} {t("common.exercises")}</span>
        <span>{formatDuration(report.totalMinutes)}</span>
        <span>{report.localExercises} {t("report.localExercises")}</span>
        <span>{report.apiExercises} {t("report.apiExercises")}</span>
      </div>

      <div className="unified-report-groups">
        {groups.map((group: CategoryGroup) => (
          <div className="unified-report-group" key={group.category}>
            <div className="unified-report-group-header">
              <h3>{t(`categories.${group.category}`)}</h3>
              <span>{t("catalog.count", { count: group.entries.length, duration: formatDuration(group.totalMinutes), calories: group.totalCalories.toFixed(0) })}</span>
            </div>
            {group.entries.length === 0 ? (
              <p className="category-empty">{t("catalog.empty")}</p>
            ) : (
              <ul>
                {group.entries.map((entry) => (
                  <li key={entry.exercise.id}>
                    {entry.exercise.name}, {formatDuration(entry.exercise.durationMinutes)} | {generateExerciseDescription(entry.exercise)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="unified-report-incomplete">
        <h3>{t("report.incomplete")} ({report.incomplete.length})</h3>
        {report.incomplete.length === 0 ? (
          <p>{t("report.noRejected")}</p>
        ) : (
          <ul>
            {report.incomplete.map((result, index) => (
              <li key={`${result.raw.name}-${index}`}>
                {result.raw.name || t("common.noName")} · {t("report.missing")} {result.missingFields.join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};