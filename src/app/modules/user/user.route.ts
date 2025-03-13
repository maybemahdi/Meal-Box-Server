import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { USER_ROLE } from "./user.constant";

const UserRoutes = Router();

UserRoutes.get("/", auth(USER_ROLE.ADMIN), UserController.getAllUsers);
UserRoutes.get("/get-me", auth(USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER), UserController.getMe);

export default UserRoutes;
