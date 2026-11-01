/**
 * Client-Side Security & Privacy Utilities
 * Zero-Data-Leakage Architecture for SIET Institutional Resume Engine
 */

/**
 * Derives an isolated user-specific storage key based on base64-encoded email.
 * Guarantees cross-student draft isolation on shared or lab machines.
 */
export function getStudentDraftKey(email: string): string {
  if (!email || !email.trim()) return "siet_resume_draft_guest";
  try {
    const sanitizedEmail = email.trim().toLowerCase();
    // btoa safe representation
    const encoded = btoa(unescape(encodeURIComponent(sanitizedEmail))).replace(/[/+=]/g, "_");
    return `siet_resume_draft_${encoded}`;
  } catch {
    return `siet_resume_draft_generic`;
  }
}

/**
 * Client-side input sanitization against XSS & malformed characters.
 * Prevents script injection vectors while retaining legitimate punctuation.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, (char) => (char === "<" ? "&lt;" : "&gt;"))
    .trim();
}

/**
 * Validates uploaded student photograph for safe client-side preview.
 * Strictly enforces file type (JPG/JPEG/PNG) and 3MB size cap.
 */
export function validatePassportPhoto(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  
  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Invalid file format. Please upload a standard JPG or PNG photograph."
    };
  }

  // Max 3MB (3 * 1024 * 1024 bytes)
  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeInMB} MB). Maximum allowed photograph size is 3 MB.`
    };
  }

  return { valid: true };
}
