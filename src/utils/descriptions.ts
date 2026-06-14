import type { Exercise } from "../types/models";
import type { CardioExercise, StrengthExercise, FlexibilityExercise } from "../types/models";

const describeCardio = (exercise: CardioExercise): string =>
    `${exercise.distanceKm}km a ritmo ${exercise.rhythm} — Zona FC ${exercise.heartRateZone}`

const describeStrength = (exercise: StrengthExercise): string =>
    `${exercise.sets} series de ${exercise.repetitions} repeticiones — ${exercise.weight}kg`

const describeFlexibility = (exercise: FlexibilityExercise): string =>
    `${exercise.poses} poses en ${exercise.positions} posiciones`

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