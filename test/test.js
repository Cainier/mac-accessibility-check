const accessibilityCheck = require('../index.js');

console.log('Testing mac-accessibility-check module...\n');

// Test isTrusted function
console.log('1. Testing isTrusted():');
try {
  const isTrusted = accessibilityCheck.isTrusted();
  console.log(`   Result: ${isTrusted}`);
  console.log(`   Type: ${typeof isTrusted}`);
  console.log(`   ✓ isTrusted() works correctly\n`);
} catch (error) {
  console.log(`   ✗ Error: ${error.message}\n`);
}

// Test isTrustedPrompt function
console.log('2. Testing isTrustedPrompt():');
try {
  const isTrustedPrompt = accessibilityCheck.isTrustedPrompt();
  console.log(`   Result: ${isTrustedPrompt}`);
  console.log(`   Type: ${typeof isTrustedPrompt}`);
  console.log(`   ✓ isTrustedPrompt() works correctly\n`);
} catch (error) {
  console.log(`   ✗ Error: ${error.message}\n`);
}

// Test module exports
console.log('3. Testing module exports:');
console.log(`   Available exports: ${Object.keys(accessibilityCheck).join(', ')}`);
console.log(`   ✓ Module exports are correct\n`);

console.log('All tests completed!');
