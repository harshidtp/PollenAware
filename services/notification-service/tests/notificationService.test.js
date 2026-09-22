jest.mock("axios");

jest.mock("../src/repositories/notificationRepository", () => ({
  createNotification: jest.fn(),
  getNotificationsByUser: jest.fn(),
  markNotificationAsRead: jest.fn(),
}));

const axios = require("axios");

const notificationRepository = require(
  "../src/repositories/notificationRepository"
);

const {
  createRiskNotification,
  getNotificationsByUser,
  markNotificationAsRead,
} = require("../src/services/notificationService");

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a notification for HIGH risk when notifications are enabled", async () => {
    axios.get.mockResolvedValue({
      data: {
        notifications_enabled: true,
        preferred_location: "London",
      },
    });

    const savedNotification = {
      id: 1,
      user_id: "user-123",
      notification_type: "HIGH_RISK",
      title: "High Allergy Risk Detected",
      message:
        "A high allergy risk has been detected for your location.",
      risk_level: "HIGH",
      risk_score: 10,
    };

    notificationRepository.createNotification
      .mockResolvedValue(savedNotification);

    const result = await createRiskNotification({
      eventType: "RiskAssessmentCreated",
      userId: "user-123",
      assessmentId: "assessment-123",
      riskLevel: "HIGH",
      riskScore: 10,
    });

    expect(result).toEqual(savedNotification);

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3001/users/user-123/preferences"
    );

    expect(
      notificationRepository.createNotification
    ).toHaveBeenCalledWith({
      userId: "user-123",
      notificationType: "HIGH_RISK",
      title: "High Allergy Risk Detected",
      message:
        "A high allergy risk has been detected for your location.",
      riskLevel: "HIGH",
      riskScore: 10,
    });
  });

  test("does not create a notification for MODERATE risk", async () => {
    const result = await createRiskNotification({
      eventType: "RiskAssessmentCreated",
      userId: "user-123",
      riskLevel: "MODERATE",
      riskScore: 6,
    });

    expect(result).toBeNull();

    expect(axios.get).not.toHaveBeenCalled();

    expect(
      notificationRepository.createNotification
    ).not.toHaveBeenCalled();
  });

  test("does not create a notification when notifications are disabled", async () => {
    axios.get.mockResolvedValue({
      data: {
        notifications_enabled: false,
        preferred_location: "London",
      },
    });

    const result = await createRiskNotification({
      eventType: "RiskAssessmentCreated",
      userId: "user-123",
      riskLevel: "HIGH",
      riskScore: 10,
    });

    expect(result).toBeNull();

    expect(axios.get).toHaveBeenCalledTimes(1);

    expect(
      notificationRepository.createNotification
    ).not.toHaveBeenCalled();
  });

  test("returns notifications for a user", async () => {
    const notifications = [
      {
        id: 1,
        user_id: "user-123",
        notification_type: "HIGH_RISK",
      },
    ];

    notificationRepository.getNotificationsByUser
      .mockResolvedValue(notifications);

    const result =
      await getNotificationsByUser("user-123");

    expect(result).toEqual(notifications);

    expect(
      notificationRepository.getNotificationsByUser
    ).toHaveBeenCalledWith("user-123");
  });

  test("marks a notification as read", async () => {
    const notification = {
      id: 1,
      user_id: "user-123",
      read: true,
    };

    notificationRepository.markNotificationAsRead
      .mockResolvedValue(notification);

    const result =
      await markNotificationAsRead(1);

    expect(result).toEqual(notification);

    expect(
      notificationRepository.markNotificationAsRead
    ).toHaveBeenCalledWith(1);
  });
});
