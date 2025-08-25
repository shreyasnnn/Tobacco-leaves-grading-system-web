// services/apiAnalytics.ts
import { supabase } from './supabase';
import { AnalyticsData } from '@/types/analysis';
import { grades as gradeList } from '../dataController/index';

export type Grade = typeof gradeList[number];

// Define interface for monthly data
interface MonthlyDataItem {
  count: number;
  totalConfidence: number;
  date: Date;
}

const palette = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];
const gradeColors: Record<Grade, string> = Object.fromEntries(
  gradeList.map((g, i) => [g, palette[i % palette.length]])
) as Record<Grade, string>;

function normalizeGrade(value: string | null): Grade | null {
  if (!value) return null;
  const cleaned = value.trim().toLowerCase();
  const found = gradeList.find(g => g.toLowerCase() === cleaned);
  return found || null;
}

// ✅ Updated function to accept userId parameter
export async function apiAnalytics(userId: string) {
  try {
    // ✅ Get user-specific data only
    const { data: uploadHistory, error } = await supabase
      .from('upload_history')
      .select('*')
      .eq('user_id', userId) // ✅ Filter by specific user
      .order('processed_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return { data: null, error };
    }

    if (!uploadHistory || uploadHistory.length === 0) {
      return {
        data: {
          totalPredictions: 0,
          averageConfidence: 0,
          mostCommonGrade: 'N/A',
          gradeDistribution: gradeList.map(g => ({
            grade: g,
            count: 0,
            percentage: 0,
            color: gradeColors[g]
          })),
          qualityTrends: [],
          confidenceByGrade: gradeList.map(g => ({
            grade: g,
            confidence: 0
          })),
          trendsChange: 0,
          confidenceChange: 0
        } as AnalyticsData,
        error: null
      };
    }

    const total = uploadHistory.length;
    console.log(`Processing analytics for user ${userId}: ${total} records found`);

    // 1. GRADE DISTRIBUTION (User-specific)
    const gradeCounts = uploadHistory.reduce((acc, item) => {
      const normalized = normalizeGrade(item.result);
      if (normalized) {
        acc[normalized] = (acc[normalized] || 0) + 1;
      }
      return acc;
    }, {} as Record<Grade, number>);

    const gradeDistribution = gradeList.map(g => {
      const count = gradeCounts[g] || 0;
      return {
        grade: g,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        color: gradeColors[g]
      };
    });

    // 2. AVERAGE CONFIDENCE (User-specific)
    const averageConfidence = Math.round(
      uploadHistory.reduce((sum, item) => {
        const confidence = typeof item.confidence === 'string' 
          ? parseFloat(item.confidence) 
          : item.confidence;
        return sum + (confidence || 0);
      }, 0) / total
    );

    // 3. MOST COMMON GRADE (User-specific)
    const mostCommonGrade =
      gradeDistribution.sort((a, b) => b.count - a.count)[0]?.grade || 'N/A';

    // 4. CONFIDENCE BY GRADE (User-specific)
    const confidenceByGrade = gradeList.map(grade => {
      const gradeItems = uploadHistory.filter(item => 
        normalizeGrade(item.result) === grade
      );
      
      const avgConfidence = gradeItems.length > 0 
        ? Math.round(
            gradeItems.reduce((sum, item) => {
              const confidence = typeof item.confidence === 'string' 
                ? parseFloat(item.confidence) 
                : item.confidence;
              return sum + (confidence || 0);
            }, 0) / gradeItems.length
          )
        : 0;

      return {
        grade,
        confidence: avgConfidence
      };
    });

    // 5. QUALITY TRENDS (User-specific - Group by month)
    const monthlyData = uploadHistory.reduce((acc, item) => {
      const date = new Date(item.processed_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          count: 0,
          totalConfidence: 0,
          date: date
        };
      }
      
      acc[monthKey].count += 1;
      const confidence = typeof item.confidence === 'string' 
        ? parseFloat(item.confidence) 
        : item.confidence;
      acc[monthKey].totalConfidence += (confidence || 0);
      
      return acc;
    }, {} as Record<string, MonthlyDataItem>);

    // Get last 6 months for user
    const qualityTrends = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([monthKey, data]) => {
        const monthData = data as MonthlyDataItem;
        return {
          date: monthData.date.toISOString(),
          value: monthData.count,
          averageConfidence: Math.round(monthData.totalConfidence / monthData.count)
        };
      });

    // 6. TRENDS CHANGE (User-specific)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const currentPeriod = uploadHistory.filter(item => 
      new Date(item.processed_at) >= thirtyDaysAgo
    ).length;

    const previousPeriod = uploadHistory.filter(item => {
      const date = new Date(item.processed_at);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    }).length;

    const trendsChange = previousPeriod > 0 
      ? Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100)
      : currentPeriod > 0 ? 100 : 0;

    // 7. CONFIDENCE CHANGE (User-specific)
    const currentPeriodItems = uploadHistory.filter(item => 
      new Date(item.processed_at) >= thirtyDaysAgo
    );
    
    const previousPeriodItems = uploadHistory.filter(item => {
      const date = new Date(item.processed_at);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    });

    const currentPeriodConfidence = currentPeriodItems.length > 0
      ? currentPeriodItems.reduce((sum, item) => {
          const confidence = typeof item.confidence === 'string' 
            ? parseFloat(item.confidence) 
            : item.confidence;
          return sum + (confidence || 0);
        }, 0) / currentPeriodItems.length
      : 0;

    const previousPeriodConfidence = previousPeriodItems.length > 0
      ? previousPeriodItems.reduce((sum, item) => {
          const confidence = typeof item.confidence === 'string' 
            ? parseFloat(item.confidence) 
            : item.confidence;
          return sum + (confidence || 0);
        }, 0) / previousPeriodItems.length
      : 0;

    const confidenceChange = previousPeriodConfidence > 0
      ? Math.round(((currentPeriodConfidence - previousPeriodConfidence) / previousPeriodConfidence) * 100)
      : 0;

    const analyticsData: AnalyticsData = {
      totalPredictions: total,
      averageConfidence,
      mostCommonGrade,
      gradeDistribution,
      qualityTrends,
      confidenceByGrade,
      trendsChange,
      confidenceChange
    };

    console.log(`Analytics data processed for user ${userId}:`, analyticsData);
    return { data: analyticsData, error: null };
    
  } catch (err) {
    console.error('Analytics API Error:', err);
    return { data: null, error: err };
  }
}

export type { AnalyticsData };
