interface BMIValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BMIValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (!isNaN(height) && !isNaN(weight)) {
    return { height, weight };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

type BMIcategory = 'Normal range' | 'Underweight' | 'Mild to moderate overweight' | 'Obese';

export function calculateBmi(height: number, weight: number): BMIcategory {
  const BMI: number = weight / ((height / 100) ** 2);

  if (BMI < 18.5) return 'Underweight';
  else if (BMI <= 22.9) return 'Normal range';
  else if (BMI <= 27.4) return 'Mild to moderate overweight';
  else return 'Obese';
}

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
