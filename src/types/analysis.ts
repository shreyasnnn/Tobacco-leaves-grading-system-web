// types/analytics.ts
export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

export interface QualityTrend {
  date: string;
  averageConfidence: number;
  totalUploads: number;
}

export interface MonthlyStats {
  month: string;
  ChengShu: number;
  JiaShu: number;
  QianShu: number;
  ShangShu: number;
}

export interface AnalyticsData {
  totalUploads: number;
  averageConfidence: number;
  mostCommonGrade: string;
  gradeDistribution: GradeDistribution[];
  qualityTrends: QualityTrend[];
  monthlyStats: MonthlyStats[];
  recentActivity: {
    thisWeek: number;
    thisMonth: number;
    percentageChange: number;
  };
}
