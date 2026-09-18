import React from "react";
import type { DashboardSummary, UserWeeklySummary } from "../../types/models";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";

export type DashboardSection = "routine" | "catalog" | "report" | "instructor";

export type DashboardProps = {
  summary: DashboardSummary;
  onNavigate: (section: DashboardSection) => void;
};

const recommendationLabel = (summary: UserWeeklySummary, translate: (key: string) => string): string => {
  switch (summary.recommendation.level) {
    case "high":
      return translate("dashboard.recommendation.high");
    case "low":
      return translate("dashboard.recommendation.low");
    case "ok":
      return translate("dashboard.recommendation.ok");
  }
};

export const Dashboard = ({ summary, onNavigate }: DashboardProps): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="closing-dashboard">
      <div className="closing-dashboard-header">
        <h2>{t("dashboard.title")}</h2>
      </div>

      <div className="closing-dashboard-grid">
        <div className="closing-dashboard-col">
          <section className="closing-dashboard-card">
            <h3>{t("dashboard.system")}</h3>
            <div className="closing-dashboard-stats">
              <div className="closing-dashboard-stat">
                <span className="closing-dashboard-stat-value">{summary.totalUsers}</span>
                <span className="closing-dashboard-stat-label">{t("dashboard.users")}</span>
              </div>
              <div className="closing-dashboard-stat">
                <span className="closing-dashboard-stat-value">{summary.totalExercises}</span>
                <span className="closing-dashboard-stat-label">
                  {t("common.exercises")} ({summary.localExercises} {t("report.localExercises")} + {summary.apiExercises} {t("report.apiExercises")})
                </span>
              </div>
              <div className="closing-dashboard-stat">
                <span className="closing-dashboard-stat-value">{summary.activeRoutines}</span>
                <span className="closing-dashboard-stat-label">{t("dashboard.activeRoutines")}</span>
              </div>
            </div>
          </section>

          <section className="closing-dashboard-card">
            <h3>{t("dashboard.catalog")}</h3>
            <div className="closing-dashboard-categories">
              <span>Cardio: {summary.categoryCounts.Cardio}</span>
              <span>{t("categories.Strength")}: {summary.categoryCounts.Strength}</span>
              <span>{t("categories.Flexibility")}: {summary.categoryCounts.Flexibility}</span>
            </div>
          </section>

          <section className="closing-dashboard-card">
            <h3>{t("dashboard.goTo")}</h3>
            <div className="closing-dashboard-nav-grid">
              <button type="button" className="submit-btn submit-btn--small" onClick={(): void => onNavigate("routine")}>
                {t("nav.routine")}
              </button>
              <button type="button" className="submit-btn submit-btn--small" onClick={(): void => onNavigate("catalog")}>
                {t("nav.catalog")}
              </button>
              <button type="button" className="submit-btn submit-btn--small" onClick={(): void => onNavigate("report")}>
                {t("dashboard.unifiedReport")}
              </button>
              <button
                type="button"
                className="submit-btn submit-btn--small"
                onClick={(): void => onNavigate("instructor")}
              >
                {t("dashboard.instructorView")}
              </button>
            </div>
          </section>
        </div>

        <div className="closing-dashboard-col">
          {summary.userSummaries.map((userSummary: UserWeeklySummary) => (
            <section className="closing-dashboard-card closing-dashboard-user-card" key={userSummary.userName}>
              <h3>
                {userSummary.userName} ({userSummary.experienceLevel})
              </h3>
              <p className="closing-dashboard-routine-line">
                {t("dashboard.routineSummary", { routine: userSummary.routineName, days: userSummary.daysTrained, minutes: userSummary.totalMinutes, calories: userSummary.totalCalories })}
              </p>
              <p className="closing-dashboard-recommendation">{recommendationLabel(userSummary, t)}</p>
            </section>
          ))}

          <section className="closing-dashboard-card">
            <h3>{t("dashboard.recentActivity")}</h3>
            {summary.recentActivity.length === 0 ? (
              <p className="category-empty">{t("common.noActivity")}</p>
            ) : (
              <ul className="closing-dashboard-activity">
                {summary.recentActivity.map((entry: string, index: number) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
