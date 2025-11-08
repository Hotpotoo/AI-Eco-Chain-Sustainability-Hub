import React, { useState, useCallback } from 'react';
import { analyzeRoute } from './services/geminiService';
import type { AnalysisResultData } from './types';
import RouteInputForm from './components/RouteInputForm';
import AnalysisResult from './components/AnalysisResult';
import { EcoLorryIcon } from './components/icons';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisRequest = useCallback(async (start: string, end: string, weight: number, numParcels: number) => {
    if (!start || !end || !weight || !numParcels) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeRoute(start, end, weight, numParcels);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to get sustainability analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <EcoLorryIcon className="h-8 w-8 text-brand-green" />
            <h1 className="text-2xl font-bold text-brand-dark">
              Eco Chain Sustainability Hub
            </h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-brand-gray mb-6">
            Get a complete sustainability analysis. Optimize routes, reduce your carbon footprint across the supply chain, and receive actionable eco-friendly recommendations.
          </p>
          <RouteInputForm onAnalyze={handleAnalysisRequest} isLoading={isLoading} />
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <AnalysisResult analysis={analysis} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default App;