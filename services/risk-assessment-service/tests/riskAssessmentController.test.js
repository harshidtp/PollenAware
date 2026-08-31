jest.mock("../src/services/riskAssessmentService", () => ({
  createRiskAssessment: jest.fn(),
  getRiskAssessmentsByUser: jest.fn(),
}));

const riskAssessmentService = require(
  "../src/services/riskAssessmentService"
);

const {
  createRiskAssessment,
  getRiskAssessmentsByUser,
} = require("../src/controllers/riskAssessmentController");

const createResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

describe("riskAssessmentController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a risk assessment with valid coordinates", async () => {
    const req = {
      params: {
        userId: "user-123",
      },
      query: {
        latitude: "51.5074",
        longitude: "-0.1278",
      },
    };

    const res = createResponse();

    const assessment = {
      id: "assessment-123",
      user_id: "user-123",
      risk_level: "MODERATE",
      risk_score: 6,
    };

    riskAssessmentService.createRiskAssessment.mockResolvedValue(
      assessment
    );

    await createRiskAssessment(req, res);

    expect(
      riskAssessmentService.createRiskAssessment
    ).toHaveBeenCalledWith({
      userId: "user-123",
      latitude: 51.5074,
      longitude: -0.1278,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(assessment);
  });

  test("rejects missing or invalid coordinates", async () => {
    const req = {
      params: {
        userId: "user-123",
      },
      query: {
        latitude: "abc",
        longitude: "-0.1278",
      },
    };

    const res = createResponse();

    await createRiskAssessment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Valid latitude and longitude are required",
    });

    expect(
      riskAssessmentService.createRiskAssessment
    ).not.toHaveBeenCalled();
  });

  test("rejects latitude outside valid range", async () => {
    const req = {
      params: {
        userId: "user-123",
      },
      query: {
        latitude: "91",
        longitude: "-0.1278",
      },
    };

    const res = createResponse();

    await createRiskAssessment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Latitude must be between -90 and 90",
    });
  });

  test("rejects longitude outside valid range", async () => {
    const req = {
      params: {
        userId: "user-123",
      },
      query: {
        latitude: "51.5074",
        longitude: "181",
      },
    };

    const res = createResponse();

    await createRiskAssessment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Longitude must be between -180 and 180",
    });
  });

  test("returns 500 when risk assessment creation fails", async () => {
    const req = {
      params: {
        userId: "user-123",
      },
      query: {
        latitude: "51.5074",
        longitude: "-0.1278",
      },
    };

    const res = createResponse();

    riskAssessmentService.createRiskAssessment.mockRejectedValue(
      new Error("Service failure")
    );

    await createRiskAssessment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to create risk assessment",
    });
  });

  test("returns risk assessments for a user", async () => {
    const req = {
      params: {
        userId: "user-123",
      },
    };

    const res = createResponse();

    const assessments = [
      {
        id: "assessment-1",
        user_id: "user-123",
        risk_level: "LOW",
        risk_score: 2,
      },
    ];

    riskAssessmentService.getRiskAssessmentsByUser.mockResolvedValue(
      assessments
    );

    await getRiskAssessmentsByUser(req, res);

    expect(
      riskAssessmentService.getRiskAssessmentsByUser
    ).toHaveBeenCalledWith("user-123");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(assessments);
  });

  test("returns 500 when retrieving assessments fails", async () => {
    const req = {
      params: {
        userId: "user-123",
      },
    };

    const res = createResponse();

    riskAssessmentService.getRiskAssessmentsByUser.mockRejectedValue(
      new Error("Database failure")
    );

    await getRiskAssessmentsByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to retrieve risk assessments",
    });
  });
});
