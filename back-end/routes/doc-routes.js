const router = require("express").Router();
const docController = require("../controllers/docController");

//------------------------------C-----post-----------------------
//create in get.

//------------------------------R-----get-----------------------
router.get("/recentlyOpened", docController.recentlyOpened);

// get docs created by current user.
router.get("/mydoc", docController.myDoc);

// get docs shared with current user.
router.get("/shared", docController.shared);

//get doc's users list.
router.get("/users/:_id", docController.docUserList);

//get one or create.
router.get("/:_id", docController.getOneOrCreate);

//-------------------------------U----patch----------------------------
//host grant access to another user.
router.patch("/access", docController.grantAccess);

//kick a user out of a doc.
router.patch("/remove", docController.removeUser);

//-------------------------------D-----delete---------------------------
//host delete doc
router.delete("/:_id", docController.deleteDoc);

module.exports = router;
