import { asyncHandling } from "../../utils/error_handling.js"
import * as categoryConnection from "./category_controller.js"
import { Router } from "express"
const router = Router()






router.post("/createCategory",
    asyncHandling(categoryConnection.createCategory))


// ========================================================================
router.get("/getAllCategories",
    asyncHandling(categoryConnection.getAllCategories))



// ========================================================================
router.delete("/deleteAllCategories",
    asyncHandling(categoryConnection.deleteAllCategories))



// ========================================================================
router.get("/getOneCategory/:categoryId",
    asyncHandling(categoryConnection.getOneCategory))










export default router