import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import ContactRoutes from "../modules/contact/contact.route";
import MealRoutes from "../modules/meal/meal.route";
import AddressRoutes from "../modules/address/address.route";
import UserRoutes from "../modules/user/user.route";
import OrderRoutes from "../modules/order/order.route";
import ReviewRoutes from "../modules/review/review.route";

const router = Router();
const routes = [
  {
    path: "/auth",
    destination: AuthRoutes,
  },
  {
    path: "/user",
    destination: UserRoutes,
  },
  {
    path: "/contact",
    destination: ContactRoutes,
  },
  {
    path: "/meal",
    destination: MealRoutes,
  },
  {
    path: "/address",
    destination: AddressRoutes,
  },
  {
    path: "/order",
    destination: OrderRoutes,
  },
  {
    path: "/review",
    destination: ReviewRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.destination));
export default router;
