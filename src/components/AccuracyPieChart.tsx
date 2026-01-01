import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './AccuracyPieChart.css';

interface AccuracyPieChartProps {
  totalCorrect: number;
  totalQuestions: number;
  theme: 'light' | 'dark';
}

const AccuracyPieChart: React.FC<AccuracyPieChartProps> = ({ totalCorrect, totalQuestions, theme }) => {
  const totalIncorrect = totalQuestions - totalCorrect;

  const pieData = [
    { name: 'Correct', value: totalCorrect, color: '#10b981' },
    { name: 'Incorrect', value: totalIncorrect, color: '#ef4444' }
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#333' : '#fff', 
              borderColor: theme === 'dark' ? '#555' : '#ccc', 
              color: theme === 'dark' ? '#e5e5e5' : '#333' 
            }} 
            itemStyle={{ color: theme === 'dark' ? '#e5e5e5' : '#333' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="accuracy-pie-chart-container">
        <p className="accuracy-pie-chart-text">
          Total Questions Answered: {totalQuestions}
        </p>
      </div>
    </>
  );
};

export default AccuracyPieChart;
