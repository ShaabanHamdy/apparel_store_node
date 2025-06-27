import { Router } from "express";
import { asyncHandling } from "../../utils/error_handling.js";
import * as userController from "./user_controller.js";
import * as userValidation from "./user_validation.js";



const router = Router()



router.post("/signup",userValidation.signupValidation, asyncHandling(userController.signup))
// =============================================================
router.post("/login", asyncHandling(userController.login))
// =============================================================

router.get("/getAllUsers", asyncHandling(userController.getAllUsers))
// =============================================================

router.delete("/deleteUser/:_id", asyncHandling(userController.deleteOneUser))
// =============================================================


router.delete("/deleteAllUsers", asyncHandling(userController.deleteAllUsers))







export default router