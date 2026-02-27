const { validate } = require("../../middleware/validate");
const { validationResult } = require("express-validator");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const mockReq = () => ({});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validate middleware", () => {
  it("calls next() when no validation errors", () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    const next = jest.fn();
    validate(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 400 with first error message", () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { msg: "Name is required", path: "name" },
        { msg: "Email is invalid", path: "email" },
      ],
    });
    const res = mockRes();
    const next = jest.fn();
    validate(mockReq(), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Name is required",
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: "Name is required" }),
      ]),
    });
    expect(next).not.toHaveBeenCalled();
  });
});
