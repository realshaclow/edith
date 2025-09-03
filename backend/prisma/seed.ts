import { PrismaClient } from '@prisma/client';
import { ResearchProtocols } from '../src/data/research-protocols';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Pobierz wszystkie protokoły
  const protocols = Object.values(ResearchProtocols);
  console.log(`📋 Found ${protocols.length} predefined protocols to seed`);

  // Seeding każdego protokołu
  for (const protocolData of protocols) {
    try {
      console.log(`📝 Processing protocol: ${protocolData.title}`);

      // Sprawdź czy protokół już istnieje
      const existingProtocol = await prisma.protocol.findFirst({
        where: {
          title: protocolData.title
        }
      });

      if (existingProtocol) {
        console.log(`⏭️ Protocol already exists: ${protocolData.title}`);
        continue;
      }

      // Utwórz protokół z wszystkimi powiązanymi danymi
      const protocol = await prisma.protocol.create({
        data: {
          id: protocolData.id,
          title: protocolData.title,
          description: protocolData.description,
          category: protocolData.category,
          type: 'PREDEFINED',
          version: protocolData.version,
          difficulty: protocolData.difficulty,
          estimatedDuration: protocolData.estimatedDuration,
          overview: protocolData.overview,
          equipment: protocolData.equipment,
          materials: protocolData.materials,
          safetyGuidelines: protocolData.safetyGuidelines,
          references: protocolData.references,
          isPublic: true,
          isActive: true,
          steps: {
            create: protocolData.steps?.map((step: any, index: number) => ({
              stepNumber: step.stepNumber || index + 1,
              title: step.title,
              description: step.description || '',
              duration: step.duration || '',
              instructions: step.instructions || [],
              tips: step.tips || [],
              safety: step.safety || [],
              dataPoints: {
                create: step.dataPoints?.map((dp: any, dpIndex: number) => ({
                  name: dp.name,
                  description: dp.description || '',
                  parameterType: (dp.parameterType || 'MEASUREMENT').toUpperCase(),
                  dataType: (dp.dataType || 'NUMBER').toUpperCase(),
                  unit: dp.unit || '',
                  isRequired: dp.isRequired || false,
                  isCalculated: dp.isCalculated || false,
                  orderIndex: dpIndex
                })) || []
              }
            })) || []
          },
          testConditions: {
            create: protocolData.testConditions && typeof protocolData.testConditions === 'object' && Array.isArray(protocolData.testConditions) 
              ? protocolData.testConditions.map((tc: any, index: number) => ({
                  name: tc.name,
                  value: tc.value,
                  unit: tc.unit || '',
                  tolerance: tc.tolerance || '',
                  category: (tc.category || 'ENVIRONMENTAL').toUpperCase(),
                  required: tc.required || false,
                  description: tc.description || ''
                }))
              : Object.entries(protocolData.testConditions || {}).map(([key, value], index) => ({
                  name: key,
                  value: String(value),
                  unit: '',
                  tolerance: '',
                  category: 'ENVIRONMENTAL',
                  required: false,
                  description: ''
                }))
          },
          calculations: {
            create: protocolData.calculations && typeof protocolData.calculations === 'object' && Array.isArray(protocolData.calculations)
              ? protocolData.calculations.map((calc: any, index: number) => ({
                  name: calc.name || `Calculation_${index + 1}`,
                  description: calc.description || '',
                  formula: calc.formula,
                  variables: calc.variables || {},
                  unit: calc.unit || calc.resultUnit || '',
                  category: (calc.category || 'MECHANICAL').toUpperCase()
                }))
              : Object.entries(protocolData.calculations || {}).map(([key, value], index) => ({
                  name: key || `Calculation_${index + 1}`,
                  description: '',
                  formula: String(value),
                  variables: {},
                  unit: '',
                  category: 'MECHANICAL'
                }))
          },
          typicalValues: {
            create: protocolData.typicalValues && Array.isArray(protocolData.typicalValues)
              ? protocolData.typicalValues.map((tv: any, index: number) => ({
                  parameter: tv.parameter || tv.parameterName || 'Unknown Parameter',
                  material: tv.material || tv.materialType || 'General',
                  value: tv.value || '',
                  unit: tv.unit || '',
                  minRange: tv.range?.min || tv.minRange || '',
                  maxRange: tv.range?.max || tv.maxRange || '',
                  conditions: tv.conditions || '',
                  category: (tv.category || 'MECHANICAL').toUpperCase(),
                  source: tv.source || '',
                  isReference: tv.isReference || false,
                  notes: tv.notes || ''
                }))
              : []
          },
          commonIssues: {
            create: protocolData.commonIssues?.map((ci: any, index: number) => ({
              issue: ci.problem || ci.issue || '',
              cause: ci.cause || '',
              solution: ci.solution || '',
              severity: (ci.severity || 'MEDIUM').toUpperCase(),
              frequency: ci.frequency || ''
            })) || []
          }
        }
      });

      console.log(`✅ Successfully created protocol: ${protocolData.title}`);

    } catch (error) {
      console.error(`❌ Error creating protocol ${protocolData.title}:`, error);
    }
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
