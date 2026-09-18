import { type SubmitHandler, useForm } from "react-hook-form";
import React from "react";
import type { UserProfile } from "../../../types/models";
import type { ProfileFormInput } from "../../../types/forms";
import { useUserStore } from "../../../store/userStore";
import { useTranslation } from "react-i18next";
import "./ProfileForm.css";

export const ProfileForm = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormInput>();
  const { setProfile } = useUserStore();

  const onSubmit: SubmitHandler<ProfileFormInput> = (data: ProfileFormInput): void => {
    const user: UserProfile = {
      id: crypto.randomUUID(),
      name: data.name,
      age: data.age,
      email: data.email,
      experienceLevel: data.experienceLevel,
      assignedRoutine: {
        id: crypto.randomUUID(),
        name: t("profile.weeklyRoutine"),
        startDate: new Date().toISOString().split("T")[0],
        sessions: [],
      },
      membershipLevel: data.membershipLevel,
      memberSince: new Date().toISOString().split("T")[0],
      isActive: true,
    };
    setProfile(user);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      <h2>{t("profile.title")}</h2>

      <div className="form-group">
        <label>{t("profile.name")}</label>
        <input
          {...register("name", { required: t("validation.required") })}
          placeholder={t("profile.name")}
        />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label>{t("profile.age")}</label>
        <input
          type="number"
          placeholder={t("profile.age")}
          {...register("age", {
            required: t("validation.required"),
            valueAsNumber: true,
            min: { value: 0, message: t("validation.negative") },
            max: { value: 150, message: t("validation.invalidAge") },
          })}
        />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <div className="form-group">
        <label>{t("profile.email")}</label>
        <input
          type="email"
          {...register("email", { required: t("validation.required") })}
          placeholder="you@email.com"
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label>{t("profile.experience")}</label>
        <select {...register("experienceLevel", { required: t("validation.required") })}>
          <option value="">{t("form.selectCategory")}</option>
          <option value="Beginner">{t("levels.Beginner")}</option>
          <option value="Intermediate">{t("levels.Intermediate")}</option>
          <option value="Advanced">{t("levels.Advanced")}</option>
        </select>
        {errors.experienceLevel && <span className="error">{errors.experienceLevel.message}</span>}
      </div>

      <div className="form-group">
        <label>{t("profile.plan")}</label>
        <select {...register("membershipLevel", { required: t("validation.required") })}>
          <option value="">{t("form.selectCategory")}</option>
          <option value="Free">{t("levels.Free")}</option>
          <option value="Premium">{t("levels.Premium")}</option>
          <option value="Elite">{t("levels.Elite")}</option>
        </select>
        {errors.membershipLevel && <span className="error">{errors.membershipLevel.message}</span>}
      </div>

      <button type="submit" className="submit-btn">{t("profile.save")}</button>
    </form>
  );
};
