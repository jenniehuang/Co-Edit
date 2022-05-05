const app = require("../../app");
const request = require("supertest");
const sinon = require("sinon");
const User = require("../../models/user-model");
const Document = require("../../models/document-model");
const bypassAuth = require("../helpers/bypassAuth");

describe("doc", () => {
  let sandbox = sinon.createSandbox();
  let docFindByIdStub;
  let docDeleteOneStub;
  let docUpdateManyStub;
  let docCreateStub;
  let docFindStub;
  let userFindOneStub;
  let userFindStub;
  let userFindByIdStub;
  let userSaveStub;
  let user;
  let anotherUser;
  let document;
  let userToken;
  let anotherUserToken;
  let unAuthUser;
  beforeEach(async () => {
    // stub replace the function and make it return  what we want.
    user = new User({
      name: "asdasd",
      email: "333@333.com",
      password: "1234567",
    });

    anotherUser = new User({
      name: "asdasd",
      email: "666@666.com",
      password: "1234567",
      subscribe: ["72cd56ed-97dc-4e46-9f8a-bcaac516f51d"],
    });

    unAuthUser = new User({
      name: "asdasd",
      email: "999@999.com",
      password: "999999",
    });

    userToken = await bypassAuth(sandbox, user, app);
    anotherUserToken = await bypassAuth(sandbox, anotherUser, app);
    unAuthUserToken = await bypassAuth(sandbox, unAuthUser, app);

    docFindByIdStub = sandbox.stub(Document, "findById");
    docDeleteOneStub = sandbox.stub(Document, "deleteOne");
    docFindStub = sandbox.stub(Document, "find");
    docCreateStub = sandbox.stub(Document, "create");
    docUpdateManyStub = sandbox.stub(User, "updateMany");
    userFindByIdStub = sandbox.stub(User, "findById");
    userFindOneStub = sandbox.stub(User, "findOne");
    userFindStub = sandbox.stub(User, "find");
    userSaveStub = sandbox.stub(User.prototype, "save");

    //for bypassing auth because we can't stub passport authenticate.
    //if we need to use findById again in the same test than use onCall(1), onCall(2) ...etc
    userFindByIdStub.onCall(0).resolves(user);

    document = new Document({
      _id: "72cd56ed-97dc-4e46-9f8a-bcaac516f51d",
      host: user._id,
    });
  });
  afterEach(() => {
    // !important to call this in afterEach.
    sandbox.restore();
  });

  //------------------------------------------------------------------------

  describe("recentlyOpened", () => {
    test("should get recently opened docs", async () => {
      const data = {
        recentlyOpened: [
          {
            _id: {
              _id: "4219b7b4-b10d-40f8-92ec-5996e61160c1",
              title: "Untitled Document",
              host: {
                _id: "626adebb367ee4ced90661fc",
                name: "888",
                email: "888@888.com",
              },
              background: "https://images",
            },
            lastOpened: "2022-04-29T09:59:01.710Z",
          },
        ],
      };
      const mockQuery = {
        select: sinon.stub().returnsThis(),
        populate: sinon.stub().returns(data),
      };

      userFindOneStub.returns(mockQuery);
      const result = await request(app)
        .get(`/api/doc/recentlyOpened`)
        .set("Authorization", userToken)
        .expect(200);
      expect(result.body).toStrictEqual([
        {
          _id: "4219b7b4-b10d-40f8-92ec-5996e61160c1",
          title: "Untitled Document",
          host: {
            _id: "626adebb367ee4ced90661fc",
            name: "888",
            email: "888@888.com",
          },
          background: "https://images",
          lastOpened: "2022-04-29T09:59:01.710Z",
        },
      ]);
    });

    test("cannot get recently opened docs", async () => {
      userFindOneStub.throws();
      const result = await request(app)
        .get(`/api/doc/recentlyOpened`)
        .set("Authorization", userToken)
        .expect(500);

      expect(result.text).toStrictEqual("Sorry, something went wrong.");
    });
  });

  //------------------------------------------------------------------------

  describe("myDoc", () => {
    test("should get my docs", async () => {
      const data = [
        {
          _id: "4219b7b4-b10d-40f8-92ec-5996e61160c1",
          title: "Untitled Document",
          host: {
            _id: "626adebb367ee4ced90661fc",
            name: "888",
            email: "888@888.com",
          },
          background: "https://images",
          lastModified: "2022-04-29T09:58:51.350Z",
          __v: 0,
        },
      ];

      const mockQuery = {
        select: sinon.stub().returnsThis(),
        populate: sinon.stub().returns(data),
      };

      docFindStub.returns(mockQuery);
      const result = await request(app)
        .get(`/api/doc/mydoc`)
        .set("Authorization", userToken)
        .expect(200);
      expect(result.body).toStrictEqual(data);
    });

    test("cannot get my docs", async () => {
      docFindStub.throws();
      const result = await request(app)
        .get(`/api/doc/mydoc`)
        .set("Authorization", userToken)
        .expect(500);

      expect(result.text).toStrictEqual("Sorry, something went wrong.");
    });
  });

  //------------------------------------------------------------------------

  describe("shared", () => {
    test("should get docs shared with me", async () => {
      const data = {
        subscribe: [
          {
            _id: "0f67bb5b-bc8d-4dfd-9f3c-6a3a97324b0f",
            title: "t2",
            host: {
              _id: "626adeda367ee4ced9066208",
              name: "林莉莉",
              email: "lilylin3297@gmail.com",
            },
            background: "https://images.",
            lastModified: "2022-05-04T01:02:56.546Z",
          },
        ],
      };

      const mockQuery = {
        select: sinon.stub().returnsThis(),
        populate: sinon.stub().returns(data),
      };

      userFindOneStub.returns(mockQuery);
      const result = await request(app)
        .get(`/api/doc/shared`)
        .set("Authorization", userToken)
        .expect(200);
      expect(result.body).toStrictEqual(data.subscribe);
    });

    test("cannot get docs shared with me", async () => {
      userFindOneStub.throws();
      const result = await request(app)
        .get(`/api/doc/shared`)
        .set("Authorization", userToken)
        .expect(500);

      expect(result.text).toStrictEqual("Sorry, something went wrong.");
    });
  });

  //------------------------------------------------------------------------

  describe("docUserList", () => {
    test("should get docs user list", async () => {
      const data = [{ name: "asd", email: "asd@asd.com" }];
      const mockQuery = {
        select: sinon.stub().returns(data),
      };
      docFindByIdStub.resolves(document);
      userFindStub.returns(mockQuery);
      const result = await request(app)
        .get(`/api/doc/users/${document._id}`)
        .set("Authorization", userToken)
        .expect(200);
      expect(result.body).toStrictEqual(data);
    });

    test("cannot get if it's not host", async () => {
      docFindByIdStub.resolves({
        host: anotherUser._id,
      });
      const result = await request(app)
        .get(`/api/doc/users/${document._id}`)
        .set("Authorization", userToken)
        .expect(403);

      expect(result.text).toBe("Sorry! You are not authorized to access this.");
    });
  });

  //------------------------------------------------------------------------

  describe("getOneOrCreate", () => {
    test("host can get one that already exists", async () => {
      const mockQuery = {
        populate: sinon.stub().returns(document),
      };
      docFindByIdStub.returns(mockQuery);

      const result = await request(app)
        .get(`/api/doc/${document._id}`)
        .set("Authorization", userToken)
        .expect(200);

      expect(JSON.stringify(result.body)).toStrictEqual(
        JSON.stringify(document)
      );
    });

    test("member can get one that already exists", async () => {
      userFindByIdStub.onCall(0).resolves(anotherUser);
      const mockQuery = {
        populate: sinon.stub().returns(document),
      };
      docFindByIdStub.returns(mockQuery);
      const result = await request(app)
        .get(`/api/doc/${document._id}`)
        .set("Authorization", anotherUserToken)
        .expect(200);
      expect(JSON.stringify(result.body)).toStrictEqual(
        JSON.stringify(document)
      );
    });

    test("should not get without credentials", async () => {
      userFindByIdStub.onCall(0).resolves(unAuthUser);
      const mockQuery = {
        populate: sinon.stub().returns(document),
      };
      docFindByIdStub.returns(mockQuery);

      const result = await request(app)
        .get(`/api/doc/${document._id}`)
        .set("Authorization", unAuthUserToken)
        .expect(403);
      expect(result.text).toBe(
        "Sorry! You are not authorized to access this document."
      );
    });

    test("should create a new one", async () => {
      const mockQuery = {
        populate: sinon.stub().returns(null),
      };
      const newDoc = new Document({
        _id: document._id,
        data: "",
      });
      docFindByIdStub.returns(mockQuery);
      docCreateStub.resolves(newDoc);
      const result = await request(app)
        .get(`/api/doc/${document._id}`)
        .set("Authorization", userToken)
        .expect(200);
      expect(JSON.stringify(result.body)).toStrictEqual(JSON.stringify(newDoc));
    });
  });

  //------------------------------------------------------------------------

  describe("grantAccess", () => {
    test("grant access", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(user);
      userSaveStub.resolves(user);
      const result = await request(app)
        .patch(`/api/doc/access`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: "ILoveBlackPink",
        })
        .expect(200);
      expect(result.text).toBe("Access granted!");
    });

    test("should not grant if input email is host itself.", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(user);
      const result = await request(app)
        .patch(`/api/doc/access`)
        .set("Authorization", userToken)
        .send({
          email: user.email,
          docId: "ILoveBlackPink",
        })
        .expect(400);
      expect(result.text).toBe("This user already joined this document!");
      expect(userSaveStub.notCalled).toBe(true);
    });

    test("should not grant if input email is already join.", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(anotherUser);
      const result = await request(app)
        .patch(`/api/doc/access`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: document._id,
        })
        .expect(400);
      expect(result.text).toBe("This user already joined this document!");
      expect(userSaveStub.notCalled).toBe(true);
    });

    test("should not grant if document not found.", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(null);
      const result = await request(app)
        .patch(`/api/doc/access`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: document._id,
        })
        .expect(404);
      expect(result.text).toBe("User not found!");
      expect(userSaveStub.notCalled).toBe(true);
    });

    test("should not grant if user not found.", async () => {
      docFindByIdStub.resolves(null);
      const result = await request(app)
        .patch(`/api/doc/access`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: "ILoveBlackPink",
        })
        .expect(404);
      expect(result.text).toBe("document not found!");
      expect(userSaveStub.notCalled).toBe(true);
      expect(userFindOneStub.notCalled).toBe(true);
    });

    test("should not grant without credentials.", async () => {
      docFindByIdStub.resolves({
        host: anotherUser._id,
      });
      const result = await request(app)
        .patch(`/api/doc/access`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: "ILoveBlackPink",
        })
        .expect(403);
      expect(result.text).toBe("Unauthorized Access.");
      expect(userSaveStub.notCalled).toBe(true);
      expect(userFindOneStub.notCalled).toBe(true);
    });

    test("should not grant if save went wrong", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(user);
      userSaveStub.throws();

      const result = await request(app)
        .patch(`/api/doc/access`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: "ILoveBlackPink",
        })
        .expect(500);
      expect(result.text).toBe("Sorry, something went wrong.");
    });
  });

  //------------------------------------------------------------------------

  describe("removeUser", () => {
    test("remove user's access to the document", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(anotherUser);
      userSaveStub.resolves(anotherUser);
      const result = await request(app)
        .patch(`/api/doc/remove`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: document._id,
        })
        .expect(200);
      expect(result.text).toBe("User removed!");
    });

    test("should not grant if input email was not in list.", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(unAuthUser);
      const result = await request(app)
        .patch(`/api/doc/remove`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: document._id,
        })
        .expect(400);
      expect(result.text).toBe("This is not in the list.");
      expect(userSaveStub.notCalled).toBe(true);
    });

    test("should not grant if user not found.", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(null);
      const result = await request(app)
        .patch(`/api/doc/remove`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: "ILoveBlackPink",
        })
        .expect(404);
      expect(result.text).toBe("User not found!");
      expect(userSaveStub.notCalled).toBe(true);
    });

    test("should not grant if doc not found.", async () => {
      docFindByIdStub.resolves(null);
      const result = await request(app)
        .patch(`/api/doc/remove`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: "ILoveBlackPink",
        })
        .expect(404);
      expect(result.text).toBe("document not found!");
      expect(userSaveStub.notCalled).toBe(true);
      expect(userFindOneStub.notCalled).toBe(true);
    });

    test("should not grant without credentials.", async () => {
      docFindByIdStub.resolves({
        host: anotherUser._id,
      });
      const result = await request(app)
        .patch(`/api/doc/remove`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: "ILoveBlackPink",
        })
        .expect(403);
      expect(result.text).toBe("Unauthorized Access.");
      expect(userSaveStub.notCalled).toBe(true);
      expect(userFindOneStub.notCalled).toBe(true);
    });

    test("should not grant if save went wrong", async () => {
      docFindByIdStub.resolves(document);
      userFindOneStub.resolves(anotherUser);
      userSaveStub.throws();

      const result = await request(app)
        .patch(`/api/doc/remove`)
        .set("Authorization", userToken)
        .send({
          email: "user@example.com",
          docId: document._id,
        })
        .expect(500);
      expect(result.text).toBe("Sorry, something went wrong.");
    });
  });

  //------------------------------------------------------------------------

  describe("deleteDoc", () => {
    test("delete successfully", async () => {
      docFindByIdStub.resolves(document);
      const result = await request(app)
        .delete(`/api/doc/${document._id}`)
        .set("Authorization", userToken)
        .expect(200);
      expect(result.text).toBe("Document deleted!");
      expect(docDeleteOneStub.calledWithExactly({ _id: document._id })).toBe(
        true
      );
    });

    test("doc not found", async () => {
      docFindByIdStub.resolves(null);
      const result = await request(app)
        .delete(`/api/doc/${document._id}`)
        .set("Authorization", userToken)
        .expect(404);
      expect(result.text).toBe("document not found!");
    });
  });
});
