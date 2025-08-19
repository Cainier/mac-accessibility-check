export declare function isTrusted(): boolean;
/**
 * 检查权限，如果没有会弹出系统的辅助功能授权提示框。
 * 注意：该函数会立即返回当前权限状态。
 */
export declare function isTrustedPrompt(): boolean;