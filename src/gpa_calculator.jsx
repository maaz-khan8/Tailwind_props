import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const gradeToGPA = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

export default function GPACalculator() {
  const [gpa, setGPA] = useState(null);
  const { register, control, watch } = useForm({
    defaultValues: {
      courses: [{ name: "", credits: 1, grade: "A" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses",
  });

  const courses = watch("courses");

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const credits = Number(course.credits);
      totalCredits += credits;
      totalPoints += gradeToGPA[course.grade] * credits;
    });

    setGPA(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          GPA Calculator
        </h2>

        <form onChange={calculateGPA}>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 bg-gray-50 p-3 rounded-md"
              >
                <input
                  {...register(`courses.${index}.name`)}
                  placeholder="Course Name"
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  {...register(`courses.${index}.credits`)}
                  type="number"
                  min="1"
                  max="4"
                  defaultValue={1}
                  className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  {...register(`courses.${index}.grade`)}
                  className="w-28 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(gradeToGPA).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade} ({gradeToGPA[grade]})
                    </option>
                  ))}
                </select>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={() => append({ name: "", credits: 1, grade: "A" })}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
              disabled={fields.length >= 10}
            >
              Add Course
            </button>
            <div className="text-lg font-semibold text-gray-700">
              GPA: <span className="text-blue-600">{gpa || "___"}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}