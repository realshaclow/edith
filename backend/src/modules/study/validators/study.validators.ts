import { z } from 'zod';

// Study Settings Validators
const StudySampleSettingsSchema = z.object({
  minSamples: z.number().min(1, 'Minimum samples must be at least 1'),
  maxSamples: z.number().min(1, 'Maximum samples must be at least 1'),
  defaultSamples: z.number().min(1, 'Default samples must be at least 1'),
  sampleNaming: z.enum(['automatic', 'manual']),
  samplePrefix: z.string().optional()
});

const StudySessionSettingsSchema = z.object({
  maxSessions: z.number().min(1, 'Maximum sessions must be at least 1'),
  allowUnlimitedSessions: z.boolean(),
  sessionTimeoutMinutes: z.number().min(1).optional(),
  autoSaveInterval: z.number().min(1, 'Auto save interval must be at least 1 minute'),
  requireSessionNotes: z.boolean(),
  allowParallelSessions: z.boolean()
});

const StudyScheduleSettingsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  estimatedDurationHours: z.number().min(0).optional(),
  reminderSettings: z.object({
    enabled: z.boolean(),
    daysBefore: z.array(z.number().min(0)),
    emailNotifications: z.boolean()
  })
});

const StudyQualitySettingsSchema = z.object({
  enableQualityControl: z.boolean(),
  outlierDetectionMethod: z.enum(['iqr', 'zscore', 'none']),
  controlLimits: z.enum(['2sigma', '3sigma']),
  minimumReplicates: z.number().min(1),
  requireCalibration: z.boolean()
});

const StudyRepetitionSettingsSchema = z.object({
  allowRepetitions: z.boolean(),
  maxRepetitions: z.number().min(1),
  repetitionNaming: z.enum(['automatic', 'manual'])
});

const StudyValidationSettingsSchema = z.object({
  requireAllSteps: z.boolean(),
  allowSkippingOptional: z.boolean(),
  requireApproval: z.boolean(),
  reviewerEmails: z.array(z.string().email()).optional()
});

const StudyExportSettingsSchema = z.object({
  autoExport: z.boolean(),
  exportFormat: z.enum(['xlsx', 'csv', 'json']),
  includeCalculations: z.boolean(),
  includeCharts: z.boolean(),
  exportAfterEachSession: z.boolean()
});

const StudySecuritySettingsSchema = z.object({
  restrictedAccess: z.boolean(),
  allowedUsers: z.array(z.string()).optional(),
  requireAuthentication: z.boolean(),
  dataEncryption: z.boolean()
});

const StudySettingsSchema = z.object({
  sampleSettings: StudySampleSettingsSchema,
  sessionSettings: StudySessionSettingsSchema,
  scheduleSettings: StudyScheduleSettingsSchema,
  qualitySettings: StudyQualitySettingsSchema,
  repetitionSettings: StudyRepetitionSettingsSchema,
  validationSettings: StudyValidationSettingsSchema,
  exportSettings: StudyExportSettingsSchema,
  securitySettings: StudySecuritySettingsSchema
});

// Data Collection Validators
const DataPointValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  required: z.boolean().optional()
});

const DataPointSchema = z.object({
  id: z.string().min(1, 'Data point ID is required'),
  name: z.string().min(1, 'Data point name is required'),
  description: z.string().min(1, 'Data point description is required'),
  parameterType: z.enum(['measurement', 'observation', 'calculation', 'condition']),
  dataType: z.enum(['number', 'text', 'boolean', 'date']),
  unit: z.string().optional(),
  isRequired: z.boolean(),
  isCalculated: z.boolean(),
  calculationFormula: z.string().optional(),
  validation: DataPointValidationSchema.optional()
});

const DataCollectionStepSchema = z.object({
  id: z.string().min(1, 'Step ID is required'),
  stepNumber: z.number().min(1).optional(),
  name: z.string().min(1, 'Step name is required'),
  stepName: z.string().optional(),
  description: z.string().min(1, 'Step description is required'),
  estimatedDuration: z.string().min(1, 'Estimated duration is required'),
  isRequired: z.boolean(),
  dataPoints: z.array(DataPointSchema).min(1, 'At least one data point is required'),
  instructions: z.array(z.string()).optional(),
  safety: z.array(z.string()).optional()
});

const StudyParameterSchema = z.object({
  id: z.string().min(1, 'Parameter ID is required'),
  name: z.string().min(1, 'Parameter name is required'),
  value: z.string().min(1, 'Parameter value is required'),
  unit: z.string().optional(),
  description: z.string().optional()
});

