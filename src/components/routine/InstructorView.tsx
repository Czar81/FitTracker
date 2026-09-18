import React from "react";
import type { UserProfile } from "../../types/models";
import type { InstructorViewProps } from "../../types/forms";
import { calculateWeeklyLoad, formatDuration } from "../../utils/calculations";
import "./RoutineViews.css";
import { useTranslation } from "react-i18next";

export const InstructorView = ({ instructor }: InstructorViewProps): React.JSX.Element => {
  const { t } = useTranslation();
  return (
  <div className="instructor-view">
    <h2>{t("nav.instructor")}: {instructor.name}</h2>
    {instructor.assignedUsers.map((user: UserProfile) => {
      const load = calculateWeeklyLoad(user.assignedRoutine);
      return (
        <div key={user.id} className="instructor-user-row">
          <div className="instructor-user-name">{user.name} ({t(`levels.${user.experienceLevel}`)})</div>
          <div className="instructor-user-routine">{t("nav.routine")}: {user.assignedRoutine.name}</div>
          <div className="instructor-user-summary">
            {t("routine.startDate")} {load.daysTrained} | {formatDuration(load.totalMinutes)} | {load.totalCalories.toFixed(0)} kcal
          </div>
        </div>
      );
    })}
  </div>
  );
};
