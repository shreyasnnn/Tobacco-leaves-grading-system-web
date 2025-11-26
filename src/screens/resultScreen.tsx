import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/navBar";
import { Button } from "@/components/button";
import { ToastNotification } from "../components/toastNotification";
import { API_BASE_URL } from "@/config/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Grade colors matching backend
const GRADE_COLORS: Record<string, string> = {
  Black_Thargu: "#1f2937",
  Grade_1: "#10b981",
  Grade_2: "#22c55e",
  Grade_3: "#eab308",
  Haccha_Hasiru: "#84cc16",
  Hasiru: "#16a34a",
  Red_Thargu: "#ef4444",
};

type ChartType = "bar" | "pie" | "line" | "radar";

export default function ResultScreen() {
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isNotUploaded, setIsNotUploaded] = useState<boolean>(true);
  const [selectedChart, setSelectedChart] = useState<ChartType>("bar");

  const location = useLocation();
  const navigate = useNavigate();

  const { result, confidence, imagePreview, file, userId, allProbabilities } =
    location.state || {};

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (confidence !== undefined) {
      setTimeout(() => {
        setWidth(confidence);
      }, 100);
    }
  }, [confidence]);

  // Prepare chart data from all probabilities
  const chartData = allProbabilities
    ? Object.entries(allProbabilities).map(([grade, prob]) => ({
        name: grade.replace(/_/g, " "),
        value: Number(prob),
        fullName: grade,
        fill: GRADE_COLORS[grade] || "#6b7280",
      }))
    : [];

  const handleSave = async () => {
    if (!file || !userId) {
      setError("Missing file or user ID for saving.");
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      formData.append("result", result);
      formData.append("confidence", confidence);

      const res = await fetch(`${API_BASE_URL}/save`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        setToast("✅ Saved to history successfully!");
        setIsNotUploaded(false);
      } else {
        throw new Error(json.error || "Failed to save");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save to history");
    } finally {
      setIsSaving(false);
    }
  };

  const renderChart = () => {
    if (!chartData.length) return null;

    const commonProps = {
      width: 500,
      height: 350,
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (selectedChart) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: "Confidence (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(2)}%`,
                  "Confidence",
                ]}
                labelStyle={{ color: "#000" }}
              />
              <Bar dataKey="value" name="Confidence" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const name = props.name || "";
                  const value = props.value || 0;
                  return `${name}: ${value.toFixed(1)}%`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: "Confidence (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(2)}%`,
                  "Confidence",
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Confidence"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Confidence"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <p className="text-red-500 mt-4 text-center bg-red-50 p-2 rounded-md border border-red-200">
            {error}
          </p>
        )}

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-green-800 text-center drop-shadow-sm mb-10">
          Prediction Result
        </h1>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Image and Result Info */}
          <div className="space-y-6">
            {/* Image Card */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="rounded-xl w-full max-h-96 object-contain"
              />
            </div>

            {/* Result Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-green-800">{result}</p>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {confidence?.toFixed(2)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-200 rounded-full w-full h-4 overflow-hidden">
                <div
                  className="bg-green-500 rounded-full h-full transition-all duration-700 ease-out"
                  style={{ width: `${width}%` }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Higher-grade leaves fetch better market prices.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                {isNotUploaded ? (
                  <Button
                    variant="secondary"
                    className="rounded-2xl bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "💾 Save to history"}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="rounded-2xl bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => navigate("/history")}
                  >
                    Check history
                  </Button>
                )}

                <Button
                  variant="empty"
                  className="rounded-2xl bg-green-100 hover:bg-green-200 text-green-700"
                  onClick={() => navigate("/")}
                >
                  Try Another
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Charts */}
          {chartData.length > 0 && (
            <div className="space-y-6">
              {/* Chart Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
                <h2 className="text-2xl font-bold text-green-800 mb-4">
                  Confidence Analysis
                </h2>

                {/* Chart Type Selector */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <button
                    onClick={() => setSelectedChart("bar")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedChart === "bar"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setSelectedChart("pie")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedChart === "pie"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pie
                  </button>
                  <button
                    onClick={() => setSelectedChart("line")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedChart === "line"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setSelectedChart("radar")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedChart === "radar"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Radar
                  </button>
                </div>

                {/* Chart Display */}
                <div className="mt-4">{renderChart()}</div>
              </div>

              {/* Top 3 Predictions Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Top 3 Predictions
                </h3>
                <div className="space-y-3">
                  {chartData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div
                        key={item.fullName}
                        className="flex items-center justify-between p-4 rounded-xl transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: `${item.fill}15` }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: item.fill }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.name}
                            </p>
                            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${item.value}%`,
                                  backgroundColor: item.fill,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <span
                          className="text-2xl font-bold"
                          style={{ color: item.fill }}
                        >
                          {item.value.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <ToastNotification
          message={toast}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </div>
  );
}
