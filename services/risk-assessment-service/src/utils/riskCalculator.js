const calculateRisk = (allergies, environmentalData) => {
  let score = 0;

  const allergyNames = allergies.map((allergy) =>
    allergy.toLowerCase()
  );

  const grassPollen = Number(
    environmentalData.grass_pollen_level || 0
  );

  const treePollen = Number(
    environmentalData.tree_pollen_level || 0
  );

  const weedPollen = Number(
    environmentalData.weed_pollen_level || 0
  );

  if (
    allergyNames.includes("grass") ||
    allergyNames.includes("pollen")
  ) {
    score += grassPollen * 2;
  }

  if (allergyNames.includes("pollen")) {
    score += treePollen * 2;
    score += weedPollen * 2;
  }

  if (allergyNames.includes("dust")) {
    const humidity = Number(
      environmentalData.humidity || 0
    );

    if (humidity >= 60) {
      score += 2;
    }
  }

  let riskLevel = "LOW";

  if (score >= 8) {
    riskLevel = "HIGH";
  } else if (score >= 4) {
    riskLevel = "MODERATE";
  }

  return {
    riskScore: score,
    riskLevel,
  };
};

module.exports = {
  calculateRisk,
};
