#include <napi.h>
#import <ApplicationServices/ApplicationServices.h>
#import <Foundation/Foundation.h>

// Check if running in MAS sandbox
bool IsRunningInMAS() {
  NSBundle *bundle = [NSBundle mainBundle];
  NSString *bundleIdentifier = [bundle bundleIdentifier];

  // MAS apps typically have specific bundle identifiers
  // You can also check for sandbox entitlements
  return [bundleIdentifier containsString:@"com.apple.appstore"] ||
         [bundleIdentifier containsString:@"mas."] ||
         [bundleIdentifier containsString:@"macappstore"];
}

// Check if accessibility permissions are granted
Napi::Boolean IsTrusted(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), AXIsProcessTrusted());
}

// Check permissions and prompt for authorization if needed
Napi::Boolean IsTrustedWithPrompt(const Napi::CallbackInfo& info) {
  // First check if we're in MAS environment
  bool isMAS = IsRunningInMAS();

  if (isMAS) {
    // In MAS environment, we can only check current status
    // The system will handle permission requests differently
    bool trusted = AXIsProcessTrusted();

    if (!trusted) {
      // In MAS, we need to guide users to System Preferences
      // The system may show a notification or dialog automatically
      // But we can't force the permission dialog
      NSLog(@"MAS App: Accessibility permissions not granted. User needs to enable in System Preferences.");
    }

    return Napi::Boolean::New(info.Env(), trusted);
  }

  // For non-MAS apps, use the standard approach
  CFDictionaryRef options = CFDictionaryCreate(
    NULL,
    (const void**)&kAXTrustedCheckOptionPrompt,
    (const void**)&kCFBooleanTrue,
    1,
    &kCFTypeDictionaryKeyCallBacks,
    &kCFTypeDictionaryValueCallBacks
  );

  if (!options) {
    // If dictionary creation fails, fall back to simple check
    return Napi::Boolean::New(info.Env(), AXIsProcessTrusted());
  }

  bool trusted = AXIsProcessTrustedWithOptions(options);
  CFRelease(options);
  return Napi::Boolean::New(info.Env(), trusted);
}

// Check if running in MAS environment
Napi::Boolean IsMASEnvironment(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), IsRunningInMAS());
}

// Get current permission status with detailed information
Napi::Object GetPermissionStatus(const Napi::CallbackInfo& info) {
  Napi::Object result = Napi::Object::New(info.Env());

  bool isMAS = IsRunningInMAS();
  bool isTrusted = AXIsProcessTrusted();

  result.Set("isTrusted", Napi::Boolean::New(info.Env(), isTrusted));
  result.Set("isMAS", Napi::Boolean::New(info.Env(), isMAS));
  result.Set("canPrompt", Napi::Boolean::New(info.Env(), !isMAS));

  if (isMAS && !isTrusted) {
    result.Set("message", Napi::String::New(info.Env(),
      "MAS App detected. Please enable accessibility permissions in System Preferences > Security & Privacy > Privacy > Accessibility"));
  }

  return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("isTrusted", Napi::Function::New(env, IsTrusted));
  exports.Set("isTrustedPrompt", Napi::Function::New(env, IsTrustedWithPrompt));
  exports.Set("isMASEnvironment", Napi::Function::New(env, IsMASEnvironment));
  exports.Set("getPermissionStatus", Napi::Function::New(env, GetPermissionStatus));
  return exports;
}

NODE_API_MODULE(access_check, Init)
