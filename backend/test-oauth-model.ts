import { PrismaClient } from '@prisma/client';

async function testOAuth() {
  const prisma = new PrismaClient();
  
  console.log('Testing OAuth model access...');
  
  try {
    // Test oAuthAccount (camelCase)
    const result1 = await prisma.oAuthAccount.findMany({ take: 1 });
    console.log('✅ oAuthAccount works (camelCase)', result1.length);
  } catch (e: any) {
    console.log('❌ oAuthAccount failed (camelCase):', e.message);
  }
  
  try {
    // Test OAuthAccount (PascalCase)
    const result2 = await (prisma as any).OAuthAccount.findMany({ take: 1 });
    console.log('✅ OAuthAccount works (PascalCase)', result2.length);
  } catch (e: any) {
    console.log('❌ OAuthAccount failed (PascalCase):', e.message);
  }
  
  await prisma.$disconnect();
}

testOAuth().catch(console.error);
