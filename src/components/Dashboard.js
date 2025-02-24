import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const API_URL = 'https://api.airgradient.com/public/v1/sensors/d83bda205dcc/measurements';

const AQI_COLORS = {
  good: '#00E400',
  moderate: '#FFFF00',
  unhealthySensitive: '#FF7E00',
  unhealthy: '#FF0000',
  veryUnhealthy: '#8F3F97',
  hazardous: '#7E0023'
};

const fetchData = async (period) => {
  const response = await fetch(`${API_URL}?period=${period}`);
  const data = await response.json();
  return data.measurements.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    pm25: item.pm25,
    temp: item.temperature,
    humidity: item.humidity
  }));
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('24h');

  useEffect(() => {
    fetchData(period).then(setData);
  }, [period]);

  const getLineColor = (value) => {
    if (value <= 50) return AQI_COLORS.good;
    if (value <= 100) return AQI_COLORS.moderate;
    if (value <= 150) return AQI_COLORS.unhealthySensitive;
    if (value <= 200) return AQI_COLORS.unhealthy;
    if (value <= 300) return AQI_COLORS.veryUnhealthy;
    return AQI_COLORS.hazardous;
  };

  return (
    <div className="p-4 grid gap-4">
      <div className="flex gap-2 justify-center mb-4">
        {['24h', '7d', '1m', '3m'].map((p) => (
          <Button key={p} onClick={() => setPeriod(p)} variant={period === p ? 'default' : 'outline'}>
            {p.toUpperCase()}
          </Button>
        ))}
      </div>
      <Card className="w-full">
        <CardContent>
          <h2 className="text-xl font-bold text-center">PM2.5 Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pm25" stroke={getLineColor(data[data.length - 1]?.pm25 || 0)} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

