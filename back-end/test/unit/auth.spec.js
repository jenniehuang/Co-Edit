const app = require("../../app");
const request = require("supertest");
const sinon = require("sinon");
const User = require("../../models/user-model");
const jwt = require("jsonwebtoken");

describe("login", () => {
  let sandbox = sinon.createSandbox();
  let findOneStub;
  let user;
  let comparePasswordStub;
  beforeEach(() => {
    // stub replace the function and make it return  what we want.
    findOneStub = sandbox.stub(User, "findOne");

    user = new User({
      name: "asdasd",
      email: "333@333.com",
      password: "1234567",
    });

    comparePasswordStub = sandbox.stub(user, "comparePassword");
  });
  afterEach(() => {
    // !important to call this in afterEach.
    sandbox.restore();
  });

  test("should login w/ correct credentials", async () => {
    // spy just spy on the function without replacing the function itself.
    const jwtSignSpy = sandbox.spy(jwt, "sign");

    comparePasswordStub.resolves(true);
    findOneStub.resolves(user);

    //should resolves stub before request.
    const result = await request(app)
      .post("/api/auth/login")
      .send({
        email: "333@333.com",
        password: "1234567",
      })
      .expect(200);
    expect(typeof result.body.token === "string").toBe(true);
    expect(result.body.email).toBe(user.email);
    expect(result.body.name).toBe(user.name);
    expect(typeof result.body.image).toBe("string");
    expect(typeof result.body.id).toBe("string");
    expect(jwtSignSpy.calledOnce).toBe(true);
    expect(
      jwtSignSpy.calledWithExactly(
        { _id: user.id, email: user.email },
        process.env._PASSPORT_SECRET
      )
    ).toBe(true);
  });

  test("should not login with wrong password ", async () => {
    comparePasswordStub.resolves(false);
    findOneStub.resolves(user);
    const result = await request(app)
      .post("/api/auth/login")
      .send({
        email: "333@333.com",
        password: "1234567",
      })
      .expect(401);
    expect(result.text).toBe("Wrong email or password.");
  });

  test("should 404 when user not found ", async () => {
    comparePasswordStub.resolves(false);
    findOneStub.resolves(null);
    const result = await request(app)
      .post("/api/auth/login")
      .send({
        email: "333@333.com",
        password: "1234567",
      })
      .expect(404);
    expect(result.text).toBe("User not found.");
    expect(comparePasswordStub.notCalled).toBe(true);
    expect(findOneStub.calledOnce).toBe(true);
    expect(findOneStub.firstCall.args[0]).toEqual({ email: user.email });
  });
});

//-----------------------------------------------------------------

describe("signup", () => {
  let sandbox = sinon.createSandbox();
  let findOneStub;
  let user;
  let newUserSaveStub;
  beforeEach(() => {
    // stub replace the function and make it return  what we want.
    findOneStub = sandbox.stub(User, "findOne");
    newUser = new User({
      name: "asdasd",
      email: "333@333.com",
      password: "1234567",
    });
    newUserSaveStub = sandbox.stub(User.prototype, "save");
  });
  afterEach(() => {
    // !important to call this in afterEach.
    sandbox.restore();
  });

  test("should signup w/ new email", async () => {
    // spy just spy on the function without replacing the function itself.
    findOneStub.resolves(null);
    newUserSaveStub.resolves(newUser);
    //should resolves stub before request.
    const result = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "333",
        email: "333@333.com",
        password: "1234567",
      })
      .expect(200);
    expect(result.text).toBe("Sign up successful, you can login now!");
  });

  test("should not signup already existed email", async () => {
    findOneStub.resolves(newUser);
    newUserSaveStub.throws();
    const result = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "333",
        email: "333@333.com",
        password: "1234567",
      })
      .expect(400);
    expect(result.text).toBe("This email has already been registered!");
    expect(newUserSaveStub.notCalled).toBe(true);
  });

  test("should not save user.", async () => {
    findOneStub.resolves(user);
    newUserSaveStub.throws();
    const result = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "333",
        email: "333@333.com",
        password: "1234567",
      })
      .expect(500);
    expect(result.text).toBe("User not saved.");
  });
});
