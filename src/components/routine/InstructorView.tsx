import React from "react";
import type { UserProfile } from "../../types/models";
import type { InstructorViewProps } from "../../types/forms";
import { calculateWeeklyLoad, formatDuration } from "../../utils/calculations";
import "./RoutineViews.css";

export const InstructorView = ({ instructor }: InstructorViewProps): React.JSX.Element => (
  <div className="instructor-view">
    <h2>👨‍🏫 Instructor: {instructor.name}</h2>
    {instructor.assignedUsers.map((user: UserProfile) => {
      const load = calculateWeeklyLoad(user.assignedRoutine);
      return (
        <div key={user.id} className="instructor-user-row">
          <div className="instructor-user-name">{user.name} ({user.experienceLevel})</div>
          <div className="instructor-user-routine">Rutina: {user.assignedRoutine.name}</div>
          <div className="instructor-user-summary">
            Semana: {load.daysTrained} días | {formatDuration(load.totalMinutes)} | {load.totalCalories.toFixed(0)} kcal
          </div>
        </div>
      );
    })}
  </div>
);
