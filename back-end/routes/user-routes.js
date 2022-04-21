const router = require("express").Router();
const userController = require("../controllers/userController");
//---------------------------------------------
router.patch("/thumbnail", userController.uploadThumbnail);

module.exports = router;
