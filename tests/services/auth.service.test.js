import { jest } from "@jest/globals";

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockUploadUtils = {
  uploadProfilePic: jest.fn(),
};

const mockToken = jest.fn();

jest.unstable_mockModule("../../src/models/User.js", () => ({
  default: mockUserModel,
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: mockBcrypt,
}));

jest.unstable_mockModule("../../src/utils/uploadUtils.js", () => mockUploadUtils);

jest.unstable_mockModule("../../src/utils/generateToken.js", () => ({
  generateToken: mockToken,
}));

const authService = await import("../../src/services/auth.service.js");
const { signupService, loginService } = authService;

const buildUserDoc = (overrides = {}) => ({
  _id: "user-id",
  email: "user@example.com",
  password: "hashed-password",
  toObject: jest.fn(() => ({
    _id: "user-id",
    email: "user@example.com",
    password: "hashed-password",
    ...overrides,
  })),
  ...overrides,
});

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signupService", () => {
    it("creates a new user and strips the password", async () => {
      const userDoc = buildUserDoc();
      mockUserModel.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue("hashed-secret");
      mockUserModel.create.mockResolvedValue(userDoc);
      mockToken.mockReturnValue("jwt-token");

      const result = await signupService({
        name: "Sample",
        email: "user@example.com",
        password: "secret",
      });

      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: "Sample",
        email: "user@example.com",
        password: "hashed-secret",
        role: "student",
      });
      expect(mockToken).toHaveBeenCalledWith("user-id");
      expect(result.token).toBe("jwt-token");
      expect(result.user).toMatchObject({
        _id: "user-id",
        email: "user@example.com",
      });
      expect(result.user).not.toHaveProperty("password");
    });

    it("throws when the email is already registered", async () => {
      mockUserModel.findOne.mockResolvedValue({ _id: "existing" });

      await expect(signupService({
        name: "Sample",
        email: "user@example.com",
        password: "secret",
      })).rejects.toThrow("User with this email already exists");
    });
  });

  describe("loginService", () => {
    it("throws when the password is invalid", async () => {
      const userDoc = buildUserDoc();
      mockUserModel.findOne.mockResolvedValue(userDoc);
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(loginService({
        email: "user@example.com",
        password: "wrong",
      })).rejects.toThrow("Invalid credentials");
    });

    it("returns a token and sanitized user for valid credentials", async () => {
      const userDoc = buildUserDoc();
      mockUserModel.findOne.mockResolvedValue(userDoc);
      mockBcrypt.compare.mockResolvedValue(true);
      mockToken.mockReturnValue("jwt-token");

      const result = await loginService({
        email: "user@example.com",
        password: "secret",
      });

      expect(mockToken).toHaveBeenCalledWith("user-id");
      expect(result).toEqual({
        token: "jwt-token",
        user: expect.objectContaining({
          _id: "user-id",
          email: "user@example.com",
        }),
      });
      expect(result.user).not.toHaveProperty("password");
    });
  });
});