// Study Validators
export const CreateStudySchema = z.object({
  title: z.string().min(1, 'Study title is required').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  protocolId: z.string().min(1, 'Protocol ID is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  expectedEndDate: z.string().datetime().optional(),
  settings: StudySettingsSchema,
  dataCollectionSteps: z.array(DataCollectionStepSchema).min(1, 'At least one data collection step is required'),
  studyParameters: z.array(StudyParameterSchema).optional(),
  notes: z.string().max(2000, 'Notes are too long').optional(),
  isTemplate: z.boolean().optional(),
  templateId: z.string().optional()
}).refine((data) => {
  // Validate that end date is after start date
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
}).refine((data) => {
  // Validate sample settings consistency
  return data.settings.sampleSettings.defaultSamples >= data.settings.sampleSettings.minSamples &&
         data.settings.sampleSettings.defaultSamples <= data.settings.sampleSettings.maxSamples;
}, {
  message: 'Default samples must be between min and max samples',
  path: ['settings', 'sampleSettings', 'defaultSamples']
});

export const UpdateStudySchema = z.object({
  title: z.string().min(1, 'Study title is required').max(200, 'Title is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  expectedEndDate: z.string().datetime().optional(),
  settings: StudySettingsSchema.partial().optional(),
  dataCollectionSteps: z.array(DataCollectionStepSchema).optional(),
  studyParameters: z.array(StudyParameterSchema).optional(),
  notes: z.string().max(2000, 'Notes are too long').optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'PAUSED', 'ARCHIVED', 'DELETED']).optional()
});

export const DuplicateStudySchema = z.object({
  title: z.string().min(1, 'Study title is required').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  includeSettings: z.boolean(),
  includeDataSteps: z.boolean(),
  includeParameters: z.boolean(),
  includeTeam: z.boolean(),
  resetStatus: z.boolean()
});

// Study Session Validators
export const CreateStudySessionSchema = z.object({
  sessionName: z.string().min(1, 'Session name is required').max(200, 'Session name is too long'),
  sampleId: z.string().optional(),
  sampleName: z.string().max(200, 'Sample name is too long').optional(),
  conditions: z.record(z.string(), z.string()).optional(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  operatorId: z.string().min(1, 'Operator ID is required')
});

export const UpdateStudySessionSchema = z.object({
  sessionName: z.string().min(1, 'Session name is required').max(200, 'Session name is too long').optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'PAUSED']).optional(),
  sampleId: z.string().optional(),
  sampleName: z.string().max(200, 'Sample name is too long').optional(),
  conditions: z.record(z.string(), z.string()).optional(),
  data: z.array(z.object({
    stepIndex: z.number().min(0),
    stepName: z.string().min(1),
    measurements: z.record(z.string(), z.any()),
    observations: z.record(z.string(), z.any()),
    calculations: z.record(z.string(), z.any()),
    timestamp: z.string().datetime(),
    operator: z.string().min(1),
    notes: z.string().optional()
  })).optional(),
  calculations: z.record(z.string(), z.any()).optional(),
  qualityCheck: z.record(z.string(), z.any()).optional(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  endTime: z.string().datetime().optional()
});

// Study Result Validators
export const CreateStudyResultSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  sampleId: z.string().optional(),
  parameters: z.record(z.string(), z.any()),
  measurements: z.record(z.string(), z.any()),
  calculatedValues: z.record(z.string(), z.any()).optional(),
  statisticalData: z.record(z.string(), z.any()).optional(),
  qualityData: z.record(z.string(), z.any()).optional()
});

export const UpdateStudyResultSchema = z.object({
  parameters: z.record(z.string(), z.any()).optional(),
  measurements: z.record(z.string(), z.any()).optional(),
  calculatedValues: z.record(z.string(), z.any()).optional(),
  statisticalData: z.record(z.string(), z.any()).optional(),
  qualityData: z.record(z.string(), z.any()).optional(),
  validationStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  validationNotes: z.string().max(1000, 'Validation notes are too long').optional()
});

// Team Management Validators
export const AddTeamMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['OWNER', 'MANAGER', 'ANALYST', 'OPERATOR', 'OBSERVER', 'MEMBER']),
  permissions: z.array(z.string()).optional()
});

export const UpdateTeamMemberSchema = z.object({
  role: z.enum(['OWNER', 'MANAGER', 'ANALYST', 'OPERATOR', 'OBSERVER', 'MEMBER']).optional(),
  permissions: z.array(z.string()).optional()
});

// Export Validators
export const ExportStudySchema = z.object({
  format: z.enum(['xlsx', 'csv', 'json', 'pdf']),
  includeSettings: z.boolean(),
  includeSessions: z.boolean(),
  includeResults: z.boolean(),
  includeAnalysis: z.boolean(),
  includeCharts: z.boolean(),
  dateRange: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime()
  }).optional()
});

// Template Validators
export const CreateStudyTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(200, 'Template name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  studyId: z.string().min(1, 'Study ID is required'),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

// Query Validators
export const StudyQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'PAUSED', 'ARCHIVED', 'DELETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  protocolId: z.string().optional(),
  tags: z.string().optional(), // comma-separated tags
  startDateFrom: z.string().datetime().optional(),
  startDateTo: z.string().datetime().optional(),
  createdBy: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'status', 'priority', 'startDate']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const SessionQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'PAUSED']).optional(),
  operatorId: z.string().optional(),
  sampleId: z.string().optional(),
  startDateFrom: z.string().datetime().optional(),
  startDateTo: z.string().datetime().optional(),
  sortBy: z.enum(['createdAt', 'startTime', 'endTime', 'sessionName']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});
