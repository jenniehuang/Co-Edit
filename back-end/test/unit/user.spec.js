const app = require("../../app");
const request = require("supertest");
const sinon = require("sinon");
const User = require("../../models/user-model");
const bypassAuth = require("../helpers/bypassAuth");

describe("user", () => {
  let sandbox = sinon.createSandbox();
  let user;
  let anotherUser;

  let userFindByIdStub;
  let userFindOneAndUpdateStub;
  let userFindOneStub;
  beforeEach(async () => {
    // stub replace the function and make it return  what we want.
    user = new User({
      name: "asdasd",
      email: "333@333.com",
      password: "1234567",
      background: "https://images",
    });

    anotherUser = new User({
      name: "asdasd",
      email: "666@666.com",
      password: "1234567",
      subscribe: ["72cd56ed-97dc-4e46-9f8a-bcaac516f51d"],
    });

    userFindByIdStub = sandbox.stub(User, "findById");
    userToken = await bypassAuth(sandbox, user, app);
    userFindOneAndUpdateStub = sandbox.stub(User, "findOneAndUpdate");
    userFindOneStub = sandbox.stub(User, "findOne");

    //for bypassing auth because we can't stub passport authenticate.
    //if we need to use findById again in the same test than use onCall(1), onCall(2) ...etc
    userFindByIdStub.onCall(0).resolves(user);
  });
  afterEach(() => {
    // !important to call this in afterEach.
    sandbox.restore();
  });

  //------------------------------------------------------------------------

  describe("uploadUserData", () => {
    test("should upload user data", async () => {
      userFindOneAndUpdateStub.returns(user);
      const result = await request(app)
        .patch(`/api/user/userData`)
        .set("Authorization", userToken)
        .expect(200);
      expect(result.text).toBe("ok");
    });
  });

  //------------------------------------------------------------------------
  describe("getUserInfo", () => {
    test("should get user data", async () => {
      userFindOneStub.returns(user);
      const data = {
        name: user.name,
        thumbnail: user.thumbnail,
        background: user.background,
        about: user.about,
        link: user.link,
      };
      const result = await request(app)
        .get(`/api/user/${anotherUser._id}`)
        .set("Authorization", userToken)
        .expect(200);
      expect(result.body).toStrictEqual(data);
    });
  });
});
