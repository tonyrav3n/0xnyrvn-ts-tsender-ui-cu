/**
 * Calculates the total sum from various input formats
 * Supports comma-separated, space-separated, and newline-separated numbers
 *
 * @param input - String containing numbers in various formats
 * @returns The sum of all valid numbers found in the input
 */
export function calculateTotal(input: string): number {
  if (!input || typeof input !== "string") {
    return 0;
  }

  // Remove extra whitespace and normalize the input
  const cleanInput = input.trim();

  if (!cleanInput) {
    return 0;
  }

  // Split by multiple delimiters: commas, spaces, newlines, tabs
  const numbers = cleanInput
    .split(/[,\s\n\r\t]+/) // Split by comma, space, newline, carriage return, or tab
    .map((str) => str.trim()) // Remove whitespace from each part
    .filter((str) => str.length > 0) // Remove empty strings
    .map((str) => parseFloat(str)) // Convert to numbers
    .filter((num) => !isNaN(num) && isFinite(num)); // Keep only valid numbers

  // Calculate the sum
  return numbers.reduce((sum, num) => sum + num, 0);
}

/**
 * Validates if the input contains valid numbers
 *
 * @param input - String to validate
 * @returns Object with validation result and error message if any
 */
export function validateNumberInput(input: string): {
  isValid: boolean;
  errorMessage?: string;
  numbers: number[];
} {
  if (!input || typeof input !== "string") {
    return {
      isValid: false,
      errorMessage: "Input is required",
      numbers: [],
    };
  }

  const cleanInput = input.trim();

  if (!cleanInput) {
    return {
      isValid: false,
      errorMessage: "Input cannot be empty",
      numbers: [],
    };
  }

  // Split and parse numbers
  const parts = cleanInput
    .split(/[,\s\n\r\t]+/)
    .map((str) => str.trim())
    .filter((str) => str.length > 0);
  const numbers: number[] = [];
  const invalidParts: string[] = [];

  parts.forEach((part) => {
    const num = parseFloat(part);
    if (isNaN(num) || !isFinite(num)) {
      invalidParts.push(part);
    } else {
      numbers.push(num);
    }
  });

  if (invalidParts.length > 0) {
    return {
      isValid: false,
      errorMessage: `Invalid numbers found: ${invalidParts.join(", ")}`,
      numbers,
    };
  }

  if (numbers.length === 0) {
    return {
      isValid: false,
      errorMessage: "No valid numbers found",
      numbers: [],
    };
  }

  return {
    isValid: true,
    numbers,
  };
}
