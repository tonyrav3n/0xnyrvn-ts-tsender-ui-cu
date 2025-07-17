import { describe, expect, it } from "vitest";
import { calculateTotal } from "@/utils";

describe("calculateTotal", () => {
  describe("Comma-separated inputs", () => {
    it("should calculate total from comma-separated numbers", () => {
      expect(calculateTotal("100, 200, 300")).toBe(600);
    });

    it("should handle comma-separated with extra spaces", () => {
      expect(calculateTotal("100,  200,   300")).toBe(600);
    });

    it("should handle single number with comma", () => {
      expect(calculateTotal("100,")).toBe(100);
    });
  });

  describe("Newline-separated inputs", () => {
    it("should calculate total from newline-separated numbers", () => {
      expect(calculateTotal("100\n200\n300")).toBe(600);
    });

    it("should handle numbers with extra newlines", () => {
      expect(calculateTotal("100\n\n200\n\n\n300")).toBe(600);
    });

    it("should handle mixed newlines and carriage returns", () => {
      expect(calculateTotal("100\r\n200\r\n300")).toBe(600);
    });
  });

  describe("Space-separated inputs", () => {
    it("should calculate total from space-separated numbers", () => {
      expect(calculateTotal("100 200 300")).toBe(600);
    });

    it("should handle multiple spaces", () => {
      expect(calculateTotal("100   200    300")).toBe(600);
    });

    it("should handle tab-separated numbers", () => {
      expect(calculateTotal("100\t200\t300")).toBe(600);
    });
  });

  describe("Mixed format inputs", () => {
    it("should handle comma and space mixed", () => {
      expect(calculateTotal("100, 200 300")).toBe(600);
    });

    it("should handle comma, space, and newline mixed", () => {
      expect(calculateTotal("100, 200\n300 400")).toBe(1000);
    });

    it("should handle all delimiters mixed", () => {
      expect(calculateTotal("100, 200\n300\t400 500")).toBe(1500);
    });
  });

  describe("Decimal numbers", () => {
    it("should handle decimal numbers", () => {
      expect(calculateTotal("10.5, 20.25, 30.75")).toBe(61.5);
    });

    it("should handle mixed integers and decimals", () => {
      expect(calculateTotal("100, 50.5, 25")).toBe(175.5);
    });

    it("should handle numbers starting with decimal point", () => {
      expect(calculateTotal(".5, .25, .75")).toBe(1.5);
    });
  });

  describe("Negative numbers", () => {
    it("should handle negative numbers", () => {
      expect(calculateTotal("-100, -200, -300")).toBe(-600);
    });

    it("should handle mixed positive and negative", () => {
      expect(calculateTotal("100, -50, 25")).toBe(75);
    });

    it("should handle negative decimals", () => {
      expect(calculateTotal("-10.5, 20.5")).toBe(10);
    });
  });

  describe("Edge cases", () => {
    it("should return 0 for empty string", () => {
      expect(calculateTotal("")).toBe(0);
    });

    it("should return 0 for whitespace only", () => {
      expect(calculateTotal("   \n\t  ")).toBe(0);
    });

    it("should return 0 for null input", () => {
      expect(calculateTotal(null as any)).toBe(0);
    });

    it("should return 0 for undefined input", () => {
      expect(calculateTotal(undefined as any)).toBe(0);
    });

    it("should return 0 for non-string input", () => {
      expect(calculateTotal(123 as any)).toBe(0);
      expect(calculateTotal([] as any)).toBe(0);
      expect(calculateTotal({} as any)).toBe(0);
    });

    it("should handle single number", () => {
      expect(calculateTotal("42")).toBe(42);
    });

    it("should handle zero values", () => {
      expect(calculateTotal("0, 0, 0")).toBe(0);
      expect(calculateTotal("100, 0, -100")).toBe(0);
    });
  });

  describe("Invalid input handling", () => {
    it("should ignore invalid numbers and sum valid ones", () => {
      expect(calculateTotal("100, abc, 200")).toBe(300);
    });

    it("should ignore multiple invalid numbers", () => {
      expect(calculateTotal("100, abc, 200, def, 300")).toBe(600);
    });

    it("should return 0 when all inputs are invalid", () => {
      expect(calculateTotal("abc, def, ghi")).toBe(0);
    });

    it("should handle empty values between delimiters", () => {
      expect(calculateTotal("100,, 200,, 300")).toBe(600);
    });

    it("should ignore Infinity and NaN", () => {
      expect(calculateTotal("100, Infinity, 200")).toBe(300);
      expect(calculateTotal("100, NaN, 200")).toBe(300);
    });
  });

  describe("Large numbers", () => {
    it("should handle large integers", () => {
      expect(calculateTotal("1000000, 2000000, 3000000")).toBe(6000000);
    });

    it("should handle very precise decimals", () => {
      expect(calculateTotal("0.1, 0.2, 0.3")).toBeCloseTo(0.6, 10);
    });
  });

  describe("Whitespace handling", () => {
    it("should trim leading and trailing whitespace", () => {
      expect(calculateTotal("  100, 200, 300  ")).toBe(600);
    });

    it("should handle numbers with internal whitespace around them", () => {
      expect(calculateTotal(" 100 , 200 , 300 ")).toBe(600);
    });

    it("should handle mixed whitespace types", () => {
      expect(calculateTotal("\t100\n200\r300 ")).toBe(600);
    });
  });
});
