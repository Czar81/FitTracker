import { type SubmitHandler, useForm } from "react-hook-form";
import type { Exercise, DayOfWeek, ExerciseFormInput, ExerciseFormProps } from "../../../types/core";
import { useExerciseStore } from "../../../store/excersiceStore";
import React from "react";
import "../Profile/ProfileForm.css";

const DAYS: DayOfWeek[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export const ExerciseForm = ({ onExerciseAdded }: ExerciseFormProps): React.JSX.Element => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ExerciseFormInput>();
  const { addExercise } = useExerciseStore();

  const onSubmit: SubmitHandler<ExerciseFormInput> = (data: ExerciseFormInput): void => {
    const exercise: Exercise = {
      name: data.exerciseName,
      durationMinutes: data.durationMinutes,
      caloriesPerMinute: data.caloriesPerMinute,
      distanceKm: data.distanceKm != null && !isNaN(data.distanceKm) ? data.distanceKm : undefined,
    };
    addExercise({ day: data.day, exercise });
    reset();
    onExerciseAdded?.();
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      <h2>Agregar ejercicio</h2>

      <div className="form-group">
        <label>Día</label>
        <select {...register("day", { required: "Este campo es requerido" })}>
          <option value="">Seleccionar día...</option>
          {DAYS.map((day: DayOfWeek) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        {errors.day && <span className="error">{errors.day.message}</span>}
      </div>

      <div className="form-group">
        <label>Nombre del ejercicio</label>
        <input
          {...register("exerciseName", { required: "Este campo es requerido" })}
          placeholder="ej. Running, Swimming, Squats"
        />
        {errors.exerciseName && <span className="error">{errors.exerciseName.message}</span>}
      </div>

      <div className="form-group">
        <label>Duración (minutos)</label>
        <input
          type="number"
          {...register("durationMinutes", {
            required: "Este campo es requerido",
            valueAsNumber: true,
            min: { value: 1, message: "Mínimo 1 minuto" },
          })}
        />
        {errors.durationMinutes && <span className="error">{errors.durationMinutes.message}</span>}
      </div>

      <div className="form-group">
        <label>Calorías por minuto</label>
        <input
          type="number"
          step="0.1"
          {...register("caloriesPerMinute", {
            required: "Este campo es requerido",
            valueAsNumber: true,
            min: { value: 0.1, message: "Debe ser mayor a 0" },
          })}
        />
        {errors.caloriesPerMinute && <span className="error">{errors.caloriesPerMinute.message}</span>}
      </div>

      <div className="form-group">
        <label>Distancia (km) — Opcional</label>
        <input
          type="number"
          step="0.1"
          {...register("distanceKm", { valueAsNumber: true })}
          placeholder="Solo para cardio con distancia"
        />
        {errors.distanceKm && <span className="error">{errors.distanceKm.message}</span>}
      </div>

      <button type="submit" className="submit-btn">Agregar ejercicio</button>
    </form>
  );
};
