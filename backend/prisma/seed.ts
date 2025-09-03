import { PrismaClient } from '@prisma/client';
import { ResearchProtocols } from '../src/data/research-protocols';
import { hashPassword } from '../src/auth/utils/password';

const prisma = new PrismaClient();

async function seedAdminUser() {
  console.log('👤 Creating admin user...');

  // Sprawdź czy admin już istnieje
  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'admin@edith.pl' },
        { role: 'SUPER_ADMIN' }
      ]
    }
  });

  if (existingAdmin) {
    console.log('⏭️ Admin user already exists');
    return existingAdmin;
  }

  // Stwórz hasło administratora
  const adminPassword = 'Admin123!@#';
  const hashedPassword = await hashPassword(adminPassword);

  // Utwórz administratora
  const admin = await prisma.user.create({
    data: {
      email: 'admin@edith.pl',
      username: 'admin',
      passwordHash: hashedPassword,
      firstName: 'Administrator',
      lastName: 'Systemu',
      title: 'Administrator',
      affiliation: 'EDITH Research Platform',
      department: 'IT',
      position: 'System Administrator',
      role: 'SUPER_ADMIN',
      isActive: true,
      isVerified: true,
      language: 'pl',
      timezone: 'Europe/Warsaw'
    }
  });

  console.log('✅ Admin user created successfully');
  console.log('📧 Email: admin@edith.pl');
  console.log('🔑 Password: Admin123!@#');
  console.log('⚠️ REMEMBER TO CHANGE THE PASSWORD AFTER FIRST LOGIN!');

  return admin;
}

async function seedResearcher() {
  console.log('🔬 Creating researcher user...');

  // Sprawdź czy researcher już istnieje
  const existingResearcher = await prisma.user.findFirst({
    where: { email: 'researcher@edith.pl' }
  });

  if (existingResearcher) {
    console.log('⏭️ Researcher user already exists');
    return existingResearcher;
  }

  // Stwórz hasło badacza
  const researcherPassword = 'Research123!';
  const hashedPassword = await hashPassword(researcherPassword);

  // Utwórz badacza
  const researcher = await prisma.user.create({
    data: {
      email: 'researcher@edith.pl',
      username: 'researcher',
      passwordHash: hashedPassword,
      firstName: 'Jan',
      lastName: 'Kowalski',
      title: 'Dr',
      affiliation: 'Uniwersytet Badawczy',
      department: 'Wydział Nauk Technicznych',
      position: 'Adiunkt',
      role: 'RESEARCHER',
      isActive: true,
      isVerified: true,
      language: 'pl',
      timezone: 'Europe/Warsaw'
    }
  });

  console.log('✅ Researcher user created successfully');
  console.log('📧 Email: researcher@edith.pl');
  console.log('� Password: Research123!');

  return researcher;
}

async function seedOperator() {
  console.log('⚙️ Creating operator user...');

  // Sprawdź czy operator już istnieje
  const existingOperator = await prisma.user.findFirst({
    where: { email: 'operator@edith.pl' }
  });

  if (existingOperator) {
    console.log('⏭️ Operator user already exists');
    return existingOperator;
  }

  // Stwórz hasło operatora
  const operatorPassword = 'Operator123!';
  const hashedPassword = await hashPassword(operatorPassword);

  // Utwórz operatora
  const operator = await prisma.user.create({
    data: {
      email: 'operator@edith.pl',
      username: 'operator',
      passwordHash: hashedPassword,
      firstName: 'Anna',
      lastName: 'Nowak',
      affiliation: 'Laboratorium Badawcze',
      department: 'Dział Techniczny',
      position: 'Operator',
      role: 'OPERATOR',
      isActive: true,
      isVerified: true,
      language: 'pl',
      timezone: 'Europe/Warsaw'
    }
  });

  console.log('✅ Operator user created successfully');
  console.log('📧 Email: operator@edith.pl');
  console.log('🔑 Password: Operator123!');

  return operator;
}

async function seedProtocols() {
  console.log('📋 Seeding predefined protocols...');

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

  console.log('✅ Protocol seeding completed!');
}

async function main() {
  console.log('� Starting database seeding...');
  
  try {
    // 1. Seed users first
    await seedAdminUser();
    await seedResearcher();
    await seedOperator();
    
    // 2. Then seed protocols
    await seedProtocols();
    
    console.log('�🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    // Exit with error code
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
