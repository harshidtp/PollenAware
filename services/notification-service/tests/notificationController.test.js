jest.mock("../src/services/notificationService", () => ({
  getNotificationsByUser: jest.fn(),
  markNotificationAsRead: jest.fn(),
}));

const notificationService = require(
  "../src/services/notificationService"
);

const {
  getNotificationsByUser,
  markNotificationAsRead,
} = require("../src/controllers/notificationController");

describe("notificationController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns notifications for a user", async () => {
    const notifications = [
      {
        id: 1,
        user_id: "user-123",
        notification_type: "HIGH_RISK",
      },
    ];

    notificationService.getNotificationsByUser
      .mockResolvedValue(notifications);

    const req = {
      params: {
        userId: "user-123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getNotificationsByUser(req, res);

    expect(
      notificationService.getNotificationsByUser
    ).toHaveBeenCalledWith("user-123");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(notifications);
  });

  test("marks a notification as read", async () => {
    const notification = {
      id: 1,
      user_id: "user-123",
      read: true,
    };

    notificationService.markNotificationAsRead
      .mockResolvedValue(notification);

    const req = {
      params: {
        notificationId: "1",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await markNotificationAsRead(req, res);

    expect(
      notificationService.markNotificationAsRead
    ).toHaveBeenCalledWith("1");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(notification);
  });

  test("returns 404 when notification does not exist", async () => {
    notificationService.markNotificationAsRead
      .mockResolvedValue(undefined);

    const req = {
      params: {
        notificationId: "999",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await markNotificationAsRead(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      message: "Notification not found",
    });
  });
});
