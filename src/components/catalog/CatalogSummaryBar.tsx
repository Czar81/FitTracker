import React from "react";
import type { CatalogSummaryBarProps } from "../../types/forms";
import { formatDuration } from "../../utils/calculations";
import { useTranslation } from "react-i18next";

export const CatalogSummaryBar = ({ summary }: CatalogSummaryBarProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { cardio, strength, flexibility } = summary;

  const totalExercises =
    cardio.entries.length + strength.entries.length + flexibility.entries.length;
  const totalMinutes = cardio.totalMinutes + strength.totalMinutes + flexibility.totalMinutes;
  const totalCalories = cardio.totalCalories + strength.totalCalories + flexibility.totalCalories;
  const totalBonus = cardio.bonusCount + strength.bonusCount + flexibility.bonusCount;

  return (
    <div className="catalog-summary-bar">
      <div className="catalog-summary-item">
        <span className="catalog-summary-label">{t("catalog.summaryExercises")}</span>
        <span className="catalog-summary-value">{totalExercises}</span>
      </div>
      <div className="catalog-summary-item">
        <span className="catalog-summary-label">{t("catalog.summaryDuration")}</span>
        <span className="catalog-summary-value">{formatDuration(totalMinutes)}</span>
      </div>
      <div className="catalog-summary-item">
        <span className="catalog-summary-label">{t("catalog.summaryCalories")}</span>
        <span className="catalog-summary-value">{totalCalories} cal</span>
      </div>
      <div className="catalog-summary-item">
        <span className="catalog-summary-label">{t("common.bonus")}</span>
        <span className="catalog-summary-value">{totalBonus}</span>
      </div>
    </div>
  );
};
