-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'RESEARCHER', 'OPERATOR', 'USER', 'GUEST');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('GOOGLE', 'GITHUB', 'MICROSOFT');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('SYSTEM_ADMIN', 'USER_MANAGEMENT', 'PROTOCOL_CREATE', 'PROTOCOL_READ', 'PROTOCOL_UPDATE', 'PROTOCOL_DELETE', 'PROTOCOL_PUBLISH', 'STUDY_CREATE', 'STUDY_READ', 'STUDY_UPDATE', 'STUDY_DELETE', 'STUDY_EXECUTE', 'SESSION_CREATE', 'SESSION_READ', 'SESSION_UPDATE', 'SESSION_DELETE', 'SESSION_EXECUTE', 'DATA_READ', 'DATA_EXPORT', 'DATA_DELETE', 'REPORT_CREATE', 'REPORT_READ', 'REPORT_EXPORT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ProtocolType" AS ENUM ('PREDEFINED', 'USER');

-- CreateEnum
CREATE TYPE "DataPointType" AS ENUM ('MEASUREMENT', 'OBSERVATION', 'CALCULATION', 'CONDITION');

-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('NUMBER', 'TEXT', 'BOOLEAN', 'DATE', 'FILE', 'SELECTION');

-- CreateEnum
CREATE TYPE "ConditionCategory" AS ENUM ('ENVIRONMENTAL', 'MECHANICAL', 'CHEMICAL', 'TEMPORAL', 'DIMENSIONAL', 'ELECTRICAL', 'OPTICAL');

-- CreateEnum
CREATE TYPE "CalculationCategory" AS ENUM ('MECHANICAL', 'STATISTICAL', 'DIMENSIONAL', 'CHEMICAL', 'THERMAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ValueCategory" AS ENUM ('MECHANICAL', 'THERMAL', 'ELECTRICAL', 'CHEMICAL', 'DIMENSIONAL', 'OPTICAL', 'PHYSICAL');

-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "StudyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'PAUSED');

-- CreateEnum
CREATE TYPE "SampleStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "title" TEXT,
    "affiliation" TEXT,
    "department" TEXT,
    "position" TEXT,
    "phone" TEXT,
    "address" JSONB,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "language" TEXT NOT NULL DEFAULT 'pl',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Warsaw',
    "preferences" JSONB,
    "lastLoginAt" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "emailVerificationToken" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "passwordResetToken" TEXT,
    "passwordResetExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "providerId" TEXT NOT NULL,
    "email" TEXT,
    "profileData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "device" TEXT,
    "location" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "user_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_group_memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "user_group_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "PermissionType" NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "oldData" JSONB,
    "newData" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocols" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "type" "ProtocolType" NOT NULL DEFAULT 'USER',
    "version" TEXT DEFAULT '1.0',
    "difficulty" TEXT,
    "estimatedDuration" TEXT,
    "overview" JSONB,
    "equipment" JSONB,
    "materials" JSONB,
    "safetyGuidelines" JSONB,
    "references" JSONB,
    "notes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "protocols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_steps" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT,
    "instructions" JSONB,
    "tips" JSONB,
    "safety" JSONB,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "protocol_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_data_points" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parameterType" "DataPointType" NOT NULL DEFAULT 'MEASUREMENT',
    "dataType" "DataType" NOT NULL DEFAULT 'NUMBER',
    "unit" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "pattern" TEXT,
    "options" JSONB,
    "isCalculated" BOOLEAN NOT NULL DEFAULT false,
    "formula" TEXT,
    "variables" JSONB,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "protocol_data_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_test_conditions" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "tolerance" TEXT,
    "category" "ConditionCategory" NOT NULL DEFAULT 'ENVIRONMENTAL',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "protocol_test_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_calculations" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "formula" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "unit" TEXT,
    "category" "CalculationCategory" NOT NULL DEFAULT 'MECHANICAL',
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "example" TEXT,
    "notes" TEXT,

    CONSTRAINT "protocol_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_typical_values" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "minRange" TEXT,
    "maxRange" TEXT,
    "conditions" TEXT,
    "category" "ValueCategory" NOT NULL DEFAULT 'MECHANICAL',
    "source" TEXT,
    "isReference" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "protocol_typical_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_common_issues" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "severity" "IssueSeverity" NOT NULL DEFAULT 'MEDIUM',
    "frequency" TEXT,

    CONSTRAINT "protocol_common_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "protocolId" TEXT,
    "protocolName" TEXT NOT NULL,
    "category" TEXT,
    "settings" JSONB NOT NULL,
    "parameters" JSONB,
    "status" "StudyStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "isTemplate" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_data_collection_steps" (
    "id" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "protocolStepId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "description" TEXT,
    "estimatedDuration" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "executionNotes" TEXT,

    CONSTRAINT "study_data_collection_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_data_points" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parameterType" "DataPointType" NOT NULL DEFAULT 'MEASUREMENT',
    "dataType" "DataType" NOT NULL DEFAULT 'NUMBER',
    "unit" TEXT,
    "options" JSONB,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "pattern" TEXT,
    "isCalculated" BOOLEAN NOT NULL DEFAULT false,
    "calculationFormula" TEXT,

    CONSTRAINT "study_data_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_required_conditions" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "tolerance" TEXT,
    "category" "ConditionCategory" NOT NULL DEFAULT 'ENVIRONMENTAL',
    "required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "study_required_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_sessions" (
    "id" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "sessionName" TEXT NOT NULL,
    "description" TEXT,
    "operatorId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PLANNED',
    "currentStepId" TEXT,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL,
    "completedSamples" INTEGER NOT NULL DEFAULT 0,
    "totalSamples" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_samples" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sampleNumber" INTEGER NOT NULL,
    "sampleName" TEXT NOT NULL,
    "description" TEXT,
    "status" "SampleStatus" NOT NULL DEFAULT 'PENDING',
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "properties" JSONB,
    "notes" TEXT,

    CONSTRAINT "study_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_results" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sampleId" TEXT,
    "stepId" TEXT NOT NULL,
    "dataPointId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "measuredBy" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "validationNotes" TEXT,
    "isCalculated" BOOLEAN NOT NULL DEFAULT false,
    "uncertainty" DOUBLE PRECISION,

    CONSTRAINT "study_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_test_conditions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "tolerance" TEXT,
    "category" "ConditionCategory" NOT NULL DEFAULT 'ENVIRONMENTAL',
    "actualValue" TEXT,

    CONSTRAINT "session_test_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_attachments" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "stepId" TEXT,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "description" TEXT,
    "filePath" TEXT NOT NULL,
    "url" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,

    CONSTRAINT "study_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_schemas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "questions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL,
    "researchSchemaId" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_providerId_provider_key" ON "oauth_accounts"("providerId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_userId_provider_key" ON "oauth_accounts"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refreshToken_key" ON "user_sessions"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_groups_name_key" ON "user_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_group_memberships_userId_groupId_key" ON "user_group_memberships"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permission_resource_resourceId_key" ON "user_permissions"("userId", "permission", "resource", "resourceId");

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_memberships" ADD CONSTRAINT "user_group_memberships_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "user_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_memberships" ADD CONSTRAINT "user_group_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_steps" ADD CONSTRAINT "protocol_steps_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_data_points" ADD CONSTRAINT "protocol_data_points_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "protocol_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_test_conditions" ADD CONSTRAINT "protocol_test_conditions_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_calculations" ADD CONSTRAINT "protocol_calculations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_typical_values" ADD CONSTRAINT "protocol_typical_values_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_common_issues" ADD CONSTRAINT "protocol_common_issues_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studies" ADD CONSTRAINT "studies_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studies" ADD CONSTRAINT "studies_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_data_collection_steps" ADD CONSTRAINT "study_data_collection_steps_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_data_points" ADD CONSTRAINT "study_data_points_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "study_data_collection_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_required_conditions" ADD CONSTRAINT "study_required_conditions_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "study_data_collection_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_samples" ADD CONSTRAINT "study_samples_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "study_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_results" ADD CONSTRAINT "study_results_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "study_samples"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_results" ADD CONSTRAINT "study_results_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "study_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_test_conditions" ADD CONSTRAINT "session_test_conditions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "study_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_attachments" ADD CONSTRAINT "study_attachments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "study_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_researchSchemaId_fkey" FOREIGN KEY ("researchSchemaId") REFERENCES "research_schemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
