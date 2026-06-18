import type { Exercise, CardioExercise, StrengthExercise, FlexibilityExercise } from "../types/models";

const describeCardio = (exercise: CardioExercise): string =>
    `${exercise.distanceKm}km | Ritmo: ${exercise.rhythm} min/km`

const describeStrength = (exercise: StrengthExercise): string =>
    `${exercise.sets} series x ${exercise.repetitions} reps | ${exercise.weight}kg`

const describeFlexibility = (exercise: FlexibilityExercise): string =>
    `${exercise.poses} poses`

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
