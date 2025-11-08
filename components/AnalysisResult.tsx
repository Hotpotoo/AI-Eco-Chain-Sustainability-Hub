import React from 'react';
import type { AnalysisResultData } from '../types';
import StatCard from './StatCard';
import EmissionsChart from './CarbonChart';
import LoadingSpinner from './LoadingSpinner';
import { ClockIcon, RouteIcon, Co2Icon, DirectionsIcon, LightbulbIcon, PackageIcon, BoltIcon } from './icons';

interface AnalysisResultProps {
  analysis: AnalysisResultData | null;
  isLoading: boolean;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md">
        <LoadingSpinner />
        <p className="mt-4 text-brand-gray font-medium">Analyzing route, calculating emissions, and generating recommendations...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
        <div className="mt-8 text-center p-8 bg-white rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-brand-gray">Your comprehensive sustainability analysis will appear here.</h3>
        </div>
    );
  }

  const { optimizedRoute, standardRoute, savings, emissionsBreakdown, recommendations } = analysis;

  // Fix: Explicitly sum properties to avoid TypeScript errors with Object.values and improve readability.
  const totalStandardEmissions = emissionsBreakdown.standard.transportation + emissionsBreakdown.standard.packaging + emissionsBreakdown.standard.energy;
  const totalOptimizedEmissions = emissionsBreakdown.optimized.transportation + emissionsBreakdown.optimized.packaging + emissionsBreakdown.optimized.energy;


  return (
    <div className="mt-8 space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<ClockIcon className="h-8 w-8 text-blue-500" />} 
          title="Travel Time" 
          value={`${optimizedRoute.timeMinutes.toFixed(0)} min`} 
          description={`vs. ${standardRoute.timeMinutes.toFixed(0)} min standard`}
        />
        <StatCard 
          icon={<RouteIcon className="h-8 w-8 text-purple-500" />} 
          title="Optimal Distance" 
          value={`${optimizedRoute.distanceKm.toFixed(1)} km`} 
          description={`vs. ${standardRoute.distanceKm.toFixed(1)}km standard route.`}
        />
        <StatCard 
          icon={<Co2Icon className="h-8 w-8 text-brand-green" />} 
          title="Total CO₂ Saved" 
          value={`${savings.carbonEmissionsGrams.toFixed(0)}g`} 
          description="Across transport, packaging & energy."
        />
        <StatCard 
          icon={<ClockIcon className="h-8 w-8 text-teal-500" />} 
          title="Time Saved" 
          value={`${savings.timeMinutes.toFixed(0)} min`} 
          description="Faster, more efficient delivery."
        />
      </div>

       {/* Recommendations & Breakdown */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommendations */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                <LightbulbIcon className="h-6 w-6 text-yellow-500 mr-3"/>
                <h3 className="text-xl font-bold">Actionable Recommendations</h3>
            </div>
            <div className="space-y-4">
                {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-brand-dark">{rec.title}</h4>
                        <p className="text-sm text-brand-gray mt-1 mb-2">{rec.description}</p>
                        <div className="flex space-x-4 text-xs">
                            <span className="font-semibold text-green-600">CO₂ Reduction: {rec.co2ReductionPercent}%</span>
                            <span className="font-semibold text-blue-600">Cost Reduction: {rec.costReductionPercent}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Carbon Breakdown Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-center mb-1">Carbon Footprint Breakdown</h3>
             <p className="text-center text-sm text-brand-gray mb-4">Comparing Standard vs. Optimized Scenarios</p>
            <EmissionsChart data={[
                { name: 'Standard', ...emissionsBreakdown.standard, total: totalStandardEmissions },
                { name: 'Optimized', ...emissionsBreakdown.optimized, total: totalOptimizedEmissions }
            ]} />
        </div>
      </div>


      {/* Main Content: Map & Directions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-md">
          <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-lg">
            <img 
              src="https://picsum.photos/seed/routemap/600/600" 
              alt="Map placeholder"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <p className="text-white text-2xl font-bold">Route Visualization</p>
            </div>
          </div>
        </div>

        {/* Directions */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <DirectionsIcon className="h-6 w-6 text-brand-green mr-3"/>
            <h3 className="text-xl font-bold">Optimized Route Directions</h3>
          </div>
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {optimizedRoute.directions?.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-brand-green text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-1">{index + 1}</span>
                <p className="text-brand-gray">{step}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;