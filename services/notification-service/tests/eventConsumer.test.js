jest.mock("../src/messaging/rabbitmq", () => ({
  getChannel: jest.fn(),
  EXCHANGE_NAME: "pollenaware.events",
}));

jest.mock("../src/services/notificationService", () => ({
  createRiskNotification: jest.fn(),
}));

const {
  getChannel,
} = require("../src/messaging/rabbitmq");

const {
  createRiskNotification,
} = require("../src/services/notificationService");

const {
  startEventConsumer,
} = require("../src/messaging/eventConsumer");

describe("eventConsumer", () => {
  const mockChannel = {
    assertQueue: jest.fn(),
    bindQueue: jest.fn(),
    consume: jest.fn(),
    ack: jest.fn(),
    nack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    getChannel.mockReturnValue(mockChannel);

    mockChannel.assertQueue.mockResolvedValue({});
    mockChannel.bindQueue.mockResolvedValue({});
  });

  test("subscribes to RiskAssessmentCreated events", async () => {
    await startEventConsumer();

    expect(
      mockChannel.assertQueue
    ).toHaveBeenCalledWith(
      "notification-service.events",
      {
        durable: true,
      }
    );

    expect(
      mockChannel.bindQueue
    ).toHaveBeenCalledWith(
      "notification-service.events",
      "pollenaware.events",
      "RiskAssessmentCreated"
    );

    expect(
      mockChannel.consume
    ).toHaveBeenCalledWith(
      "notification-service.events",
      expect.any(Function)
    );
  });

  test("processes RiskAssessmentCreated event", async () => {
    await startEventConsumer();

    const consumeCallback =
      mockChannel.consume.mock.calls[0][1];

    const event = {
      eventType: "RiskAssessmentCreated",
      userId: "user-123",
      assessmentId: "assessment-123",
      riskLevel: "HIGH",
      riskScore: 10,
    };

    const message = {
      content: Buffer.from(
        JSON.stringify(event)
      ),
    };

    createRiskNotification.mockResolvedValue({
      id: 1,
    });

    await consumeCallback(message);

    expect(
      createRiskNotification
    ).toHaveBeenCalledWith(event);

    expect(
      mockChannel.ack
    ).toHaveBeenCalledWith(message);
  });

  test("rejects messages when processing fails", async () => {
    await startEventConsumer();

    const consumeCallback =
      mockChannel.consume.mock.calls[0][1];

    createRiskNotification.mockRejectedValue(
      new Error("Processing failure")
    );

    const message = {
      content: Buffer.from(
        JSON.stringify({
          eventType: "RiskAssessmentCreated",
          userId: "user-123",
          riskLevel: "HIGH",
          riskScore: 10,
        })
      ),
    };

    await consumeCallback(message);

    expect(
      mockChannel.nack
    ).toHaveBeenCalledWith(
      message,
      false,
      false
    );

    expect(
      mockChannel.ack
    ).not.toHaveBeenCalled();
  });
});
