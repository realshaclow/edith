import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { PerformanceMetric } from '../../types';

interface PerformanceChartProps {
  data: PerformanceMetric[];
  isLoading: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, isLoading }) => {
  const [chartType, setChartType] = React.useState<'line' | 'area'>('area');
  const [timeRange, setTimeRange] = React.useState<'7d' | '30d' | '90d'>('30d');

  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: 'line' | 'area'
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleTimeRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRange: '7d' | '30d' | '90d'
  ) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getFilteredData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return data.slice(-days);
  };

  const filteredData = getFilteredData();

  // Calculate trends
  const avgStudies = filteredData.reduce((acc, curr) => acc + curr.studiesCompleted, 0) / filteredData.length;
  const avgSuccessRate = filteredData.reduce((acc, curr) => acc + curr.successRate, 0) / filteredData.length;
  const avgEfficiency = filteredData.reduce((acc, curr) => acc + curr.efficiency, 0) / filteredData.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {formatDate(label)}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toFixed(1)}
              {entry.dataKey === 'successRate' || entry.dataKey === 'efficiency' ? '%' : ''}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Wydajność systemu" />
        <CardContent>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Wydajność systemu"
        action={
          <Box display="flex" gap={1} alignItems="center">
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              size="small"
            >
              <ToggleButton value="7d">7D</ToggleButton>
              <ToggleButton value="30d">30D</ToggleButton>
              <ToggleButton value="90d">90D</ToggleButton>
            </ToggleButtonGroup>
            
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
            >
              <ToggleButton value="line">Linia</ToggleButton>
              <ToggleButton value="area">Obszar</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        }
      />
      <CardContent>
        {/* Summary Statistics */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <Chip
            label={`Średnio ${avgStudies.toFixed(1)} badań/dzień`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`${avgSuccessRate.toFixed(1)}% sukces`}
            color="success"
            variant="outlined"
          />
          <Chip
            label={`${avgEfficiency.toFixed(1)}% efektywność`}
            color="info"
            variant="outlined"
          />
        </Box>

        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="studiesCompleted"
                  name="Badania ukończone"
                  stackId="1"
                  stroke="#1976d2"
                  fill="#1976d2"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="successRate"
                  name="Wskaźnik sukcesu"
                  stackId="2"
                  stroke="#2e7d32"
                  fill="#2e7d32"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  name="Efektywność"
                  stackId="3"
                  stroke="#ed6c02"
                  fill="#ed6c02"
                  fillOpacity={0.6}
                />
              </AreaChart>
            ) : (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="studiesCompleted"
                  name="Badania ukończone"
                  stroke="#1976d2"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  name="Wskaźnik sukcesu"
                  stroke="#2e7d32"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  name="Efektywność"
                  stroke="#ed6c02"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>

        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            * Wykres pokazuje dzienne statystyki dla wybranego okresu. 
            Wskaźnik sukcesu i efektywność wyrażone w procentach.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
