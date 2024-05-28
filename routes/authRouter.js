import express from "express";
import authControllers from "../controllers/usersControllers.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";
import {
  changeSubscriptionSchema,
  userSigninSchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSigninSchema),
  authControllers.register
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userSigninSchema),
  authControllers.login
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(changeSubscriptionSchema),
  authControllers.changeSubscription
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.changeAvatar
);

export default authRouter;
