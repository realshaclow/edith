import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  Schedule as TimeIcon,
  Science as StudyIcon,
  Analytics as ResultsIcon
} from '@mui/icons-material';
import { StudyExecution } from '../../types/professional';
import { StudySummaryHeader } from './StudySummaryHeader';
import { ExecutionStatistics } from './ExecutionStatistics';
import { SampleResultsTable } from './SampleResultsTable';
import { TestConditionsSummary } from './TestConditionsSummary';
import { RecommendationsPanel } from './RecommendationsPanel';
import ExportActions from './ExportActionsNew';

interface StudySummaryProps {
  execution: StudyExecution;
  onExportReport: () => void;
  onSaveResults: () => void;
  onBackToStudies: () => void;
}

export const StudySummary: React.FC<StudySummaryProps> = ({
  execution,
  onExportReport,
  onSaveResults,
  onBackToStudies
}) => {
  const isStudyComplete = execution.status === 'COMPLETED';
  const completedSteps = execution.steps.filter(step => step.isCompleted).length;
  const totalSteps = execution.steps.length;
  const completionRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header with study completion status */}
      <StudySummaryHeader 
        execution={execution}
        isComplete={isStudyComplete}
        completionRate={completionRate}
      />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Left Column - Statistics and Conditions */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Execution Statistics */}
            <ExecutionStatistics execution={execution} />
            
            {/* Test Conditions Summary */}
            <TestConditionsSummary execution={execution} />
          </Box>
        </Grid>

        {/* Right Column - Results and Actions */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Steps Results Table */}
            <SampleResultsTable execution={execution} />
            
            {/* Recommendations Panel */}
            {isStudyComplete && (
              <RecommendationsPanel execution={execution} />
            )}
            
            {/* Export and Save Actions */}
            <ExportActions 
              execution={execution}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Study Completion Alert */}
      {isStudyComplete && (
        <Alert 
          severity="success" 
          icon={<CompleteIcon />}
          sx={{ mt: 3 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Badanie zostało ukończone pomyślnie!
          </Typography>
          <Typography variant="body2">
            Wszystkie kroki zostały wykonane zgodnie z protokołem {execution.protocolName}.
            Wyniki są gotowe do analizy i eksportu.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
