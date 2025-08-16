// src/utils/gradeColors.ts
export const getGradeColor = (grade: string) => {
  switch (grade) {
    case "Grade A":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-300",
        full: "bg-emerald-100 text-emerald-800 border-emerald-300"
      };
    case "Grade B":
      return {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-300",
        full: "bg-amber-100 text-amber-800 border-amber-300"
      };
    case "Grade C":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        full: "bg-blue-100 text-blue-800 border-blue-300"
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        full: "bg-gray-100 text-gray-800 border-gray-300"
      };
  }
};

export type GradeColor = ReturnType<typeof getGradeColor>;