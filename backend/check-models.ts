import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Available models:');
console.log(Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_')));

console.log('\nOAuth related models:');
console.log(Object.keys(prisma).filter(key => key.toLowerCase().includes('oauth')));
