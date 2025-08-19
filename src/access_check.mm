#include <napi.h>
#import <ApplicationServices/ApplicationServices.h>

// Check if accessibility permissions are granted
Napi::Boolean IsTrusted(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), AXIsProcessTrusted());
}

// Check permissions and prompt for authorization if needed
Napi::Boolean IsTrustedWithPrompt(const Napi::CallbackInfo& info) {
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

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("isTrusted", Napi::Function::New(env, IsTrusted));
  exports.Set("isTrustedPrompt", Napi::Function::New(env, IsTrustedWithPrompt));
  return exports;
}

NODE_API_MODULE(access_check, Init)
