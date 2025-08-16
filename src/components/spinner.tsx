import React from "react";

interface SpinnerProps {
  size?: number; // diameter in pixels
  color?: string; // Tailwind color class
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 12,
  color = "border-emerald-600",
}) => {
  const dimension = `${size}rem`; // convert size to rem for Tailwind
  return (
    <div
      className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 ${color}`}
    ></div>
  );
};

export default Spinner;
