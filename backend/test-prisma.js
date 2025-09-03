const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('Testing Prisma connection...');
    
    // Test czy connection działa
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Sprawdź dostępne modele
    console.log('Available models:', Object.keys(prisma));
    
    // Próbuj pobrać protokoły
    console.log('Fetching protocols...');
    const protocolCount = await prisma.protocol.count();
    console.log(`Found ${protocolCount} protocols in database`);
    
    // Sprawdź kilka pierwszych protokołów
    if (protocolCount > 0) {
      const protocols = await prisma.protocol.findMany({
        take: 2,
        select: {
          id: true,
          title: true,
          type: true
        }
      });
      console.log('Sample protocols:', protocols);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
