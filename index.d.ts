/**
 * Check if the current process has accessibility permissions
 * @returns true if the process is trusted, false otherwise
 */
export declare function isTrusted(): boolean;

/**
 * Check accessibility permissions and prompt for authorization if needed
 * This function will show the system accessibility authorization dialog if permissions are not granted
 * @returns true if the process is trusted, false otherwise
 */
export declare function isTrustedPrompt(): boolean;

declare const _default: {
    isTrusted: typeof isTrusted;
    isTrustedPrompt: typeof isTrustedPrompt;
};

export default _default;
