import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const data = [
  { name: 'Page A', value: 30 },
  { name: 'Page B', value: 40 },
  { name: 'Page C', value: 45 },
  { name: 'Page D', value: 50 },
  { name: 'Page E', value: 49 },
  { name: 'Page F', value: 60 },
  { name: 'Page G', value: 70 },
  { name: 'Page H', value: 91 },
  { name: 'Page I', value: 125 }
];

const CombinedChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="rgba(0, 123, 255, 1)" animationDuration={1500} />
        <Line type="monotone" dataKey="value" stroke="rgba(255, 0, 0, 1)" strokeWidth={2} dot={{ r: 6 }} activeDot={{ r: 8 }} animationDuration={1500} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CombinedChartComponent;
