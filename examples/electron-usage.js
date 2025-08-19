const { app, dialog, BrowserWindow } = require('electron');
const accessibilityCheck = require('../index.js');
const { exec } = require('child_process');

// Example Electron app showing how to handle accessibility permissions
// in both MAS and non-MAS environments

function checkAccessibilityPermissions() {
  console.log('Checking accessibility permissions...');

  // First, check if we're in MAS environment
  const isMAS = accessibilityCheck.isMASEnvironment();
  console.log('Is MAS environment:', isMAS);

  if (isMAS) {
    // Handle MAS environment
    handleMASEnvironment();
  } else {
    // Handle regular environment
    handleRegularEnvironment();
  }
}

function handleMASEnvironment() {
  const status = accessibilityCheck.getPermissionStatus();
  console.log('Permission status:', status);

  if (!status.isTrusted) {
    // In MAS environment, we need to guide users manually
    showMASPermissionDialog();
  } else {
    console.log('Accessibility permissions are granted in MAS environment');
    // Continue with your app functionality
  }
}

function handleRegularEnvironment() {
  // For regular apps, we can try to prompt for permissions
  if (!accessibilityCheck.isTrusted()) {
    console.log('Requesting accessibility permissions...');

    // This will show the system permission dialog
    const hasPermissions = accessibilityCheck.isTrustedPrompt();

    if (hasPermissions) {
      console.log('Permissions granted!');
      // Continue with your app functionality
    } else {
      console.log('Permissions denied or not granted');
      showRegularPermissionDialog();
    }
  } else {
    console.log('Accessibility permissions are already granted');
    // Continue with your app functionality
  }
}

function showMASPermissionDialog() {
  dialog.showMessageBox({
    type: 'info',
    title: 'Accessibility Permissions Required',
    message: 'This app needs accessibility permissions to function properly.',
    detail: 'Since this app is from the Mac App Store, you need to manually enable permissions in System Preferences.',
    buttons: ['Open System Preferences', 'Cancel', 'Learn More'],
    defaultId: 0,
    cancelId: 1
  }).then((result) => {
    switch (result.response) {
      case 0: // Open System Preferences
        openSystemPreferences();
        break;
      case 2: // Learn More
        showLearnMoreDialog();
        break;
      default:
        console.log('User cancelled permission setup');
    }
  });
}

function showRegularPermissionDialog() {
  dialog.showMessageBox({
    type: 'warning',
    title: 'Accessibility Permissions Required',
    message: 'This app needs accessibility permissions to function properly.',
    detail: 'Please enable accessibility permissions when prompted, or go to System Preferences > Security & Privacy > Privacy > Accessibility.',
    buttons: ['Open System Preferences', 'Try Again', 'Cancel'],
    defaultId: 1,
    cancelId: 2
  }).then((result) => {
    switch (result.response) {
      case 0: // Open System Preferences
        openSystemPreferences();
        break;
      case 1: // Try Again
        // Try prompting again
        const hasPermissions = accessibilityCheck.isTrustedPrompt();
        if (hasPermissions) {
          console.log('Permissions granted on retry!');
        }
        break;
      default:
        console.log('User cancelled permission setup');
    }
  });
}

function showLearnMoreDialog() {
  dialog.showMessageBox({
    type: 'info',
    title: 'About Accessibility Permissions',
    message: 'Why does this app need accessibility permissions?',
    detail: 'Accessibility permissions allow this app to:\n• Monitor system events\n• Control other applications\n• Provide enhanced functionality\n\nThis is a standard macOS security feature that protects your privacy.',
    buttons: ['Open System Preferences', 'OK'],
    defaultId: 1
  }).then((result) => {
    if (result.response === 0) {
      openSystemPreferences();
    }
  });
}

function openSystemPreferences() {
  // Open System Preferences to the Accessibility section
  exec('open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"', (error) => {
    if (error) {
      console.error('Failed to open System Preferences:', error);
      // Fallback: open general System Preferences
      exec('open /System/Library/PreferencePanes/Security.prefPane');
    }
  });
}

// Example usage in Electron app
app.whenReady().then(() => {
  console.log('Electron app ready');

  // Check permissions when app starts
  checkAccessibilityPermissions();

  // Create main window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load your app content
  mainWindow.loadFile('index.html');

  // Example: Check permissions periodically
  setInterval(() => {
    const status = accessibilityCheck.getPermissionStatus();
    if (!status.isTrusted) {
      console.log('Permissions lost, showing reminder...');
      // You could show a subtle reminder here
    }
  }, 30000); // Check every 30 seconds
});

// Handle app activation
app.on('activate', () => {
  // Re-check permissions when app is activated
  checkAccessibilityPermissions();
});

// Example: Handle permission changes
app.on('browser-window-focus', () => {
  // Check permissions when window gains focus
  const status = accessibilityCheck.getPermissionStatus();
  if (status.isTrusted) {
    console.log('Permissions are active');
  }
});
