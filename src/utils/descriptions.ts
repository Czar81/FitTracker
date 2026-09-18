import type { Exercise, CardioExercise, StrengthExercise, FlexibilityExercise } from "../types/models";
import i18n from "../i18n";

const describeCardio = (exercise: CardioExercise): string =>
    `${exercise.distanceKm}km | ${i18n.t("descriptions.pace")} ${exercise.rhythm} min/km`

const describeStrength = (exercise: StrengthExercise): string =>
    `${exercise.sets} ${i18n.t("descriptions.series")} x ${exercise.repetitions} ${i18n.t("descriptions.reps")} | ${exercise.weight}kg`

const describeFlexibility = (exercise: FlexibilityExercise): string =>
    `${exercise.poses} ${i18n.t("descriptions.poses")}`

export const generateExerciseDescription = (exercise: Exercise): string => {
    switch (exercise.type) {
        case "Cardio":
            return describeCardio(exercise)
        case "Strength":
            return describeStrength(exercise)

        case "Flexibility":
            return describeFlexibility(exercise)

        default: {
            const _exhaustive: never = exercise;
            return _exhaustive;
        }
    }
};
