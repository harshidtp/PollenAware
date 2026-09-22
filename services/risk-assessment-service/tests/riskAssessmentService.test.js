jest.mock("axios");

jest.mock("../src/repositories/riskAssessmentRepository", () => ({
  createRiskAssessment: jest.fn(),
  getRiskAssessmentsByUser: jest.fn(),
}));

jest.mock("../src/messaging/rabbitmq", () => ({
  getChannel: jest.fn(),
  EXCHANGE_NAME: "pollenaware.events",
}));

const axios = require("axios");

const riskAssessmentRepository = require(
  "../src/repositories/riskAssessmentRepository"
);

const {
  getChannel,
  EXCHANGE_NAME,
} = require("../src/messaging/rabbitmq");

const {
  createRiskAssessment,
  getRiskAssessmentsByUser,
} = require("../src/services/riskAssessmentService");

describe("riskAssessmentService", () => {
  const mockPublish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    getChannel.mockReturnValue({
      publish: mockPublish,
    });
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
      calculated_at: "2026-09-05T10:00:00.000Z",
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

    expect(mockPublish).toHaveBeenCalledTimes(1);

    const [exchange, routingKey, message, options] =
      mockPublish.mock.calls[0];

    expect(exchange).toBe(EXCHANGE_NAME);
    expect(routingKey).toBe("RiskAssessmentCreated");

    expect(JSON.parse(message.toString())).toEqual({
      eventType: "RiskAssessmentCreated",
      userId: "user-123",
      assessmentId: "assessment-123",
      riskLevel: "MODERATE",
      riskScore: 6,
      latitude: "51.507400",
      longitude: "-0.127800",
      createdAt: "2026-09-05T10:00:00.000Z",
    });

    expect(options).toEqual({
      persistent: true,
      contentType: "application/json",
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
