import { Router } from "express";

const router = Router();
const routes = [
  {
    path: "/api/v1/...",
    // destination: controller,
  },
];

// routes.forEach((route) => router.use(route.path, route.destination));
export default router;