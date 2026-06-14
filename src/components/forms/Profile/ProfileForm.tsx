import { type SubmitHandler, useForm } from "react-hook-form";
import React from "react";
import type { UserProfile } from "../../../types/models";
import type { ProfileFormInput } from "../../../types/forms";
import { useUserStore } from "../../../store/userStore";
import "./ProfileForm.css";

export const ProfileForm = (): React.JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormInput>();
  const { setProfile } = useUserStore();

  const onSubmit: SubmitHandler<ProfileFormInput> = (data: ProfileFormInput): void => {
    const user: UserProfile = {
      ...data,
      assignedRoutine: { name: "Mi rutina semanal", entries: [] },
    };
    setProfile(user);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      <h2>Configurar perfil</h2>

      <div className="form-group">
        <label>Nombre</label>
        <input
          {...register("name", { required: "Este campo es requerido" })}
          placeholder="Tu nombre"
        />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label>Edad</label>
        <input
          type="number"
          {...register("age", {
            required: "Este campo es requerido",
            valueAsNumber: true,
            min: { value: 0, message: "No puede ser negativa" },
            max: { value: 150, message: "Edad inválida" },
          })}
        />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <div className="form-group">
        <label>Nivel de experiencia</label>
        <select {...register("experienceLevel", { required: "Este campo es requerido" })}>
          <option value="">Seleccionar...</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        {errors.experienceLevel && <span className="error">{errors.experienceLevel.message}</span>}
      </div>

      <button type="submit" className="submit-btn">Guardar perfil</button>
    </form>
  );
};
