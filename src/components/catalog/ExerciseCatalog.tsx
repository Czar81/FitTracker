import React from "react";
import type { ExerciseCatalogProps } from "../../types/forms";
import type { CatalogSummary } from "../../types/models";
import { groupByCategory } from "../../utils/calculations";
import { CategoryBlock } from "./CategoryBlock";
import { CatalogSummaryBar } from "./CatalogSummaryBar";
import "./ExerciseCatalog.css";
import { useTranslation } from "react-i18next";

export const ExerciseCatalog = ({ entries }: ExerciseCatalogProps): React.JSX.Element => {
  const { t } = useTranslation();
  const summary: CatalogSummary = groupByCategory(entries);

  return (
    <div className="exercise-catalog">
      <h2>{t("catalog.title")}</h2>
      <CatalogSummaryBar summary={summary} />
      <div className="catalog-blocks">
        <CategoryBlock group={summary.cardio} label={t("categories.Cardio")} />
        <CategoryBlock group={summary.strength} label={t("categories.Strength")} />
        <CategoryBlock group={summary.flexibility} label={t("categories.Flexibility")} />
      </div>
    </div>
  );
};
