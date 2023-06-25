const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("لطفا ایمیل معتبر وارد نمایید"),
    body("password", "لطفا ترکیبی از اعداد و حروف استفاده نمائید")
      .isLength({ min: 3 })
      .isAlphanumeric(),
    body("rePassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("تکرار رمز عبور اشتباه است");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getResetPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
