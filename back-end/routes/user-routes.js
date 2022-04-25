const router = require("express").Router();
const userController = require("../controllers/userController");
//---------------------------------------------
router.patch("/userData", userController.uploadUserData);
router.get("/:_id", userController.getUserInfo);

module.exports = router;
