// src/utils/gradeColors.ts
// ✅ UPDATED FOR 7 GRADE SYSTEM

export const getGradeColor = (grade: string) => {
  switch (grade) {
    case "Grade_1":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-300",
        full: "bg-emerald-100 text-emerald-800 border-emerald-300"
      };
    case "Grade_2":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        full: "bg-green-100 text-green-800 border-green-300"
      };
    case "Grade_3":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        full: "bg-yellow-100 text-yellow-800 border-yellow-300"
      };
    case "Red_Thargu":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        full: "bg-red-100 text-red-800 border-red-300"
      };
    case "Black_Thargu":
      return {
        bg: "bg-gray-900",
        text: "text-white",
        border: "border-gray-700",
        full: "bg-gray-900 text-white border-gray-700"
      };
    case "Haccha_Hasiru":
      return {
        bg: "bg-lime-100",
        text: "text-lime-800",
        border: "border-lime-300",
        full: "bg-lime-100 text-lime-800 border-lime-300"
      };
    case "Hasiru":
      return {
        bg: "bg-green-200",
        text: "text-green-900",
        border: "border-green-400",
        full: "bg-green-200 text-green-900 border-green-400"
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
    case "Grade_1":
      return "bg-emerald-600";
    case "Grade_2":
      return "bg-green-600";
    case "Grade_3":
      return "bg-yellow-600";
    case "Red_Thargu":
      return "bg-red-600";
    case "Black_Thargu":
      return "bg-gray-900";
    case "Haccha_Hasiru":
      return "bg-lime-600";
    case "Hasiru":
      return "bg-green-700";
    default:
      return "bg-gray-600";
  }
};

export const getChartColor = (grade: string) => {
  switch (grade) {
    case "Grade_1":
      return "#10b981"; // emerald-500
    case "Grade_2":
      return "#22c55e"; // green-500
    case "Grade_3":
      return "#eab308"; // yellow-500
    case "Red_Thargu":
      return "#ef4444"; // red-500
    case "Black_Thargu":
      return "#1f2937"; // gray-800
    case "Haccha_Hasiru":
      return "#84cc16"; // lime-500
    case "Hasiru":
      return "#16a34a"; // green-600
    default:
      return "#6b7280";
  }
};

export type GradeColor = ReturnType<typeof getGradeColor>;

// ✅ UPDATED: Export 7 grades list for consistency
export const TOBACCO_GRADES = [
  'Grade_1', 
  'Grade_2', 
  'Grade_3', 
  'Red_Thargu', 
  'Black_Thargu', 
  'Haccha_Hasiru', 
  'Hasiru'
] as const;

export type TobaccoGrade = typeof TOBACCO_GRADES[number];
