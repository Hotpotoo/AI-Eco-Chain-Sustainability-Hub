import React, { useState } from 'react';

interface RouteInputFormProps {
  onAnalyze: (start: string, end: string, weight: number, numParcels: number) => void;
  isLoading: boolean;
}

const RouteInputForm: React.FC<RouteInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [start, setStart] = useState('Old Klang Road, Kuala Lumpur');
  const [end, setEnd] = useState('Sunway University, Selangor');
  const [weight, setWeight] = useState(5);
  const [numParcels, setNumParcels] = useState(10);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(start, end, weight, numParcels);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="start-location" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              id="start-location"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green"
              placeholder="e.g., Old Klang Road, Kuala Lumpur"
            />
          </div>
          <div>
            <label htmlFor="end-location" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              id="end-location"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green"
              placeholder="e.g., Sunway University, Selangor"
            />
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="parcels" className="block text-sm font-medium text-gray-700 mb-1">
                # of Parcels
              </label>
              <input
                type="number"
                id="parcels"
                value={numParcels}
                onChange={(e) => setNumParcels(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green"
                placeholder="e.g., 10"
                min="1"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight/Parcel (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green"
                placeholder="e.g., 5"
                min="0"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Run Sustainability Analysis'}
        </button>
      </form>
    </div>
  );
};

export default RouteInputForm;