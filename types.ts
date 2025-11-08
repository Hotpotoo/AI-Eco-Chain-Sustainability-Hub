
export interface RouteDetails {
  distanceKm: number;
  timeMinutes: number;
  carbonEmissionsGrams: number;
  directions?: string[];
}

export interface EmissionsBreakdown {
  transportation: number; // in grams
  packaging: number; // in grams
  energy: number; // in grams
}

export interface Recommendation {
  title: string;
  description: string;
  co2ReductionPercent: number;
  costReductionPercent: number;
}

export interface AnalysisResultData {
  optimizedRoute: RouteDetails;
  standardRoute: RouteDetails;
  savings: {
    carbonEmissionsGrams: number;
    timeMinutes: number;
  };
  emissionsBreakdown: {
    standard: EmissionsBreakdown;
    optimized: EmissionsBreakdown;
  };
  recommendations: Recommendation[];
}
