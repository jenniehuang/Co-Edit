const passport = require("passport");
const User = require("../../models/user-model");
const request = require("supertest");

module.exports = async (sandbox, user, app) => {
  const findOneStub = sandbox.stub(User, "findOne");
  const comparePasswordStub = sandbox.stub(user, "comparePassword");

  comparePasswordStub.resolves(true);
  findOneStub.resolves(user);

  const result = await request(app)
    .post("/api/auth/login")
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(200);

  findOneStub.restore();
  comparePasswordStub.restore();

  return result.body.token;
};
