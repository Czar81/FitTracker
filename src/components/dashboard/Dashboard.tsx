import React from "react";
import type { DashboardSummary, UserWeeklySummary } from "../../types/models";
import "./Dashboard.css";

export type DashboardSection = "routine" | "catalog" | "report" | "instructor";

export type DashboardProps = {
  summary: DashboardSummary;
  onNavigate: (section: DashboardSection) => void;
};

const recommendationLabel = (summary: UserWeeklySummary): string => {
  switch (summary.recommendation.level) {
    case "high":
      return `${summary.recommendation.message}`;
    case "low":
      return `${summary.recommendation.message}`;
    case "ok":
      return `${summary.recommendation.message}`;
  }
};

export const Dashboard = ({ summary, onNavigate }: DashboardProps): React.JSX.Element => {
  return (
    <div className="closing-dashboard">
      <div className="closing-dashboard-header">
        <h2>FitTracker Dashboard</h2>
      </div>

      <div className="closing-dashboard-grid">
        <div className="closing-dashboard-col">
          <section className="closing-dashboard-card">
            <h3>Estado del sistema</h3>
            <div className="closing-dashboard-stats">
              <div className="closing-dashboard-stat">
                <span className="closing-dashboard-stat-value">{summary.totalUsers}</span>
                <span className="closing-dashboard-stat-label">Usuarios</span>
              </div>
              <div className="closing-dashboard-stat">
                <span className="closing-dashboard-stat-value">{summary.totalExercises}</span>
                <span className="closing-dashboard-stat-label">
                  Ejercicios ({summary.localExercises} locales + {summary.apiExercises} desde API)
                </span>
              </div>
              <div className="closing-dashboard-stat">
                <span className="closing-dashboard-stat-value">{summary.activeRoutines}</span>
                <span className="closing-dashboard-stat-label">Rutinas activas</span>
              </div>
            </div>
          </section>

          <section className="closing-dashboard-card">
            <h3>Catalogo</h3>
            <div className="closing-dashboard-categories">
              <span>Cardio: {summary.categoryCounts.Cardio}</span>
              <span>Fuerza: {summary.categoryCounts.Strength}</span>
              <span>Flexibilidad: {summary.categoryCounts.Flexibility}</span>
            </div>
          </section>

          <section className="closing-dashboard-card">
            <h3>Ir a</h3>
            <div className="closing-dashboard-nav-grid">
              <button type="button" className="submit-btn submit-btn--small" onClick={(): void => onNavigate("routine")}>
                Mi rutina
              </button>
              <button type="button" className="submit-btn submit-btn--small" onClick={(): void => onNavigate("catalog")}>
                Catalogo
              </button>
              <button type="button" className="submit-btn submit-btn--small" onClick={(): void => onNavigate("report")}>
                Reporte unificado
              </button>
              <button
                type="button"
                className="submit-btn submit-btn--small"
                onClick={(): void => onNavigate("instructor")}
              >
                Vista de instructor
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
                {userSummary.routineName}, {userSummary.daysTrained} días | {userSummary.totalMinutes} min |{" "}
                {userSummary.totalCalories} kcal
              </p>
              <p className="closing-dashboard-recommendation">{recommendationLabel(userSummary)}</p>
            </section>
          ))}

          <section className="closing-dashboard-card">
            <h3>Actividad reciente</h3>
            {summary.recentActivity.length === 0 ? (
              <p className="category-empty">Todavía no hay actividad registrada.</p>
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
