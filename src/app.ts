import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

// middlewares and parser
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

// get started
const getRoot = (req: Request, res: Response) => {
  res.json({statusCode: 200, success: true, message: "MealBox is running"});
};
app.get("/", getRoot);

// application routes
app.use("/api/v1", router);

// global error handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
