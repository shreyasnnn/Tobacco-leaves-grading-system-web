import React, { useEffect, useState } from "react";
import { apiAnalytics } from "@/services/apiAnalysis";
import { AnalyticsData } from "@/types/analysis";
import NavBar from "@/components/navBar";
import { getGradeColor, getProgressBarColor } from "@/utils/gradeColor";
import { supabase } from "@/services/supabase";

export const AnalysisScreen: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  // Get current user ID from authentication
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (user) {
          setUserId(user.id);
        } else {
          setError(new Error("User not authenticated"));
        }
      } catch (error) {
        console.error("Failed to get user ID:", error);
        setError(error);
      }
    };
    
    getCurrentUserId();
  }, []);

  // Fetch user-specific analytics data
  useEffect(() => {
    if (!userId) return; // Wait for userId to be available
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: apiData, error: apiError } = await apiAnalytics(userId);
        if (apiError) {
          setError(apiError);
        } else {
          setData(apiData);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId]); // Depend on userId

  // Show loading while getting user ID
  if (!userId && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <NavBar />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <NavBar />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <NavBar />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center text-red-500 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading analytics</h3>
            <p className="text-gray-500">{error.message || "Unknown error"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <NavBar />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center text-gray-500 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No analytics data available</h3>
            <p className="text-gray-500">Start analyzing tobacco leaves to see your analytics here!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />
      <div className="relative p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            My Analytics Dashboard
          </h1>
          <p className="text-lg text-green-600">
            Your personal tobacco leaf analysis insights
          </p>
        </div>

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
              Your Grade Distribution
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">
                {data.totalPredictions}
              </span>
              <span className="text-sm text-green-600 font-medium">
                Total Predictions
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
                      className={`w-10 sm:w-16 ${getGradeColor(item.grade).full} rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer`}
                      style={{ height: `${Math.max(barHeight, 8)}px` }}
                      onMouseEnter={(e) =>
                        setTooltip({
                          visible: true,
                          x: e.clientX,
                          y: e.clientY,
                          text: `${item.grade}: ${item.count} predictions (${item.percentage.toFixed(1)}%)`,
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
              Your Total Predictions
            </h4>
            <div className="text-3xl font-bold text-gray-900">
              {data.totalPredictions.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-100 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Your Average Confidence
            </h4>
            <div className="text-3xl font-bold text-gray-900">
              {data.averageConfidence}%
            </div>
          </div>
          <div className="bg-green-100 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Your Most Common Grade
            </h4>
            <div className="text-3xl font-bold text-gray-900">
              {data.mostCommonGrade}
            </div>
          </div>
        </div>

        {/* Trends */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Trends</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Predictions Over Time */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Your Predictions Over Time
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {data.trendsChange > 0 ? "+" : ""}
                    {data.trendsChange}%
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      data.trendsChange >= 0 ? "text-green-600" : "text-red-600"
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
                    stroke="#15803D"
                    strokeWidth="2"
                    points={data.qualityTrends
                      .map((item, index) => {
                        const x =
                          (index / Math.max(data.qualityTrends.length - 1, 1)) *
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
                      (index / Math.max(data.qualityTrends.length - 1, 1)) *
                      300;
                    const y =
                      100 -
                      (item.value /
                        Math.max(...data.qualityTrends.map((t) => t.value))) *
                        60;
                    const date = new Date(item.date).toLocaleDateString("en", {
                      month: "short",
                    });
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#15803D"
                        className="cursor-pointer"
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
                  Your Confidence by Grade
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {data.averageConfidence}%
                  </span>
                  <span className={`text-sm font-medium ${
                    data.confidenceChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {data.confidenceChange > 0 ? "+" : ""}{data.confidenceChange}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {data.confidenceByGrade.map((item) => (
                  <div
                    key={item.grade}
                    className="flex items-center gap-3 cursor-pointer"
                    onMouseEnter={(e) =>
                      setTooltip({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        text: `${item.grade}: ${item.confidence}% average confidence`,
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${getProgressBarColor(item.grade)} h-2 rounded-full transition-all duration-500`}
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
