const { calculateRisk } = require("../src/utils/riskCalculator");

describe("calculateRisk", () => {
  test("returns LOW risk when there are no relevant risk factors", () => {
    const result = calculateRisk([], {
      grass_pollen_level: 0,
      tree_pollen_level: 0,
      weed_pollen_level: 0,
      humidity: 40,
    });

    expect(result).toEqual({
      riskScore: 0,
      riskLevel: "LOW",
    });
  });

  test("returns MODERATE risk for the current Pollen + Grass + Dust example", () => {
    const result = calculateRisk(
      ["Pollen", "Grass", "Dust"],
      {
        grass_pollen_level: 1,
        tree_pollen_level: null,
        weed_pollen_level: 1,
        humidity: 69,
      }
    );

    expect(result).toEqual({
      riskScore: 6,
      riskLevel: "MODERATE",
    });
  });

  test("returns HIGH risk when pollen exposure is high", () => {
    const result = calculateRisk(
      ["Pollen", "Grass"],
      {
        grass_pollen_level: 3,
        tree_pollen_level: 3,
        weed_pollen_level: 3,
        humidity: 40,
      }
    );

    expect(result).toEqual({
      riskScore: 18,
      riskLevel: "HIGH",
    });
  });

  test("adds dust risk when humidity is 60 or higher", () => {
    const result = calculateRisk(
      ["Dust"],
      {
        grass_pollen_level: 0,
        tree_pollen_level: 0,
        weed_pollen_level: 0,
        humidity: 60,
      }
    );

    expect(result).toEqual({
      riskScore: 2,
      riskLevel: "LOW",
    });
  });

  test("does not add dust risk below 60% humidity", () => {
    const result = calculateRisk(
      ["Dust"],
      {
        grass_pollen_level: 0,
        tree_pollen_level: 0,
        weed_pollen_level: 0,
        humidity: 59,
      }
    );

    expect(result).toEqual({
      riskScore: 0,
      riskLevel: "LOW",
    });
  });

  test("handles null pollen values as zero", () => {
    const result = calculateRisk(
      ["Pollen"],
      {
        grass_pollen_level: null,
        tree_pollen_level: null,
        weed_pollen_level: null,
        humidity: 40,
      }
    );

    expect(result).toEqual({
      riskScore: 0,
      riskLevel: "LOW",
    });
  });
});
