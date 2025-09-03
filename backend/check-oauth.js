/**
 * OAuth Configuration Checker
 * Sprawdza czy wszystkie wymagane zmienne środowiskowe dla OAuth są ustawione
 */

// Ładuj zmienne środowiskowe z .env
require('dotenv').config();

const requiredOAuthVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET', 
  'GOOGLE_CALLBACK_URL',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GITHUB_CALLBACK_URL',
  'MICROSOFT_CLIENT_ID',
  'MICROSOFT_CLIENT_SECRET',
  'MICROSOFT_CALLBACK_URL'
];

const missingVars = requiredOAuthVars.filter(varName => {
  const value = process.env[varName];
  return !value || value.startsWith('your-') || value === '';
});

console.log('🔍 OAuth Configuration Check');
console.log('============================');

if (missingVars.length === 0) {
  console.log('✅ Wszystkie zmienne OAuth są skonfigurowane!');
  console.log('🚀 Możesz testować OAuth!');
} else {
  console.log('❌ Brakujące lub niepoprawne zmienne OAuth:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}: ${process.env[varName] || 'NIE USTAWIONE'}`);
  });
  console.log('\n📝 Zobacz setup-oauth.md dla instrukcji konfiguracji');
}

console.log('\n🔗 Callback URLs:');
console.log(`   Google:    ${process.env.GOOGLE_CALLBACK_URL}`);
console.log(`   GitHub:    ${process.env.GITHUB_CALLBACK_URL}`);
console.log(`   Microsoft: ${process.env.MICROSOFT_CALLBACK_URL}`);
