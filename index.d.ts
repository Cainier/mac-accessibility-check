/**
 * Check if the current process has accessibility permissions
 * @returns true if the process is trusted, false otherwise
 */
export declare function isTrusted(): boolean;

/**
 * Check accessibility permissions and prompt for authorization if needed
 * This function will show the system accessibility authorization dialog if permissions are not granted
 * Note: In MAS (Mac App Store) environment, this function only checks current status
 * @returns true if the process is trusted, false otherwise
 */
export declare function isTrustedPrompt(): boolean;

/**
 * Check if the app is running in MAS (Mac App Store) environment
 * @returns true if running in MAS sandbox, false otherwise
 */
export declare function isMASEnvironment(): boolean;

/**
 * Get detailed permission status information
 * @returns Object containing permission status and environment information
 */
export declare function getPermissionStatus(): {
  isTrusted: boolean;
  isMAS: boolean;
  canPrompt: boolean;
  message?: string;
};

declare const _default: {
    isTrusted: typeof isTrusted;
    isTrustedPrompt: typeof isTrustedPrompt;
    isMASEnvironment: typeof isMASEnvironment;
    getPermissionStatus: typeof getPermissionStatus;
};

export default _default;
