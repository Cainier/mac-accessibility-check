const accessibilityCheck = require('../index.js');

console.log('=== MAS Environment Test ===\n');

// Test MAS environment detection
console.log('1. Testing MAS Environment Detection:');
const isMAS = accessibilityCheck.isMASEnvironment();
console.log(`   Is MAS Environment: ${isMAS}`);
console.log(`   Expected: false (running in development)\n`);

// Test permission status
console.log('2. Testing Permission Status:');
const status = accessibilityCheck.getPermissionStatus();
console.log('   Status:', JSON.stringify(status, null, 2));
console.log(`   Expected: { isTrusted: true, isMAS: false, canPrompt: true }\n`);

// Test individual functions
console.log('3. Testing Individual Functions:');
console.log(`   isTrusted(): ${accessibilityCheck.isTrusted()}`);
console.log(`   isTrustedPrompt(): ${accessibilityCheck.isTrustedPrompt()}`);
console.log(`   isMASEnvironment(): ${accessibilityCheck.isMASEnvironment()}\n`);

// Test behavior differences
console.log('4. Testing Behavior Differences:');
if (isMAS) {
  console.log('   Running in MAS environment:');
  console.log('   - isTrustedPrompt() will only check current status');
  console.log('   - No system permission dialog will be shown');
  console.log('   - User must manually enable permissions in System Preferences');
} else {
  console.log('   Running in regular environment:');
  console.log('   - isTrustedPrompt() can show system permission dialog');
  console.log('   - Standard permission flow works');
}

console.log('\n=== Test Completed ===');

// Simulate what would happen in MAS environment
console.log('\n=== MAS Environment Simulation ===');
console.log('If this were running in MAS environment:');
console.log('- isTrustedPrompt() would return current status only');
console.log('- No permission dialog would appear');
console.log('- User would need to manually enable permissions');
console.log('- getPermissionStatus().canPrompt would be false');
console.log('- getPermissionStatus().message would contain guidance text');
