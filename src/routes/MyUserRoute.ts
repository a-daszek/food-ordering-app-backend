import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

// if we get this request - /api/my/user, to our backend, then this handler is going to pass the request on to the MyUserController.createCurrentUser function, that handles the business logic
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

router.post("/", jwtCheck, MyUserController.createCurrentUser);

router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);

export default router;
