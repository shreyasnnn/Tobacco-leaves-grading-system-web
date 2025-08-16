import React, { useEffect, useState } from "react";
import { apiAnalytics } from "@/services/apiAnalysis";
import { AnalyticsData } from "@/types/analysis";
import NavBar from "@/components/navBar";

export const AnalysisScreen: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: apiData, error: apiError } = await apiAnalytics();
      if (apiError) setError(apiError);
      else setData(apiData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>Error loading analytics: {error.message || "Unknown error"}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />
      <div className="relative p-6 max-w-6xl mx-auto">
        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow pointer-events-none z-50"
            style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
          >
            {tooltip.text}
          </div>
        )}

        {/* Grade Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Grade Distribution
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">100%</span>
              <span className="text-sm text-green-600 font-medium">
                Total +10%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 h-48 mb-4">
            {data.gradeDistribution.map((item) => {
              const maxHeight = 160;
              const barHeight = (item.percentage / 100) * maxHeight;
              return (
                <div key={item.grade} className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <span className="text-xs font-medium text-gray-700">
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div
                      className="w-10 sm:w-16 bg-green-200 rounded-t-sm transition-all duration-300 hover:bg-green-300"
                      style={{ height: `${barHeight}px` }}
                      onMouseEnter={(e) =>
                        setTooltip({
                          visible: true,
                          x: e.clientX,
                          y: e.clientY,
                          text: `${item.grade}: ${item.count} (${item.percentage.toFixed(
                            1
                          )}%)`,
                        })
                      }
                      onMouseMove={(e) =>
                        setTooltip((prev) => ({
                          ...prev,
                          x: e.clientX,
                          y: e.clientY,
                        }))
                      }
                      onMouseLeave={() =>
                        setTooltip((prev) => ({ ...prev, visible: false }))
                      }
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium mt-3">
                    {item.grade}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Total Predictions
            </h4>
            <div className="text-3xl font-bold text-gray-900">
              {data.totalPredictions.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-100 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Average Confidence
            </h4>
            <div className="text-3xl font-bold text-gray-900">
              {data.averageConfidence}%
            </div>
          </div>
          <div className="bg-green-100 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Most Common Grade
            </h4>
            <div className="text-3xl font-bold text-gray-900">
              {data.mostCommonGrade}
            </div>
          </div>
        </div>

        {/* Trends */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Trends</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Predictions Over Time */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Predictions Over Time
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {data.trendsChange > 0 ? "+" : ""}
                    {data.trendsChange}%
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      data.trendsChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Last 30 Days {data.trendsChange > 0 ? "+" : ""}
                    {Math.abs(data.trendsChange)}%
                  </span>
                </div>
              </div>

              <div className="h-32 flex items-end justify-between mb-4">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <polyline
                    fill="none"
                    stroke="#15803D" // Orange-400
                    strokeWidth="2"
                    points={data.qualityTrends
                      .map((item, index) => {
                        const x =
                          (index /
                            Math.max(data.qualityTrends.length - 1, 1)) *
                          300;
                        const y =
                          100 -
                          (item.value /
                            Math.max(
                              ...data.qualityTrends.map((t) => t.value)
                            )) *
                            60;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />
                  {data.qualityTrends.map((item, index) => {
                    const x =
                      (index /
                        Math.max(data.qualityTrends.length - 1, 1)) *
                      300;
                    const y =
                      100 -
                      (item.value /
                        Math.max(
                          ...data.qualityTrends.map((t) => t.value)
                        )) *
                        60;
                    const date = new Date(item.date).toLocaleDateString(
                      "en",
                      { month: "short" }
                    );
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#15803D"
                        onMouseEnter={(e) =>
                          setTooltip({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            text: `${date}: ${item.value} predictions`,
                          })
                        }
                        onMouseMove={(e) =>
                          setTooltip((prev) => ({
                            ...prev,
                            x: e.clientX,
                            y: e.clientY,
                          }))
                        }
                        onMouseLeave={() =>
                          setTooltip((prev) => ({ ...prev, visible: false }))
                        }
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                {data.qualityTrends.map((item, index) => (
                  <span key={index}>
                    {new Date(item.date).toLocaleDateString("en", {
                      month: "short",
                    })}
                  </span>
                ))}
              </div>
            </div>

            {/* Confidence by Grade */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Confidence by Grade
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">90%</span>
                  <span className="text-sm text-red-600 font-medium">
                    Average -2%
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {data.confidenceByGrade.map((item) => (
                  <div
                    key={item.grade}
                    className="flex items-center gap-3"
                    onMouseEnter={(e) =>
                      setTooltip({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        text: `${item.grade}: ${item.confidence}%`,
                      })
                    }
                    onMouseMove={(e) =>
                      setTooltip((prev) => ({
                        ...prev,
                        x: e.clientX,
                        y: e.clientY,
                      }))
                    }
                    onMouseLeave={() =>
                      setTooltip((prev) => ({ ...prev, visible: false }))
                    }
                  >
                    <span className="text-sm text-gray-600 w-16 font-medium">
                      {item.grade}
                    </span>
                    <div className="flex-1">
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                          className="bg-green-700 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 w-8">
                      {item.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisScreen;
