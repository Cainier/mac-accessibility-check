# mac-accessibility-check

A Node.js native addon for checking macOS accessibility permissions (AXIsProcessTrusted) from Node.js and Electron applications.

## Features

- Check if the current process has accessibility permissions
- Prompt for accessibility authorization with system dialog
- **MAS (Mac App Store) environment support** - Special handling for sandboxed apps
- Works with both Node.js and Electron applications
- Supports macOS 10.15+ (Catalina and later)
- Supports both Intel (x64) and Apple Silicon (arm64) architectures

## Installation

```bash
npm install mac-accessibility-check
```

## Usage

### Basic Usage

```javascript
const accessibilityCheck = require('mac-accessibility-check');

// Check if accessibility permissions are granted
const hasPermissions = accessibilityCheck.isTrusted();
console.log('Has accessibility permissions:', hasPermissions);

// Check permissions and prompt for authorization if needed
const hasPermissionsWithPrompt = accessibilityCheck.isTrustedPrompt();
console.log('Has accessibility permissions (with prompt):', hasPermissionsWithPrompt);
```

### MAS (Mac App Store) Environment

For apps distributed through the Mac App Store, the behavior is different due to sandbox restrictions:

```javascript
const accessibilityCheck = require('mac-accessibility-check');

// Check if running in MAS environment
const isMAS = accessibilityCheck.isMASEnvironment();
console.log('Is MAS environment:', isMAS);

// Get detailed permission status
const status = accessibilityCheck.getPermissionStatus();
console.log('Permission status:', status);
// Output: { isTrusted: false, isMAS: true, canPrompt: false, message: "..." }

if (status.isMAS && !status.isTrusted) {
  // In MAS environment, guide users to System Preferences
  console.log('Please enable accessibility permissions in System Preferences > Security & Privacy > Privacy > Accessibility');
}
```

### TypeScript Usage

```typescript
import accessibilityCheck, { isTrusted, isTrustedPrompt, isMASEnvironment, getPermissionStatus } from 'mac-accessibility-check';

// Using named imports
const hasPermissions = isTrusted();
const hasPermissionsWithPrompt = isTrustedPrompt();
const isMAS = isMASEnvironment();
const status = getPermissionStatus();

// Using default import
const hasPermissions2 = accessibilityCheck.isTrusted();
```

### Electron Usage

```javascript
const { app } = require('electron');
const accessibilityCheck = require('mac-accessibility-check');

app.whenReady().then(() => {
  // Check if running in MAS environment
  const isMAS = accessibilityCheck.isMASEnvironment();

  if (isMAS) {
    // Handle MAS environment differently
    const status = accessibilityCheck.getPermissionStatus();

    if (!status.isTrusted) {
      // Show custom dialog to guide users
      dialog.showMessageBox({
        type: 'info',
        title: 'Accessibility Permissions Required',
        message: 'This app needs accessibility permissions to function properly.',
        detail: 'Please go to System Preferences > Security & Privacy > Privacy > Accessibility and enable permissions for this app.',
        buttons: ['Open System Preferences', 'Cancel']
      }).then((result) => {
        if (result.response === 0) {
          // Open System Preferences
          require('child_process').exec('open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"');
        }
      });
    }
  } else {
    // For non-MAS apps, use standard approach
    if (!accessibilityCheck.isTrusted()) {
      console.log('Accessibility permissions not granted');
      // The system will show the permission dialog automatically
    }
  }
});
```

## API Reference

### `isTrusted(): boolean`

Checks if the current process has accessibility permissions granted.

**Returns:** `boolean` - `true` if the process is trusted, `false` otherwise

**Note:** This function only checks the current permission status and does not prompt the user.

### `isTrustedPrompt(): boolean`

Checks accessibility permissions and prompts for authorization if needed.

**Returns:** `boolean` - `true` if the process is trusted, `false` otherwise

**Note:**
- For regular apps: This function will show the system accessibility authorization dialog if permissions are not granted.
- For MAS apps: This function only checks current status due to sandbox restrictions.

### `isMASEnvironment(): boolean`

Checks if the app is running in MAS (Mac App Store) environment.

**Returns:** `boolean` - `true` if running in MAS sandbox, `false` otherwise

### `getPermissionStatus(): object`

Get detailed permission status information.

**Returns:** `object` with the following properties:
- `isTrusted: boolean` - Whether accessibility permissions are granted
- `isMAS: boolean` - Whether running in MAS environment
- `canPrompt: boolean` - Whether the app can show permission dialog
- `message?: string` - Guidance message for MAS apps when permissions are not granted

## MAS Environment Special Considerations

### Why MAS Apps Behave Differently

Mac App Store apps run in a sandboxed environment with restricted permissions. This affects how accessibility permissions work:

1. **No Direct Permission Dialogs**: MAS apps cannot directly trigger system permission dialogs
2. **User Manual Setup**: Users must manually enable permissions in System Preferences
3. **Limited System Access**: Sandbox restrictions prevent certain system-level operations

### Best Practices for MAS Apps

1. **Detect Environment**: Always check if running in MAS environment
2. **Provide Clear Guidance**: Show users exactly where to enable permissions
3. **Graceful Degradation**: Handle cases where permissions are not available
4. **User Education**: Explain why permissions are needed

### Example MAS Implementation

```javascript
const accessibilityCheck = require('mac-accessibility-check');

function checkAccessibilityPermissions() {
  const status = accessibilityCheck.getPermissionStatus();

  if (status.isMAS) {
    if (!status.isTrusted) {
      // Show custom UI to guide users
      showPermissionGuide();
    }
  } else {
    // Use standard approach for non-MAS apps
    if (!accessibilityCheck.isTrustedPrompt()) {
      console.log('Permission request shown to user');
    }
  }
}

function showPermissionGuide() {
  // Show custom dialog with instructions
  console.log('Please enable accessibility permissions in System Preferences');
}
```

## Building from Source

If you need to build from source (e.g., for a different Node.js version):

```bash
npm run build
```

## Development

```bash
# Install dependencies
npm install

# Build the native addon
npm run build

# Clean build artifacts
npm run clean

# Run tests
npm test
```

## Requirements

- macOS 10.15 (Catalina) or later
- Node.js 14.0.0 or later
- Xcode Command Line Tools

## Troubleshooting

### Permission Denied Errors

If you encounter permission issues:

1. Go to **System Preferences** > **Security & Privacy** > **Privacy** > **Accessibility**
2. Add your application to the list
3. Check the checkbox next to your application

### MAS App Permission Issues

For MAS apps, if permissions are not working:

1. **Check Bundle Identifier**: Ensure your app's bundle identifier is correctly configured
2. **Verify Entitlements**: Make sure your app has the necessary entitlements
3. **User Guidance**: Provide clear instructions to users about enabling permissions
4. **Test in MAS Environment**: Test your app in the actual MAS sandbox environment

### Build Errors

If you encounter build errors:

1. Make sure you have Xcode Command Line Tools installed:
   ```bash
   xcode-select --install
   ```

2. Ensure you're using a compatible Node.js version (14.0.0+)

3. Try cleaning and rebuilding:
   ```bash
   npm run clean
   npm run build
   ```

## License

MIT

## Contributing

This project was generated by AI. Contributions are welcome!
