import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import ContactRoutes from "../modules/contact/contact.route";

const router = Router();
const routes = [
  {
    path: "/auth",
    destination: AuthRoutes,
  },
  {
    path: "/contact",
    destination: ContactRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.destination));
export default router;
