import { type SubmitHandler, useForm } from "react-hook-form";
import type { Exercise } from "../../../types/models";
import type { DayOfWeek, ExerciseCategory } from "../../../types/enums";
import type { ExerciseFormProps, FlatExerciseFormInput } from "../../../types/forms";
import { useExerciseStore } from "../../../store/excersiceStore";
import React from "react";
import { useState } from "react";
import "../Profile/ProfileForm.css";

const DAYS: DayOfWeek[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const CATEGORIES: ExerciseCategory[] = ["Cardio", "Strength", "Flexibility"];

export const ExerciseForm = ({ onExerciseAdded }: ExerciseFormProps): React.JSX.Element => {
  const [category, setCategory] = useState<ExerciseCategory | "">("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FlatExerciseFormInput>();
  const { addExercise } = useExerciseStore();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const next = e.target.value as ExerciseCategory | "";
    setCategory(next);
  };

  const onSubmit: SubmitHandler<FlatExerciseFormInput> = (data: FlatExerciseFormInput): void => {
    let exercise: Exercise;

    switch (data.category) {
      case "Cardio": {
        if (data.distanceKm == null || data.rhythm == null || data.heartRateZone == null) {
          throw new Error("Faltan campos requeridos para Cardio");
        }
        exercise = {
          id: crypto.randomUUID(),
          type: "Cardio",
          name: data.exerciseName,
          durationMinutes: data.durationMinutes,
          caloriesPerMinute: data.caloriesPerMinute,
          distanceKm: data.distanceKm,
          rhythm: data.rhythm,
          heartRateZone: data.heartRateZone,
        };
        break;
      }
      case "Strength": {
        if (data.sets == null || data.weight == null || data.repetitions == null) {
          throw new Error("Faltan campos requeridos para Strength");
        }
        exercise = {
          id: crypto.randomUUID(),
          type: "Strength",
          name: data.exerciseName,
          durationMinutes: data.durationMinutes,
          caloriesPerMinute: data.caloriesPerMinute,
          sets: data.sets,
          weight: data.weight,
          repetitions: data.repetitions,
        };
        break;
      }
      case "Flexibility": {
        if (data.poses == null || data.positions == null) {
          throw new Error("Faltan campos requeridos para Flexibility");
        }
        exercise = {
          id: crypto.randomUUID(),
          type: "Flexibility",
          name: data.exerciseName,
          durationMinutes: data.durationMinutes,
          caloriesPerMinute: data.caloriesPerMinute,
          poses: data.poses,
          positions: data.positions,
        };
        break;
      }
      default: {
        const _exhaustive: never = data.category;
        throw new Error(`Categoría no soportada: ${_exhaustive}`);
      }
    }

    addExercise({ day: data.day, exercise });
    reset();
    setCategory("");
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
        <label>Categoría</label>
        <select
          {...register("category", {
            required: "Este campo es requerido",
            onChange: handleCategoryChange,
          })}
        >
          <option value="">Seleccionar categoría...</option>
          {CATEGORIES.map((cat: ExerciseCategory) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className="error">{errors.category.message}</span>}
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
          placeholder="ej. 30"
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
          placeholder="ej. 8.5"
        />
        {errors.caloriesPerMinute && <span className="error">{errors.caloriesPerMinute.message}</span>}
      </div>

      {category === "Cardio" && (
        <>
          <div className="form-group">
            <label>Distancia (km)</label>
            <input
              type="number"
              step="0.1"
              {...register("distanceKm", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Cardio" || (val != null && val > 0) || "Requerido para Cardio",
              })}
              placeholder="ej. 5.2"
            />
            {errors.distanceKm && <span className="error">{errors.distanceKm.message}</span>}
          </div>

          <div className="form-group">
            <label>Ritmo (min/km)</label>
            <input
              type="number"
              step="0.1"
              {...register("rhythm", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Cardio" || (val != null && val > 0) || "Requerido para Cardio",
              })}
              placeholder="ej. 5.0"
            />
            {errors.rhythm && <span className="error">{errors.rhythm.message}</span>}
          </div>

          <div className="form-group">
            <label>Zona de frecuencia cardíaca</label>
            <input
              {...register("heartRateZone", {
                validate: (val) =>
                  category !== "Cardio" || (val != null && val.trim() !== "") || "Requerido para Cardio",
              })}
              placeholder="ej. Zona 2, Aeróbica"
            />
            {errors.heartRateZone && <span className="error">{errors.heartRateZone.message}</span>}
          </div>
        </>
      )}

      {category === "Strength" && (
        <>
          <div className="form-group">
            <label>Series</label>
            <input
              type="number"
              {...register("sets", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Strength" || (val != null && val > 0) || "Requerido para Strength",
              })}
              placeholder="ej. 3"
            />
            {errors.sets && <span className="error">{errors.sets.message}</span>}
          </div>

          <div className="form-group">
            <label>Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              {...register("weight", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Strength" || (val != null && val > 0) || "Requerido para Strength",
              })}
              placeholder="ej. 60"
            />
            {errors.weight && <span className="error">{errors.weight.message}</span>}
          </div>

          <div className="form-group">
            <label>Repeticiones</label>
            <input
              type="number"
              {...register("repetitions", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Strength" || (val != null && val > 0) || "Requerido para Strength",
              })}
              placeholder="ej. 10"
            />
            {errors.repetitions && <span className="error">{errors.repetitions.message}</span>}
          </div>
        </>
      )}

      {category === "Flexibility" && (
        <>
          <div className="form-group">
            <label>Posturas</label>
            <input
              type="number"
              {...register("poses", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Flexibility" || (val != null && val > 0) || "Requerido para Flexibility",
              })}
              placeholder="ej. 5"
            />
            {errors.poses && <span className="error">{errors.poses.message}</span>}
          </div>

          <div className="form-group">
            <label>Posiciones</label>
            <input
              type="number"
              {...register("positions", {
                valueAsNumber: true,
                validate: (val) =>
                  category !== "Flexibility" || (val != null && val > 0) || "Requerido para Flexibility",
              })}
              placeholder="ej. 3"
            />
            {errors.positions && <span className="error">{errors.positions.message}</span>}
          </div>
        </>
      )}

      <button type="submit" className="submit-btn">Agregar ejercicio</button>
    </form>
  );
};
