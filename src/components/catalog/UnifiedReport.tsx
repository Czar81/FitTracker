import React from "react";
import type { CategoryGroup, UnifiedReport } from "../../types/models";
import { formatDuration } from "../../utils/calculations";
import { generateExerciseDescription } from "../../utils/descriptions";
import "./UnifiedReport.css";

type UnifiedReportProps = {
  report: UnifiedReport;
};

const CATEGORY_LABELS: Record<CategoryGroup["category"], string> = {
  Cardio: "Cardio",
  Strength: "Fuerza",
  Flexibility: "Flexibilidad",
};

export const UnifiedReportView = ({ report }: UnifiedReportProps): React.JSX.Element => {
  const groups: CategoryGroup[] = [report.summary.cardio, report.summary.strength, report.summary.flexibility];

  return (
    <section className="unified-report">
      <h2>Reporte unificado</h2>
      <div className="unified-report-metrics">
        <span>{report.totalExercises} ejercicios</span>
        <span>{formatDuration(report.totalMinutes)}</span>
        <span>{report.localExercises} locales</span>
        <span>{report.apiExercises} desde API</span>
      </div>

      <div className="unified-report-groups">
        {groups.map((group: CategoryGroup) => (
          <div className="unified-report-group" key={group.category}>
            <div className="unified-report-group-header">
              <h3>{CATEGORY_LABELS[group.category]}</h3>
              <span>{group.entries.length} ejercicios · {formatDuration(group.totalMinutes)}</span>
            </div>
            {group.entries.length === 0 ? (
              <p className="category-empty">Sin ejercicios en esta categoría</p>
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
        <h3>Datos incompletos ({report.incomplete.length})</h3>
        {report.incomplete.length === 0 ? (
          <p>No hay ejercicios rechazados.</p>
        ) : (
          <ul>
            {report.incomplete.map((result, index) => (
              <li key={`${result.raw.name}-${index}`}>
                {result.raw.name || "(sin nombre)"} · faltan: {result.missingFields.join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};