/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = 500;
  const message =
    err instanceof ZodError
      ? err.errors
          .map(
            (e) =>
              `${e.path.length > 0 ? e.path.join(".") : "Root"}: ${e.message}`,
          )
          .join(", ")
      : err instanceof Error
        ? err.message
        : "Something Went Wrong";

  if (err instanceof Error) {
    res.status(statusCode).json({
      success: false,
      message,
      error: err,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      message,
      error: err,
    });
  }
};

export default globalErrorHandler;
