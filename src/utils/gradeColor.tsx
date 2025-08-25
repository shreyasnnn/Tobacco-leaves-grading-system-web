// src/utils/gradeColors.ts
export const getGradeColor = (grade: string) => {
  switch (grade) {
    case "Grade_1":  // ✅ Fixed - removed backslash
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-300",
        full: "bg-emerald-100 text-emerald-800 border-emerald-300"
      };
    case "Grade_4":  // ✅ Fixed - removed backslash
      return {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-300",
        full: "bg-amber-100 text-amber-800 border-amber-300"
      };
    case "Grade_5":  // ✅ Fixed - removed backslash
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        full: "bg-gray-100 text-gray-800 border-gray-300"
      };
    case "RedThargu":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        full: "bg-red-100 text-red-800 border-red-300"
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

export const getProgressBarColor = (grade: string) => {
  switch (grade) {
    case "Grade_1":  // ✅ Fixed - removed backslash
      return "bg-emerald-600";
    case "Grade_4":  // ✅ Fixed - removed backslash
      return "bg-amber-600";
    case "Grade_5":  // ✅ Fixed - removed backslash
      return "bg-gray-600";
    case "RedThargu":
      return "bg-red-600";
    default:
      return "bg-gray-600";
  }
};

export const getChartColor = (grade: string) => {
  switch (grade) {
    case "Grade_1":  // ✅ Fixed - removed backslash
      return "#10b981"; // emerald-500
    case "Grade_4":  // ✅ Fixed - removed backslash
      return "#f59e0b"; // amber-500
    case "Grade_5":  // ✅ Fixed - removed backslash
      return "#6b7280"; // gray-500
    case "RedThargu":
      return "#ef4444"; // red-500
    default:
      return "#6b7280";
  }
};

export type GradeColor = ReturnType<typeof getGradeColor>;

// Optional: Export grade list for consistency
export const TOBACCO_GRADES = ['Grade_1', 'Grade_4', 'Grade_5', 'RedThargu'] as const;
export type TobaccoGrade = typeof TOBACCO_GRADES[number];
