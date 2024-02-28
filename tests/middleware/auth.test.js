const { User } = require("../../models/user.model");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  Test("should populate req.user with a payload of valid JWT ", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      Header: jest.fn().mockReturnValue(token),
    };

    const res = {};
    const next = jest.fn();
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
