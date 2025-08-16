// types/analytics.ts
import {grade} from '../dataController/index'

export type Grade = typeof grade[number]; 
export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

export interface QualityTrend {
  date: string;
  value: number;
}

export interface ConfidenceByGrade {
  grade: string;
  confidence: number;
}

export interface AnalyticsData {
  totalPredictions: number;
  averageConfidence: number;
  mostCommonGrade: string;
  gradeDistribution: GradeDistribution[];
  qualityTrends: QualityTrend[];
  confidenceByGrade: ConfidenceByGrade[];
  trendsChange: number;
  confidenceChange: number;
}
