import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function StallsPieChart({ available, reserved }) {
  const data = [
    { name: "Available", value: available },
    { name: "Reserved", value: reserved }
  ];

  const COLORS = ["#4CAF50", "#FF6B6B"];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text
          x={x}
          y={y - 10}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          style={{ 
            fontSize: '26px', 
            fontWeight: '700',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            letterSpacing: '-0.5px'
          }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <text
          x={x}
          y={y + 14}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          style={{ 
            fontSize: '15px', 
            fontWeight: '500',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            opacity: 0.95
          }}
        >
          {`(${value} stalls)`}
        </text>
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', justifyContent: 'flex-start' }}>
      <div style={{ flex: '0 0 auto', width: '450px' }}>
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={180}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            backgroundColor: '#4CAF50', 
            borderRadius: '4px',
            border: '2px solid #2e7d32'
          }}></div>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#2d3748',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
          }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            backgroundColor: '#FF6B6B', 
            borderRadius: '4px',
            border: '2px solid #c62828'
          }}></div>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#2d3748',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
          }}>Reserved</span>
        </div>
      </div>
    </div>
  );
}
