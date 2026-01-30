/**
 * Utility functions for handling xsd:boolean values.
 *
 * xsd:boolean accepts: 'true', 'false', '1', '0' (case-insensitive)
 * Output is normalized to 'true' or 'false' strings.
 */

/**
 * Parse a boolean value from RDF.
 * Accepts: 'true', 'false', '1', '0' (case-insensitive)
 *
 * @param {string} value - The string value from RDF
 * @returns {boolean|null} - true, false, or null for empty/invalid
 */
export const parseBoolean = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const normalized = String(value).toLowerCase().trim();

  if (normalized === 'true' || normalized === '1') {
    return true;
  }

  if (normalized === 'false' || normalized === '0') {
    return false;
  }

  // Invalid value - return null (validation will handle this)
  return null;
};

/**
 * Format a boolean value for RDF output.
 * Always outputs 'true' or 'false' strings.
 *
 * @param {boolean|null} value - The boolean value
 * @returns {string} - 'true', 'false', or '' for null
 */
export const formatBoolean = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  return value ? 'true' : 'false';
};

/**
 * Check if a string is a valid xsd:boolean value.
 *
 * @param {string} value - The string to validate
 * @returns {boolean} - true if valid xsd:boolean
 */
export const isValidBoolean = (value) => {
  if (value === null || value === undefined || value === '') {
    return true; // Empty is valid (no value)
  }

  const normalized = String(value).toLowerCase().trim();
  return ['true', 'false', '1', '0'].includes(normalized);
};
