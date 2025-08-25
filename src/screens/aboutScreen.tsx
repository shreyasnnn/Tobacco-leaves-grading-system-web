import React, { useEffect, useState } from "react";
import NavBar from "@/components/navBar";
import { Button } from "@/components/button";
import { teamMembers, faqs, modelInfo } from "@/dataController/index";
import { apiAnalytics, AnalyticsData } from "@/services/apiAnalysis";
import { supabase } from "@/services/supabase"; // Add this import

const defaultAnalyticsData: AnalyticsData = {
  averageConfidence: 0,
  confidenceChange: 0,
  totalPredictions: 0,
  mostCommonGrade: 'N/A',
  gradeDistribution: [],
  qualityTrends: [],
  confidenceByGrade: [],
  trendsChange: 0
};

export default function AboutScreen(){
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // Add userId state
  const [error, setError] = useState<any>(null); // Add error state

  // Get current user ID from authentication
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (user) {
          setUserId(user.id);
        } else {
          console.warn("User not authenticated - showing default analytics");
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
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userId) {
          // ✅ Pass userId to apiAnalytics function
          const { data, error } = await apiAnalytics(userId);
          if (error) throw error;
          
          setAnalyticsData(data || defaultAnalyticsData);
        } else {
          // Use default data if no user (for demo purposes)
          setAnalyticsData({
            ...defaultAnalyticsData,
            averageConfidence: 85, // Demo value
            totalPredictions: 1250, // Demo value
            mostCommonGrade: 'Grade_1', // Demo value
            confidenceChange: 5 // Demo value
          });
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        setAnalyticsData(defaultAnalyticsData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); // ✅ Depend on userId

  // Separate guide from team members
  const guide = teamMembers.find((member) => member.isGuide);
  const members = teamMembers.filter((member) => !member.isGuide);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-800 drop-shadow-sm">
            About LeafGrade AI
          </h1>
          <p className="mt-4 text-lg text-green-600 max-w-3xl mx-auto">
            Revolutionizing tobacco leaf grading through advanced machine
            learning and agricultural expertise
          </p>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-green-100">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Our Technology
          </h2>
          <p className="text-gray-700 mb-8">
            LeafGrade AI uses advanced machine learning algorithms to analyze
            tobacco leaves and provide accurate grading. Our AI model is trained
            on a well-curated dataset of tobacco leaf images, ensuring high
            precision and consistency in grading.
          </p>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading performance data...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Model Accuracy */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  Model Performance
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Current Accuracy</span>
                  <span className="text-2xl font-bold text-green-700">
                    {analyticsData.averageConfidence}%
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700">Recent Change</span>
                  <span className={`text-xl font-bold ${
                    analyticsData.confidenceChange >= 0 ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {analyticsData.confidenceChange > 0 ? '+' : ''}
                    {analyticsData.confidenceChange}%
                  </span>
                </div>

                {userId && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      📊 Showing your personal model performance
                    </p>
                  </div>
                )}

                {/* Simple chart placeholder */}
                <div className="mt-6 h-40 bg-white rounded-lg border border-green-200 p-2">
                  <div className="flex h-full items-end space-x-1">
                    {[
                      65, 70, 75, 80, 85, 90, analyticsData.averageConfidence
                    ].map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-green-400 to-green-500 rounded-t-sm transition-all duration-300"
                        style={{ height: `${Math.max(val, 5)}%` }}
                        title={`${val}% accuracy`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>

              {/* Algorithm Details */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  Algorithm Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Model Version</p>
                    <p className="text-lg font-medium">
                      {modelInfo.version}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Training Dataset</p>
                    <p className="text-lg font-medium">
                      {modelInfo.datasetSize.toLocaleString()}+ curated images
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Predictions</p>
                    <p className="text-lg font-medium">
                      {analyticsData.totalPredictions.toLocaleString()}
                      {userId && <span className="text-sm text-gray-500 ml-1">(your predictions)</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consistency</p>
                    <p className="text-lg font-medium">
                      {analyticsData.averageConfidence}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Most Common Grade</p>
                    <p className="text-lg font-medium">
                      {analyticsData.mostCommonGrade}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Status Indicator */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${userId ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-700">
                {userId 
                  ? "✅ Showing personalized analytics based on your prediction history" 
                  : "📊 Showing demo analytics - sign in to see your personal data"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-green-100">
          <h2 className="text-2xl font-bold text-green-800 mb-6">Our Team</h2>

          {/* Guide */}
          {guide && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Project Guide
              </h3>
              <div className="bg-green-50 rounded-xl p-6 border-2 border-emerald-300">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-24 h-24">
                    {guide.imageUrl ? (
                      <img
                        src={guide.imageUrl}
                        alt={guide.name}
                        className="w-full h-full rounded-full object-cover border-2 border-emerald-400"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 text-3xl font-bold">
                        {guide.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold text-green-800">
                      {guide.name}
                    </h3>
                    <p className="text-emerald-600 mb-2">{guide.role}</p>
                    <p className="text-gray-700">{guide.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Members */}
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Technical Team
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-green-50 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border border-green-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-200 rounded-full flex items-center justify-center text-green-800 text-xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-center text-green-800">
                  {member.name}
                </h3>
                <p className="text-green-600 text-center mb-2 text-sm">
                  {member.role}
                </p>
                <p className="text-gray-700 text-center text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-green-100">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-green-100 pb-4 last:border-0 hover:bg-green-25 transition-colors duration-200 rounded-lg p-2"
              >
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-4 mt-1">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 mb-1">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-6 border-t border-green-200">
          <p>
            Advanced AI-powered tobacco leaf grading for precision agriculture.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} LeafGrade AI. All rights reserved.
          </p>
          <p className="mt-1 text-xs">
            Built with TensorFlow 2.20 • MobileNetV2 Architecture
          </p>
        </div>
      </div>
    </div>
  );
};

