#include <napi.h>
#import <ApplicationServices/ApplicationServices.h>

// 检查是否已获得权限
Napi::Boolean IsTrusted(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), AXIsProcessTrusted());
}

// 检查权限，如果没有则弹出系统提示引导授权
Napi::Boolean IsTrustedWithPrompt(const Napi::CallbackInfo& info) {
  CFDictionaryRef options = CFDictionaryCreate(
    NULL,
    (const void**)&kAXTrustedCheckOptionPrompt,
    (const void**)&kCFBooleanTrue,
    1,
    &kCFTypeDictionaryKeyCallBacks,
    &kCFTypeDictionaryValueCallBacks
  );
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