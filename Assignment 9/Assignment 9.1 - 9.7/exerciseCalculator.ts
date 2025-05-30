export interface ExerciseValues {
  target: number;
  daily_exercises: number[];
}

const parseNewArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments. Provide a target and at least one day of data.');
  }

  const numbers = args.slice(2).map(val => {
    if (isNaN(Number(val))) {
      throw new Error(`Value "${val}" is not a number!`);
    }
    return Number(val);
  });

  const [target, ...daily_exercises] = numbers;

  return {
    target,
    daily_exercises
  };
};

type ratingScore = 1 | 2 | 3;

interface ExerciseObject {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: ratingScore;
  ratingDescription: string;
  target: number;
  average: number;
}

export function calculateExercises(exercises: number[], targetAmount: number): ExerciseObject {
  const periodLength = exercises.length;
  const trainingDays = exercises.filter(d => d > 0).length;
  const totalHours = exercises.reduce((sum, h) => sum + h, 0);
  const average = totalHours / periodLength;
  const success = average >= targetAmount;

  let rating: ratingScore;
  let ratingDescription: string;

  if (average < targetAmount * 0.75) {
    rating = 1;
    ratingDescription = "you need to work harder";
  } else if (average < targetAmount) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "great job, you hit your target!";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target: targetAmount,
    average
  };
}
if (require.main === module) {
  try {
    const { target, daily_exercises } = parseNewArguments(process.argv);
    console.log(calculateExercises(daily_exercises, target));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
};