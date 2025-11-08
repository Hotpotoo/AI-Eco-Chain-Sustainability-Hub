
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmissionsChartProps {
  data: {
    name: string;
    transportation: number;
    packaging: number;
    energy: number;
    total: number;
  }[];
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'CO₂ (grams)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: number, name, props) => [`${value.toFixed(0)}g (${(value / props.payload.total * 100).toFixed(0)}%)`, name]}/>
          <Legend />
          <Bar dataKey="transportation" stackId="a" name="Transportation" fill="#3B82F6" />
          <Bar dataKey="packaging" stackId="a" name="Packaging" fill="#F59E0B" />
          <Bar dataKey="energy" stackId="a" name="Energy" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionsChart;
