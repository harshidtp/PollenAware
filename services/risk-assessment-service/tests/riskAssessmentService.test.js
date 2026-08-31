jest.mock("axios");

jest.mock("../src/repositories/riskAssessmentRepository", () => ({
  createRiskAssessment: jest.fn(),
  getRiskAssessmentsByUser: jest.fn(),
}));

const axios = require("axios");

const riskAssessmentRepository = require(
  "../src/repositories/riskAssessmentRepository"
);

const {
  createRiskAssessment,
  getRiskAssessmentsByUser,
} = require("../src/services/riskAssessmentService");

describe("riskAssessmentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a risk assessment using user allergies and environmental data", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          allergies: ["Pollen", "Grass", "Dust"],
        },
      })
      .mockResolvedValueOnce({
        data: {
          grass_pollen_level: 1,
          tree_pollen_level: null,
          weed_pollen_level: 1,
          humidity: 69,
        },
      });

    const savedAssessment = {
      id: "assessment-123",
      user_id: "user-123",
      latitude: "51.507400",
      longitude: "-0.127800",
      risk_level: "MODERATE",
      risk_score: 6,
      grass_pollen_level: 1,
      tree_pollen_level: null,
      weed_pollen_level: 1,
    };

    riskAssessmentRepository.createRiskAssessment
      .mockResolvedValue(savedAssessment);

    const result = await createRiskAssessment({
      userId: "user-123",
      latitude: 51.5074,
      longitude: -0.1278,
    });

    expect(result).toEqual(savedAssessment);

    expect(axios.get).toHaveBeenCalledTimes(2);

    expect(
      riskAssessmentRepository.createRiskAssessment
    ).toHaveBeenCalledWith({
      userId: "user-123",
      latitude: 51.5074,
      longitude: -0.1278,
      riskLevel: "MODERATE",
      riskScore: 6,
      grassPollenLevel: 1,
      treePollenLevel: null,
      weedPollenLevel: 1,
    });
  });

  test("returns risk assessments for a user", async () => {
    const assessments = [
      {
        id: "assessment-1",
        user_id: "user-123",
        risk_level: "LOW",
        risk_score: 2,
      },
    ];

    riskAssessmentRepository.getRiskAssessmentsByUser
      .mockResolvedValue(assessments);

    const result = await getRiskAssessmentsByUser(
      "user-123"
    );

    expect(result).toEqual(assessments);

    expect(
      riskAssessmentRepository.getRiskAssessmentsByUser
    ).toHaveBeenCalledWith("user-123");
  });
});
