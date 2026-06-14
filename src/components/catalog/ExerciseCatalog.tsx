import React from "react";
import type { ExerciseCatalogProps } from "../../types/forms";
import type { CatalogSummary } from "../../types/models";
import { groupByCategory } from "../../utils/calculations";
import { CategoryBlock } from "./CategoryBlock";
import { CatalogSummaryBar } from "./CatalogSummaryBar";
import "./ExerciseCatalog.css";

export const ExerciseCatalog = ({ entries }: ExerciseCatalogProps): React.JSX.Element => {
  const summary: CatalogSummary = groupByCategory(entries);

  return (
    <div className="exercise-catalog">
      <h2>Catálogo de ejercicios</h2>
      <CatalogSummaryBar summary={summary} />
      <div className="catalog-blocks">
        <CategoryBlock group={summary.cardio} label="Cardio" />
        <CategoryBlock group={summary.strength} label="Fuerza" />
        <CategoryBlock group={summary.flexibility} label="Flexibilidad" />
      </div>
    </div>
  );
};
