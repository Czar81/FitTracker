import { type SubmitHandler, useForm } from "react-hook-form";
import type { Exercise } from "../../../types/models";
import type { DayOfWeek, ExerciseCategory } from "../../../types/enums";
import type { ExerciseFormProps, FlatExerciseFormInput } from "../../../types/forms";
import { calcPace, calcCalories } from "../../../utils/calculations";
import { useUserStore } from "../../../store/userStore";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../Profile/ProfileForm.css";

const DAYS: DayOfWeek[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const CATEGORIES: ExerciseCategory[] = ["Cardio", "Strength", "Flexibility"];

const isExerciseCategory = (value: string): value is ExerciseCategory =>
  CATEGORIES.some((category: ExerciseCategory): boolean => category === value);

export const ExerciseForm = ({ onExerciseAdded }: ExerciseFormProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<ExerciseCategory | "">("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FlatExerciseFormInput>();
  const { addExercise } = useUserStore();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const next = e.target.value;
    if (next === "") {
      setCategory("");
      return;
    }
    if (isExerciseCategory(next)) {
      setCategory(next);
    }
  };

  const onSubmit: SubmitHandler<FlatExerciseFormInput> = (data: FlatExerciseFormInput): void => {
    let exercise: Exercise;

    switch (data.category) {
      case "Cardio": {
        if (data.distanceKm == null || data.heartRateZone == null) {
          throw new Error(t("errors.missingCardio"));
        }
        exercise = {
          id: crypto.randomUUID(),
          type: "Cardio",
          name: data.exerciseName,
          durationMinutes: data.durationMinutes,
          caloriesPerMinute: data.caloriesPerMinute,
          status: data.status ?? "pending",
          source: "local",
          distanceKm: data.distanceKm,
          rhythm: calcPace(data.durationMinutes, data.distanceKm),
          heartRateZone: data.heartRateZone,
          caloriesBurned: calcCalories(data.durationMinutes, data.caloriesPerMinute),
        };
        break;
      }
      case "Strength": {
        if (data.sets == null || data.weight == null || data.repetitions == null) {
          throw new Error(t("errors.missingStrength"));
        }
        exercise = {
          id: crypto.randomUUID(),
          type: "Strength",
          name: data.exerciseName,
          durationMinutes: data.durationMinutes,
          caloriesPerMinute: data.caloriesPerMinute,
          status: data.status ?? "pending",
          source: "local",
          sets: data.sets,
          weight: data.weight,
          repetitions: data.repetitions,
        };
        break;
      }
      case "Flexibility": {
        if (data.poses == null) {
          throw new Error(t("errors.missingFlexibility"));
        }
        exercise = {
          id: crypto.randomUUID(),
          type: "Flexibility",
          name: data.exerciseName,
          durationMinutes: data.durationMinutes,
          caloriesPerMinute: data.caloriesPerMinute,
          status: data.status ?? "pending",
          source: "local",
          poses: data.poses,
          comments: data.comments,
        };
        break;
      }
      default: {
        const _exhaustive: never = data.category;
        throw new Error(t("errors.unsupportedCategory", { category: _exhaustive }));
      }
    }

    addExercise(data.day, exercise);
    reset();
    setCategory("");
    onExerciseAdded?.();
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      <h2>{t("form.addExercise")}</h2>

      <div className="form-group">
        <label>{t("form.day")}</label>
        <select {...register("day", { required: t("validation.required") })}>
          <option value="">{t("form.selectDay")}</option>
          {DAYS.map((day: DayOfWeek) => (
            <option key={day} value={day}>{t(`days.${day}`)}</option>
          ))}
        </select>
        {errors.day && <span className="error">{errors.day.message}</span>}
      </div>

      <div className="form-group">
        <label>{t("form.category")}</label>
        <select
          {...register("category", {
            required: t("validation.required"),
            onChange: handleCategoryChange,
          })}
        >
          <option value="">{t("form.selectCategory")}</option>
          {CATEGORIES.map((cat: ExerciseCategory) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className="error">{errors.category.message}</span>}
      </div>

      <div className="form-group">
        <label>{t("form.exerciseName")}</label>
        <input
          {...register("exerciseName", { required: t("validation.required") })}
          placeholder={t("form.placeholderName")}
        />
        {errors.exerciseName && <span className="error">{errors.exerciseName.message}</span>}
      </div>

      <div className="form-group">
        <label>{t("form.duration")}</label>
        <input
          type="number"
          {...register("durationMinutes", {
            required: t("validation.required"),
            valueAsNumber: true,
            min: { value: 1, message: t("validation.minMinute") },
          })}
          placeholder="30"
        />
        {errors.durationMinutes && <span className="error">{errors.durationMinutes.message}</span>}
      </div>

      <div className="form-group">
        <label>{t("form.caloriesPerMinute")}</label>
        <input
          type="number"
          step="0.1"
          {...register("caloriesPerMinute", {
            required: t("validation.required"),
            valueAsNumber: true,
            min: { value: 0.1, message: t("validation.positive") },
          })}
          placeholder="8.5"
        />
        {errors.caloriesPerMinute && <span className="error">{errors.caloriesPerMinute.message}</span>}
      </div>

      {category === "Cardio" && (
        <>
          <div className="form-group">
            <label>{t("form.distance")}</label>
            <input
              type="number"
              step="0.1"
              {...register("distanceKm", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Cardio" || (val != null && val > 0) || "Requerido para Cardio",
              })}
              placeholder="5.2"
            />
            {errors.distanceKm && <span className="error">{errors.distanceKm.message}</span>}
          </div>

          <div className="form-group">
            <label>{t("form.heartRateZone")}</label>
            <input
              {...register("heartRateZone", {
                validate: (val) =>
                  category !== "Cardio" || (val != null && val.trim() !== "") || "Requerido para Cardio",
              })}
              placeholder="Zone 2, Aerobic"
            />
            {errors.heartRateZone && <span className="error">{errors.heartRateZone.message}</span>}
          </div>
        </>
      )}

      {category === "Strength" && (
        <>
          <div className="form-group">
            <label>{t("form.sets")}</label>
            <input
              type="number"
              {...register("sets", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Strength" || (val != null && val > 0) || "Requerido para Strength",
              })}
              placeholder="3"
            />
            {errors.sets && <span className="error">{errors.sets.message}</span>}
          </div>

          <div className="form-group">
            <label>{t("form.weight")}</label>
            <input
              type="number"
              step="0.1"
              {...register("weight", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Strength" || (val != null && val > 0) || "Requerido para Strength",
              })}
              placeholder="60"
            />
            {errors.weight && <span className="error">{errors.weight.message}</span>}
          </div>

          <div className="form-group">
            <label>{t("form.repetitions")}</label>
            <input
              type="number"
              {...register("repetitions", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Strength" || (val != null && val > 0) || "Requerido para Strength",
              })}
              placeholder="10"
            />
            {errors.repetitions && <span className="error">{errors.repetitions.message}</span>}
          </div>
        </>
      )}

      {category === "Flexibility" && (
        <>
          <div className="form-group">
            <label>{t("form.poses")}</label>
            <input
              type="number"
              {...register("poses", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Flexibility" || (val != null && val > 0) || "Requerido para Flexibility",
              })}
              placeholder="5"
            />
            {errors.poses && <span className="error">{errors.poses.message}</span>}
          </div>

          <div className="form-group">
            <label>{t("form.optionalComment")}</label>
            <input {...register("comments")} placeholder={t("form.placeholderComment")} />
          </div>
        </>
      )}

      <div className="form-group">
        <label>{t("form.status")}</label>
        <select {...register("status")} defaultValue="pending">
          <option value="pending">{t("statuses.pending")}</option>
          <option value="completed">{t("statuses.completed")}</option>
          <option value="skipped">{t("statuses.skipped")}</option>
        </select>
      </div>

      <button type="submit" className="submit-btn">{t("form.add")}</button>
    </form>
  );
};
